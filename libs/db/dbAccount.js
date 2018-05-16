'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

dbBase.createDefaultAccount = async () => {
  try {
    let count = await dbBase.accounts.count({ 'account': config.defaultAccount.account });
    if (count <= 0) {
      let defaultAccount = new dbBase.accounts(config.defaultAccount);
      await defaultAccount.save();
    }
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.updateAccount = async (account, accountObj, unset) => {
  try {
    let result;
    if (!!unset) {
      result =  await dbBase.accounts.update({ 'account': account }, { '$set': accountObj, '$unset': unset });
    } else {
      result =  await dbBase.accounts.update({ 'account': account }, { '$set': accountObj });
    }
    return {'nModified': result.nModified}
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.getAccount = async (account) => {
  try {
    return await dbBase.accounts.findOne({ 'account': account }).lean();
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.createAccount = async (account) => {
  try {
    let newAccount = new dbBase.accounts(account);
    let doc = await newAccount.save();
    return { id: doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

module.exports = dbBase;