'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

// category
dbBase.addCategories = async (categories) => {
  try {
    let ids = [];
    for (let i in categories) {
      let newCategory = new dbBase.categories(categories[i]);
      let doc = await newCategory.save();
      ids.push(doc.id);
    }
    return { 'ids': ids };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.removeCategories = async (ids) => {
  try {
    let result = await dbBase.categories.remove({ _id: { $in: ids } });
    return { 'nRemove': result.ok };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.updateCategory = async (id, category) => {
  try {
    let result = await dbBase.categories.update({ _id: id }, { $set: category });
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.getCategories = async () => {
  try {
    let result = await dbBase.categories.find();
    return result;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

// Item
dbBase.createItem = async (item) => {
  try {
    let newItem = new dbBase.items(item);
    let doc = await newItem.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.updateItem = async (id, item) => {
  try {
    let result = await dbBase.items.update({ '_id': id }, { $set: item });
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.getItem = async (id, code) => {
  try {
    let q = {};
    if (id) {
      q._id = id;
    }
    if (code) {
      q.code = code;
    }
    let docs = await dbBase.items.find(q);
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.queryItems = async (name, supplierID, category, size, stock) => {
  try {
    let q = {};
    if (name) {
      q.name = { $regex: new RegExp(name, 'i') };
    }
    if (supplierID) {
      q.supplierID = supplierID;
    }
    if (category) {
      q.category = category;
    }
    if (size) {
      q.size = size;
    }
    if (stock) {
      if (!isNaN(stock.min)) {
        q.stock = { $gte: stock.min };
      }
      if (!isNaN(stock.max)) {
        q.stock = { $lte: stock.max }
      }
    }
    let docs = await dbBase.items.find(q).sort({ 'name': 1 }).lean();
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

// stock log
dbBase.createStockLog = async (stock) => {
  try {
    stock.date = new Date().getTime();
    let newLog = new dbBase.stockLogs(stock);
    let doc = await newLog.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

// receipt
dbBase.createReceipt = async (receipt) => {
  try {
    receipt.date = new Date().getTime();
    let newReceipt = new dbBase.receipts(receipt);
    let doc = await newReceipt.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.queryReceipts = async (id, date, payBy, remark, returnRefID) => {
  try {
    let q = {};
    if (id) {
      q._id = id;
    }
    if (date) {
      if (!isNaN(stock.min)) {
        q.date = { $gte: stock.min };
      }
      if (!isNaN(stock.max)) {
        q.date = { $lte: stock.max }
      }
    }    
    if (payBy) {
      q.payBy = payBy;
    }
    if (remark) {
      q.remark = { $regex: new RegExp(remark, 'i') };
    }    
    if (returnRefID) {
      q.returnRefID = returnRefID;
    }
    
    let docs = await dbBase.receipts.find(q).sort({ 'date': -1 }).lean();
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}
module.exports = dbBase;