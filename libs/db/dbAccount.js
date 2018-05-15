'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

dbBase.createDefaultAccount = async ()=>{
  try{
    let count = await dbBase.accounts.count({'account':config.defaultAccount.account});
    if(count <=0 ){
      let defaultAccount = new dbBase.accounts(config.defaultAccount);
      await defaultAccount.save();
    }
  }catch(err){
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);    
  }
};

dbBase.updateAccount = async (account, accountObj, unset) => {
  try{
    if(!!unset){
      return await dbBase.accounts.update({'account': account}, {'$set':accountObj, '$unset':unset});
    }else{
      return await dbBase.accounts.update({'account': account}, {'$set':accountObj});
    }
  }catch(err){
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);    
  }
};

dbBase.getAccount = async (account) =>{
  try{ 
    return await dbBase.accounts.findOne({'account': account}).lean();
  }catch(err){
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

module.exports = dbBase;