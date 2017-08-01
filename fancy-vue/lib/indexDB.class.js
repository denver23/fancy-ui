let DEBUG = false;

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

export default class IndexDB {

  constructor(options) {

    this.db = null;
    this.options = {
      dbname: 'test',
      data: null,
      version: 1,
      onsuccess() {},
      onupgradeneeded() {},
    };
    Object.assign(this.options, options);

    DEBUG = !!this.options.debug;

    if (!indexedDB) {
      DEBUG && console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      return false;
    }

    let self = this;
    let req = indexedDB.open(self.options.dbname, self.options.version || 1);
    req.onerror = (e) => DEBUG && console.log('Database error: ' + e.target.errorCode);
    req.onsuccess = (e) => {

      DEBUG && console.log('Database open success');
      self.db = e.target.result;
      self.options.onsuccess.call(self);
    }
    req.onupgradeneeded = (e) => {

      DEBUG && console.log('Database upgrade start');
      //self.version = e.newVersion;
      let db = e.target.result;
      let transaction = e.currentTarget.transaction;
      // 建表
      if (Array.isArray(self.options.data)) {
        for (let table of self.options.data) {
          if (!table.name) continue;
          // 创建空间
          let store = null;
          if (!db.objectStoreNames.contains(table.name)) {
            store = db.createObjectStore(
              table.name, {
                autoIncrement: !!table.autoIncrement,
                keyPath: table.keyPath || 'id',
              }
            );
          }
          store = store || transaction.objectStore(table.name);
          // 创建索引
          if (table.indexs) {
            for (let ind of table.indexs) {
              // 创建索引
              let indexName = ind.name || ind.field;
              if (!store.indexNames.contains(indexName)) {
                store.createIndex(
                  indexName,
                  ind.field, {
                    unique: ind.unique || false
                  }
                );
              }
            }
          }
        }
      }
      // 其他
      self.options.onupgradeneeded.call(self, transaction);
    };
  }

  newTransaction(storeName, mode = 'readonly') {

    if (storeName && this.db.objectStoreNames.contains(storeName)) {
      let tr = this.db.transaction(storeName, mode);
      let store = tr.objectStore(storeName);
      return [tr, store];
    }
    DEBUG && console.log(storeName + " isn't exist");
    return [];
  }

  clear(storeName) {

      let [tr, store] = this.newTransaction(storeName, 'readwrite');
      if (!tr || !store) return;

      let req = store.clear();
      req.onsuccess = (e) => DEBUG && console.log(storeName + ' clear success');
      req.onerror = (e) => DEBUG && console.log(storeName + " clear fail : ", e.target.errorCode);
    }
    // 插入 表名,数组数据
  insert(storeName, value, callback) {

      if (!value) return;
      let [tr, store] = this.newTransaction(storeName, 'readwrite');
      if (!tr || !store) return;

      if (Array.isArray(value)) {
        for (let v of value) {
          let req = store.add(v);
          req.onerror = (e) => DEBUG && console.log(v, e.target.error);
        }
      } else {
        let req = store.add(value);
        req.onerror = (e) => DEBUG && console.log(value, e.target.error);
      }
      tr.oncomplete = (e) => callback && callback();
    }
    // 获取数量
  getCount(storeName, callback) {

    let [tr, store] = this.newTransaction(storeName);
    if (!tr || !store) return;

    let req = store.count();
    req.onsuccess = (e) => callback && callback(e.target.result);
    req.onerror = (e) => DEBUG && console.log(e.target.result);
  }

  getByKey(storeName, key, callback) {

    let [tr, store] = this.newTransaction(storeName);
    if (!tr || !store) return;

    let req = store.get(key);
    req.onsuccess = (e) => callback && callback(e.target.result);
    req.onerror = (e) => DEBUG && console.log(e.target.result);
  }

  query(storeName, indexName, range, callback) {

    let [tr, store] = this.newTransaction(storeName);
    if (!store) return;

    var rb = IDBKeyRange.bound([33, "20140927"], [36, "20140927"], false, false);
    let res = [];
    let req = store.index(indexName);
    // 游标循环
    req.openCursor(rb).onsuccess = (e) => {
      let cursor = e.target.result;
      if (cursor && cursor.value) {
        res.push(cursor.value);
        cursor.continue();
      }
    }
    tr.oncomplete = () => callback && callback(res);
  }
}
// // All keys ≤ x
// var r1 = IDBKeyRange.upperBound(x);

// // All keys < x
// var r2 = IDBKeyRange.upperBound(x, true);

// // All keys ≥ y
// var r3 = IDBKeyRange.lowerBound(y);

// // All keys > y
// var r4 = IDBKeyRange.lowerBound(y, true);

// // All keys ≥ x && ≤ y
// var r5 = IDBKeyRange.bound(x, y);

// // All keys > x &&< y
// var r6 = IDBKeyRange.bound(x, y, true, true);

// // All keys > x && ≤ y
// var r7 = IDBKeyRange.bound(x, y, true, false);

// // All keys ≥ x &&< y
// var r8 = IDBKeyRange.bound(x, y, false, true);

// // The key = z
// var r9 = IDBKeyRange.only(z);
