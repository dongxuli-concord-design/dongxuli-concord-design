class XcServerUserRPCProcessor extends XcServerHttpRPCProcessor {
  static #MAX_USER_LIMIT = 100000;
  static #userSessionMap = new Map();
  static #users = new Map();
  static saltRounds = 5;

  static #userDb = new XcServerDatabase({
    databaseFileName: __dirname + '/database/' + 'users.json',
    loadCallBack: (loadedDatabaseContent) => {
      XcServerUserRPCProcessor.#users.clear();
      const entries = JSON.parse(loadedDatabaseContent);
      for (const entry of entries) {
        XcServerUserRPCProcessor.#users.set(entry[0], entry[1]);
      }
    },
    saveCallback: () => {
      return JSON.stringify(Array.from(XcServerUserRPCProcessor.#users.entries()), null, '\t');
    }
  });

  constructor({res, methodName, params}) {
    super({res, methodName, params});
    this.returnValue = {error: null};
  }

  * run () {
    try {
      switch (this.methodName) {
        case 'login':
          this.returnValue = yield* this.login();
          break;
        case 'logout':
          this.returnValue = yield* this.logout();
          break;
        case 'register':
          this.returnValue = yield* this.register();
          break;
        case 'update':
          this.returnValue = yield* this.update();
          break;
        case 'check':
          this.returnValue = yield* this.check();
          break;
        default:
          throw 'Unexpected internal state';
          break;
      }
      return this.res.status(200).json(this.returnValue);
    } catch (error) {
      return this.res.status(200).json({error: error});
    }
  }

  * login() {
    try {
      if (!this.params.username) {
        this.returnValue = {error: 'Invalid username'};
        return this.returnValue;
      }

      if (!this.params.password) {
        this.returnValue = {error: 'Invalid password'};
        return this.returnValue;
      }

      const username = this.params.username;
      const password = this.params.password;

      if (!XcServerUserRPCProcessor.#users.has(username)) {
        this.returnValue = {error: 'user does not exist', user: null};
        return this.returnValue;
      }

      const userInfo = XcServerUserRPCProcessor.#users.get(username);
      if (!bcrypt.compareSync(password, userInfo.password)) {
        this.returnValue = {error: 'wrong password', user: null};
        return this.returnValue;
      }

      if (userInfo.disabled) {
        this.returnValue = {error: 'user is disabled', user: null};
        return this.returnValue;
      }

      // Generate a new token
      const userToken = uuidv4();
      XcServerUserRPCProcessor.#userSessionMap.set(username, userToken);

      this.returnValue = {error: null, userToken, userInfo};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  * logout() {
    try {
      if (!this.params.username) {
        this.returnValue = {error: 'Invalid username'};
        return this.returnValue;
      }

      if (!this.params.password) {
        this.returnValue = {error: 'Invalid password'};
        return this.returnValue;
      }

      if (!this.params.username) {
        this.returnValue = {error: 'Invalid username'};
        return this.returnValue;
      }

      if (!this.params.userToken) {
        this.returnValue = {error: 'Invalid user token'};
        return this.returnValue;
      }

      XcServerUserRPCProcessor.#userSessionMap.delete(params.username);

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  * register() {
    try {
      if (!this.params.username) {
        this.returnValue = {error: 'Invalid username'};
        return this.returnValue;
      }

      if (!this.params.password) {
        this.returnValue = {error: 'Invalid password'};
        return this.returnValue;
      }

      const username = this.params.username;
      const password = this.params.password;
      const profile = this.params.profile;

      if (XcServerUserRPCProcessor.#users.size > XcServerUserRPCProcessor.#MAX_USER_LIMIT) {
        this.returnValue = {error: 'Exceed maximum number of users'};
        return this.returnValue;
      }

      if (XcServerUserRPCProcessor.#users.has(username)) {
        this.returnValue = {error: 'user already exists'};
        return this.returnValue;
      }

      XcServerUserRPCProcessor.#users.set(username, {
        password: bcrypt.hashSync(password, XcServerUserRPCProcessor.saltRounds),
        profile,
        disabled: false,
      });

      XcServerUserRPCProcessor.#userDb.notifyModification();

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  * update() {
    try {
      const username = this.params.username;
      const password = this.params.password;
      const update = this.params.update;
      const newPassword = update.password;
      const newProfile = update.profile;

      if (!XcServerUserRPCProcessor.#users.has(username)) {
        this.returnValue = {error: 'user is not found'};
        return this.returnValue;
      }

      const user = XcServerUserRPCProcessor.#users.get(username);
      if (!bcrypt.compareSync(password, user.password)) {
        this.returnValue = {error: 'wrong password', user: null};
        return this.returnValue;
      }

      if (user.disabled) {
        this.returnValue = res.status(200).json({error: 'user is disabled', user: null});
        return this.returnValue;
      }

      if (newPassword) {
        user.password = bcrypt.hashSync(password, XcServerUserRPCProcessor.saltRounds);
      }

      if (newProfile) {
        user.profile = newProfile;
      }

      XcServerUserRPCProcessor.#userDb.notifyModification();

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }

  * check() {
    try {
      const username = this.params.username;
      const userToken = this.params.userToken;

      if (!XcServerUserRPCProcessor.#userSessionMap.has(username)) {
        this.returnValue = {error: 'User is not authenticated.'};
        return this.returnValue;
      }

      if (userToken !== XcServerUserRPCProcessor.#userSessionMap.get(username)) {
        this.returnValue = {error: 'User is in another session.'};
        return this.returnValue;
      }

      this.returnValue = {error: null};
      return this.returnValue;
    } catch (error) {
      return {error: error};
    }
  }
}
