'use strict';

const utils = require('./utils');
const config = require('../config/config');
const log = require('./logger');
const db = require('./db/dbItem');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;

exports.addCategories = async (req, res) => {
  try {
    let categories = await utils.fnGetBody(req);
    let result = await db.addCategories(categories)
    utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.removeCategories = async (req, res) => {
  try {
    let ids = await utils.fnGetBody(req);
    let result = await db.removeCategories(ids)
    utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let category = await utils.fnGetBody(req);
    let id = category.id;
    delete category.id;
    let result = await db.updateCategory(id, category);
    utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.getCategories = async (req, res) => {
  try {
    let categories = await db.getCategories();
    utils.fnResponse(null, categories, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.createItem = async (req, res) => {
  try {
    let item = await utils.fnGetBody(req);
    let id = await db.createItem(item);
    utils.fnResponse(null, id, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.updateItem = async (req, res) => {
  try {
    let item = await utils.fnGetBody(req);
    let id = item.id;
    delete item.id;
    let result = await db.updateItem(id, item);
    utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.queryItems = async (req, res) => {
  try {
    let query = await utils.fnGetBody(req);
    let docs = await db.queryItems(query.name, query.supplierID, query.category, query.size, query.stock);
    utils.fnResponse(null, docs, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.getItem = async (req, res) =>{
  try{
    let docs = await db.getItem(req.query.id, req.query.code);
    return utils.fnResponse(null, docs, res);
  }catch(err){
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);    
  }
}

exports.stockItems = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    // write stock log
    let logID = await db.createStockLog(body);
    // calculate stock of items
    let item = await db.getItem(body.itemID);
    if(item.length <= 0){
      log.writeLog('Can\'t find item='+body.itemID, 'error');
      return utils.fnResponse(errCode.ObjectNotFound, null, res);
    }
    let stock = item[0].stock + body.quantity;
    let result = await db.updateItem(body.itemID, {'stock': stock });
    return utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
}

exports.createRecept = async (req, res) => {
  try{
    let body = await utils.fnGetBody(req);
    log.writeLog(JSON.stringify(body), 'info');
    // create recept
    for(let i in body.items){
      let item = (await db.getItem(body.items[i].itemID))[0];
      body.items[i].cost = item.cost;
      body.items[i].listPrice = item.listPrice;
      body.items[i].marketPrice = item.marketPrice;
      let stock = item.stock - body.items[i].quantity;
      let result = await db.updateItem(body.items[i].itemID, {'stock': stock });
    }
    let id = await db.createReceipt(body);
    return utils.fnResponse(null, id, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
}