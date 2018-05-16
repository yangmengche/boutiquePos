'use strict';

const utils = require('./utils');
const config = require('../config/config');
const log = require('./logger');
const db = require('./db/dbSupplier');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;

exports.createSupplier = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let supplier = JSON.parse(JSON.stringify(body));
    let r = await db.createSupplier(supplier);
    utils.fnResponse(null, r, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }  
}

exports.getSupplier = async (req, res) =>{
  try{
    let query = await utils.fnGetBody(req);
    let docs = await db.getSupplier(query);
    utils.fnResponse(null, docs, res);
  }catch(err){
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);    
  }
}

exports.updateSupplier = async(req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let supplier = JSON.parse(JSON.stringify(body));
    let r = await db.updateSupplier(supplier);
    utils.fnResponse(null, r, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }  
}
