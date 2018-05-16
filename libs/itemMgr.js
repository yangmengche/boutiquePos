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

exports.stockItems = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    // write stock log
    let logID = await db.createStockLog(body);
    // calculate stock of items
    let item = await db.getItemByID(body.itemID);
    let stock = item.stock + body.quantity;
    let result = await db.updateItem(body.itemID, {'stock': stock });
    return utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
}