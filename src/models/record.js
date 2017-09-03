const db = require('../db');
const Collection = require('./collection');

class Record {
  static collection() {
    return new Collection(this);
  }

  static tableName() {
    throw new Error("You should override this method");
  }

  static columns() {
    throw new Error("You should override this method");
  }

  static updateColumns() {
    return this.columns();
  }

  static insertColumns() {
    return this.columns();
  }

  static find(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM ?? WHERE `id` = ? LIMIT 1;",
        [this.tableName(), id]
      ).then((result) => {
        let rows = result[0];
        let fields = result[1];
        if(rows.length < 1) {
          reject(new Error(`${this.name}(${id}) is not found`));
          return;
        }
        resolve(new this(rows[0]));
      }).catch((error) => {
        reject(error);
      });
    });
  }

  constructor(data) {
    this.data = {};
    this.constructor.columns().forEach((column) => {
      this.data[column] = data[column];
    });
    this.data.id = data.id;
  }

  save() {
    if(this.data.id) {
      return this.update();
    } else {
      return this.insert();
    }
  }

  update() {
    let sqlValues = [this.constructor.tableName()];
    let attributes = {};
    this.constructor.updateColumns().forEach((column) => {
      attributes[column] =  this.data[column];
    });
    sqlValues.push(attributes);
    sqlValues.push(this.data.id);
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE ?? SET ? WHERE `id` = ?",
        sqlValues
      ).then((result) => {
        resolve(this);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  insert() {
    let sqlValues = [this.constructor.tableName()];
    sqlValues.push(this.constructor.insertColumns());
    let attributes = this.constructor.insertColumns().map((column) => {
      return this.data[column];
    });
    sqlValues.push(attributes);
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO ?? (??) VALUES (?);",
        sqlValues
      ).then((result) => {
        let info = result[0];
        let fields = result[1];
        if(this.data.id === undefined || this.data.id === null) {
          this.data.id = info.insertId;
        }
        resolve(this);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  destroy() {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM ?? WHERE `id` = ?",
        [this.constructor.tableName(), this.data.id]
      ).then(() => {
        this.data.id = null;
        resolve(this);
      }).catch((error) => {
        reject(error);
      });
    })
  }

  asJSON() {
    return this.data;
  }

  toJSON() {
    return JSON.stringify(this.asJSON());
  }
}

module.exports = Record;