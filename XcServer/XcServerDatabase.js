class XcServerDatabase {

  databaseFileName;
  onSaveCallback;
  saveDelay;

  #saveNotificationCallbacks;

  constructor({
                databaseFileName, onSaveCallback, saveDelay = 1000 * 60
              }) {
    this.databaseFileName = databaseFileName;
    this.onSaveCallback = onSaveCallback;
    this.saveDelay = saveDelay;

    this.#saveNotificationCallbacks  = [];
  }

  init() {
    this.#saveNotificationCallbacks.length = 0;

    const fs = require('fs');

    if (!fs.existsSync(this.databaseFileName)) {
      throw 'Database file not found.';
    }

    const loadedDatabaseContent = fs.readFileSync(this.databaseFileName, 'utf8');

    setInterval(()=> {
      if (this.#saveNotificationCallbacks.length === 0) {
        return;
      }

      const newDatabaseContent = this.onSaveCallback();
      fs.writeFile(this.databaseFileName, newDatabaseContent, { flag: 'w' }, (error) => {
        this.#saveNotificationCallbacks.forEach(saveNotificationCallback => saveNotificationCallback({error}));
        this.#saveNotificationCallbacks.length = 0;
      });
    }, this.saveDelay);

  }

  notifyModification({saveNotificationCallback}) {
    this.#saveNotificationCallbacks.push(saveNotificationCallback);
  }
}
