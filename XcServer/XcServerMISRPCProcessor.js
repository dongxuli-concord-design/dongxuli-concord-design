class XcEnterpriseUser {
  #id;
  #createdTimestamp;
  name;
  isActive;
  customProperties;

  constructor({name}) {
    this.name = name;
    this.#id = Math.floor(Math.random() * Date.now());
    this.#createdTimestamp = new Date().toLocaleString();
  }

  fromJSON({json}) {
    this.name = json.name;
    this.#id = json.id;
    this.#createdTimestamp = json.createdTimestamp;
    this.isActive = json.isActive;
    this.customProperties = json.customProperties;
  }

  toJSON() {
    return {
      name: this.name,
      id: this.#id,
      createdTimestamp: this.#createdTimestamp,
      isActive: this.isActive,
      customProperties: this.customProperties
    }
  }
}

class XcEnterpriseGroupPost {
  author;
  content;
  timestamp;

  constructor({author, content}) {
    this.author = author;
    this.content = content;
    this.timestamp = new Date().toLocaleString();
  }

  fromJSON({json}) {
    this.author = json.author;
    this.content = json.content;
    this.timestamp = json.timestamp;
  }

  toJSON() {
    return {
      author: this.author,
      content: this.content,
      timestamp: this.timestamp
    }
  }
}

class XcEnterpriseGroup {
  static IdToGroupMap = new Map();
  static FavoriteGroups = new Set();
  name;
  id;
  manager;
  collaborators;
  posts;
  parentGroup;
  isArchived;
  #children;

  constructor({name, manager}) {
    this.name = name;
    this.manager = manager;
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    XcEnterpriseGroup.IdToGroupMap.set(this.id, this);

    this.collaborators = [];
    this.posts = [];
    this.parentGroup = null;
    this.isArchived = false;
    this.#children = [];
  }

  clear() {
    this.name = '';
    this.manager = null;
    XcEnterpriseGroup.IdToGroupMap.delete(this.id);
    this.id = '';

    this.collaborators = [];
    this.posts = [];
    this.parentGroup = null;
    this.isArchived = false;
    this.#children = [];
  }

  get children() {
    return this.#children;
  }

  addChild(group) {
    this.#children.push(group);
    group.parentGroup = this;
  }

  fromJSON({json}) {
    this.clear();
    this.name = json.name;
    this.manager = json.manager;
    this.id = json.id;
    XcEnterpriseGroup.IdToGroupMap.set(this.id, this);
    this.collaborators = json.collaborators;
    this.isArchived = json.isArchived;
    for (const postJson of json.posts) {
      const post = new XcEnterpriseGroupPost();
      post.fromJSON({json: postJson});
      this.posts.push(post);
    }

    for (const childJson of json.children) {
      const child = new XcEnterpriseGroup();
      child.fromJSON({json: childJson});
      child.parentGroup = this;
      this.children.push(child);
    }
  }

  toJSON() {
    const postsJson = [];
    for (const post of this.posts) {
      postsJson.push(post.toJSON());
    }

    const childrenJson = [];
    for (const child of this.children) {
      childrenJson.push(child.toJSON());
    }

    return {
      name: this.name,
      manager: this.manager,
      id: this.id,
      collaborators: this.collaborators,
      posts: postsJson,
      isArchived: this.isArchived,
      children: childrenJson,
    }
  }
}

class XcServerMISRPCProcessor extends XcServerHttpRPCProcessor {
  static homeGroup = new XcEnterpriseGroup({name: '', manager: null});

  static #homeGroupDb = new XcServerDatabase({
    databaseFileName: __dirname + '/database/' + 'mis.json',
    loadCallBack: (loadedDatabaseContent) => {
      XcServerMISRPCProcessor.homeGroup.clear();
      try {
        const json = JSON.parse(loadedDatabaseContent);
        XcServerMISRPCProcessor.homeGroup = new XcEnterpriseGroup();
        homeGroup.fromJSON({json});
      } catch (error) {
        console.error(error);
      }
    },
    saveCallback: () => {
      return JSON.stringify(XcServerMISRPCProcessor.homeGroup.toJSON(), null, '\t');
    }
  });

  constructor({res, methodName, params}) {
    super({res, methodName, params});
    this.returnValue = {error: null};
  }

  * run () {
    try {
      switch (this.methodName) {
        case 'getGroup':
          this.returnValue = yield* this.getGroup();
          break;
        case 'getFavoriteGroups':
          this.returnValue = yield* this.getFavoriteGroups();
          break;
        case 'createGroup':
          this.returnValue = yield* this.createGroup();
          break;
        case 'bookmarkGroup':
          this.returnValue = yield* this.bookmarkGroup();
          break;
        case 'archiveGroup':
          this.returnValue = yield* this.archiveGroup();
          break;
        case 'addPostToGroup':
          this.returnValue = yield* this.addPostToGroup();
          break;
        default:
          throw 'Unexpected internal state';
      }
      return this.res.status(200).json(this.returnValue);
    } catch (error) {
      return this.res.status(200).json({error: error});
    }
  }

  //params: groupID
  //return: {error, groupData}
  * getGroup() {
    try {
      const group = XcServerMISRPCProcessor.homeGroup;

      if (this.params.groupID) {
        if (XcEnterpriseGroup.IdToGroupMap.has(this.params.groupID)) {
          group = XcEnterpriseGroup.IdToGroupMap.get(this.params.groupID);
        } else {
          this.returnValue = {error: 'groupID does not exist', group: null};
          return this.returnValue;
        }

      }

      const postsJson = [];
      for (const post of group.posts) {
        postsJson.push(post.toJSON());
      }

      const childrenJson = [];
      for (const child of group.children) {
        childrenJson.push({
          name: child.name,
          id: child.id,
        });
      }

      const groupData = {
        name: group.name,
        manager: group.manager,
        id: group.id,
        collaborators: group.collaborators,
        posts: postsJson,
        isArchived: group.isArchived,
        children: childrenJson,
      };

      this.returnValue = {error: null, groupData: groupData};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  //params:
  //return: {error, favoriteGroups: [{groupId, groupName}, ...]}
  * getFavoriteGroups() {
    try {
      const favoriteGroupsJson = [];
      for (const group of XcEnterpriseGroup.FavoriteGroups) {
        favoriteGroupsJson.push({
          groupId: group.id,
          groupName: group.name,
        });
      }

      this.returnValue = {error: null, favoriteGroups: favoriteGroupsJson};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  //params:(parentGroupID), groupName
  //return: {error, groupID}
  * createGroup() {
    try {
      if (!this.params.groupName) {
        this.returnValue = {error: 'Invalid name'};
        return this.returnValue;
      }

      const parentGroup = XcServerMISRPCProcessor.homeGroup;
      if (this.params.parentGroupID) {
        parentGroup = XcEnterpriseGroup.IdToGroupMap.get(this.params.parentGroupID);
        // Assert
      }

      const newGroup = new XcEnterpriseGroup({name: this.params.groupName});
      parentGroup.addChild(newGroup);
      XcEnterpriseGroup.IdToGroupMap.set(newGroup.id, newGroup);

      XcServerMISRPCProcessor.#homeGroupDb.notifyModification();

      this.returnValue = {error: null, groupID: newGroup.id};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  //params:groupID
  //return: {error}
  * bookmarkGroup() {
    try {
      if (!this.params.groupID) {
        this.returnValue = {error: 'Invalid group ID'};
        return this.returnValue;
      }

      const group = XcEnterpriseGroup.IdToGroupMap.get(this.params.groupID);
      //Assert

      if (!XcEnterpriseGroup.FavoriteGroups.has(group)) {
        XcEnterpriseGroup.FavoriteGroups.add(group);
        XcServerMISRPCProcessor.#homeGroupDb.notifyModification();
      }

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  //params:groupID
  //return: {error}
  * archiveGroup() {
    try {
      if (!this.params.groupID) {
        this.returnValue = {error: 'Invalid group ID'};
        return this.returnValue;
      }

      const group = XcEnterpriseGroup.IdToGroupMap.get(this.params.groupID);
      //Assert

      if (!group.isArchived) {
        group.isArchived = true;
        XcServerMISRPCProcessor.#homeGroupDb.notifyModification();
      }

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  //params:groupID, groupPostData: {author, content}
  //return: {error}
  * addPostToGroup() {
    try {
      if (!this.params.groupID) {
        this.returnValue = {error: 'Invalid group ID'};
        return this.returnValue;
      }

      if (!this.params.groupPostData) {
        this.returnValue = {error: 'Invalid group post data'};
        return this.returnValue;
      }

      const groupPost = new XcEnterpriseGroupPost({author: this.params.groupPostData.author, content: this.params.groupPostData.content});

      const group = XcEnterpriseGroup.IdToGroupMap.get(this.params.groupID);
      //Assert

      group.posts.push(groupPost);
      XcServerMISRPCProcessor.#homeGroupDb.notifyModification();

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }
}
