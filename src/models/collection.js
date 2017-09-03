const db = require('../db');

class Collection {
  constructor(klass) {
    this.klass = klass;
    this._where = {};
    this._order = {};
    this._limit = undefined;
    this._offset = undefined;
  }

  clone() {
    let cloned = new this.constructor(this.klass);
    cloned._where = Object.assign({}, this._where);
    cloned._order = Object.assign({}, this._order);
    cloned._limit = this._limit;
    cloned._offset = this._offset;
    return cloned;
  }

  where(value) {
    let assignd = this.clone();
    assignd._where = Object.assign(assignd._where, value);
    return assignd;
  }

  order(column, direction = "asc") {
    let assignd = this.clone();
    assignd._order = { column: column, direction: direction };
    return assignd;
  }

  then(f) {
    let sqlParts = [`SELECT * FROM ??`];
    let sqlValues = [this.klass.tableName()];
    if (Object.keys(this._where).length > 0) {
      sqlParts.push('WHERE');
      let wheres = [];
      Object.keys(this._where).forEach((key) => {
        wheres.push('?? = ?')
        sqlValues.push(key, this._where[key]);
      })
      sqlParts.push(wheres.join(' AND '));
    }
    if(this._order.column) {
      sqlParts.push('ORDER BY');
      if(this._order.direction.toLowerCase() == "asc") {
        sqlParts.push('?? DESC');
      } else {
        sqlParts.push('?? DESC');
      }
      sqlValues.push(this._order.column);
    }
    return new Promise((resolve, reject) => {
      db.query(sqlParts.join(' '), sqlValues).then((result) => {
        let fields = result[1];
        let rows = result[0];
        let records = rows.map((row) => {
          return new this.klass(row);
        });
        resolve(records);
      }).catch((error) => {
        reject(error);
      });
    }).then(f);
  }
}

module.exports = Collection;