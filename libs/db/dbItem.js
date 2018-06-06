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
    let docs = await dbBase.items.find(q).populate('supplierID', 'name');;
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.queryItems = async (name, supplierID, category, size, stock, skip, limit) => {
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
    let total = await dbBase.items.count(q);
    let query = dbBase.items.find(q).sort({ 'name': 1 }).populate('supplierID', 'name');
    let s = parseInt(skip);
    if (!isNaN(s)) {
      query.skip(s);
    }
    let l = parseInt(limit);
    if (!isNaN(l)) {
      query.limit(l);
    }
    query.sort = { 'code': 1};
    let docs = await query.lean().exec();
    return { 'total': total, 'docs': docs };
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
    receipt.quantity = 0;
    for (let i in receipt.items) {
      receipt.quantity += receipt.items[i].quantity;
    }
    let newReceipt = new dbBase.receipts(receipt);
    let doc = await newReceipt.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

dbBase.queryReceipts = async (id, date, payBy, remark, returnRefID, skip, limit) => {
  try {
    let q = {};
    if (id) {
      q._id = id;
    }
    if (date) {
      q.date = {};
      if (!isNaN(date.min)) {
        q.date['$gte'] = new Date(date.min);
      }
      if (!isNaN(date.max)) {
        q.date['$lte'] = new Date(date.max);
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
    let total = await dbBase.receipts.count(q);
    let pipe = [
      {
        '$match': q
      }, {
        '$unwind': '$items'
      }, {
        '$group': {
          '_id': '$_id',
          'quantity': { '$first': '$quantity' },
          'pay': { '$first': '$pay' },
          'cost': { '$sum': '$items.cost' }
        }
      }, {
        '$group':{
          '_id': null, 
          'total': {'$sum':1},
          'quantity': {'$sum':'$quantity'},
          'revenue': {'$sum': '$pay'},
          'cost': {'$sum': '$cost'}
        }
      }
    ]
    let result = await dbBase.receipts.aggregate(pipe);
    let query = dbBase.receipts.find(q).sort({ 'date': -1 });
    let s = parseInt(skip);
    if (!isNaN(s)) {
      query.skip(s);
    }
    let l = parseInt(limit);
    if (!isNaN(l)) {
      query.limit(l);
    }
    let docs = await query.lean().exec();
    if(result.length > 0){
      return { 'total': result[0].total, 'quantity': result[0].quantity, 'revenue':result[0].revenue, 'cost':result[0].cost, 'docs': docs };
    }else{
      return { 'total': 0, 'quantity': 0, 'revenue':0, 'cost':0, 'docs': docs };
    }
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}
module.exports = dbBase;