class XcServerDatabase {
  constructor({
                databaseFileName, loadCallBack, saveCallback
              }) {

    this.databaseModifiedCounter = 0;
    const fs = require('fs');

    // Load database
    if (fs.existsSync(databaseFileName)) {
      const loadedDatabaseContent = fs.readFileSync(databaseFileName, 'utf8');
      loadCallBack(loadedDatabaseContent);
    }

    // Save database
    setInterval(()=> {
      if (this.databaseModifiedCounter === 0) {
        return;
      }

      const newDatabaseContent = saveCallback();
      fs.writeFile(databaseFileName, newDatabaseContent, { flag: 'w' }, (error) => {
        if (error) {
          console.error('Cannot save database.')
        } else {
          this.databaseModifiedCounter = 0;
        }
      });
    }, 10*1000);
  }

  notifyModification() {
    ++ this.databaseModifiedCounter;
  }
}
