'use strict';
const mongoose = require('../node_modules/mongoose');
const fse = require('fs-extra');
const config = require('../config/config');
const path = require('path');
const testData = require('./testData');
const dbBase = require('../libs/db/dbBase');

class TestUtils {
  static connectDB() {
    return new Promise((resolve, reject) => {
      var options = {
        keepAlive: 1,
        autoIndex: false,
      };
      if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.dbPath, options, (err) => {
          (err ? reject : resolve)(err);
        });
      } else {
        resolve();
      }
    });
  }

  static checkConnectState(done, reject, count) {
    if (!count) {
      return reject("ERROR, over retry times. [mongoose.connection.readyState]");
    }
    setTimeout(() => {
      if (mongoose.connection.readyState === 0) {
        done();
      } else {
        TestUtils.checkConnectState(done, reject, --count);
      }
    }, 500);
  }

  static disconnectDB() {
    return new Promise((resolve, reject) => {
      if (mongoose.connection.readyState) {
        mongoose.disconnect((err) => {
          (err ? reject(err) : TestUtils.checkConnectState(resolve, reject, 10));
        });
      } else {
        resolve();
      }
    });
  }
  static cleanDatabase() {
    return new Promise((resolve, reject) => {
      this.connectDB()
        .then(() => {
          mongoose.connection.db.dropDatabase((err) => {
            (err ? reject : resolve)(err);
          });
        }).catch((err) => {
          reject(err);
        });
    });
  }
  static sleep(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  static cleanFiles() {
    fse.removeSync(config.resourcePath);
    fse.removeSync(path.resolve(__dirname, 'downloadOutput'));
  }

  static binaryParser(res, callback) {
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function (chunk) {
      res.data += chunk;
    });
    res.on('end', function () {
      callback(null, new Buffer(res.data, 'binary'));
    });
  }

  static removeField(obj, field) {
    for (let k of Object.keys(obj)) {
      if (k === field) {
        delete obj[k];
      } else {
        // let a = obj[k];
        let b = typeof obj[k];
        if (typeof obj[k] === 'object') {
          this.removeField(obj[k], field);
        }
      }
    }
    return obj;
  }

  static fillSupplierID(){
    try{
      for(let k in testData.items){
        let key = testData.items[k].supplierID;
        key = key.substr(1);
        testData.items[k].supplierID = testData.suppliers[key].id
      }
    }catch(err){
      console.log(err.message);
    }
  }

  static fillItemID(){
    try{
      for(let k in testData.stocks){
        let itemID = testData.stocks[k].itemID;
        itemID = itemID.substr(1);
        testData.stocks[k].itemID = testData.items[itemID].id;
      }
      for(let k in testData.receipts){
        for(let i in testData.receipts[k].items){
          let itemID = testData.receipts[k].items[i].itemID;
          itemID = itemID.substr(1);
          testData.receipts[k].items[i].itemID = testData.items[itemID].id;
        }
      }      
    }catch(err){
      console.log(err.message);
    }
  }  
}

module.exports = TestUtils;