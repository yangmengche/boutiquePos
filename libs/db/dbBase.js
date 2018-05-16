'use strict';
const mongoose = require('mongoose');
const log = require('../logger');
const DBSchema = require('./dbSchema');
const config = require('../../config/config');
const errKeys = require('../statusCode').ErrorKeys;
const errCode = require('../statusCode').ErrorCode;

mongoose.Promise = global.Promise;

class Database{
  static connect() {
    return new Promise(async (resolve, reject) => {
      var options = {
        keepAlive: 1,
        autoIndex: false,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,
      };
      mongoose.connect(config.dbPath, options);
      var db = mongoose.connection;
      db.on('error', (err) => {
        log.writeLog('Connect to DB error: ' + err.message, 'error');
        reject(errCode.DatabaseError);
      });

      db.on('open', () => {
        this.accounts = mongoose.model('accounts', DBSchema.accountSchema);
        this.suppliers = mongoose.model('suppliers', DBSchema.supplierSchema);
        this.categories = mongoose.model('categories', DBSchema.categorySchema);
        this.items = mongoose.model('items', DBSchema.itemSchema);
        this.stockLogs = mongoose.model('stockLogs', DBSchema.stockLogSchema);
        this.receipts = mongoose.model('receipts', DBSchema.receiptSchema);
        log.writeLog('DB connected!', 'info');
        resolve(mongoose.connection);
      });
    });
  }

  static arraytoObjs(models) {
    let rets = [];
    for (let i in models) {
      let obj = models[i].toObject();
      rets.push(obj);
    }
    return rets;
  }
    
  static errorMap(dbErr, model) {
    if(-1 !== errKeys.indexOf(dbErr.id)){
      return dbErr;
    }
    if(dbErr.code){
      // mongo error
      switch (dbErr.code) {
        case 11000:
          return errCode.DuplicateUniqueKeyError;
        default:
          return dbErr;
      }
    }else if(model){
      //mongoose error
      let merr = model.validateSync();
      if(typeof merr === 'function'){
        return errCode.ParameterError;
      }else{
        return dbErr;
      }
    }else{
      // for security scan
      //return errCode.DatabaseError;
      return errCode.ParameterError;      
    }
  }
  static isValidObjectId(id){
    return mongoose.Types.ObjectId.isValid(id);
  }

  static idtoString(ids){
    strIDs=[];
    for (let i in ids) {
      strIDs.push(ids[i].toString());
    }
    return strIDs;
  }

  static createTimeSlotQuery(query, key, from, to) {
    let tmp1 = parseInt(from);
    let tmp2 = parseInt(to);
    query[key] = {};
    if (!isNaN(tmp1)) {
      query[key].$gte = new Date(tmp1);
    }
    if (!isNaN(tmp2)) {
      query[key].$lt = new Date(tmp2);
    }
    if(Object.keys(query[key]).length === 0){
      delete query[key];
    }
    return query;
  }
}

module.exports = Database;