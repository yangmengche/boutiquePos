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
};

dbBase.removeCategories = async (ids) => {
  try {
    let result = await dbBase.categories.remove({ _id: { $in: ids } });
    return { 'nRemove': result.ok };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.updateCategory = async (id, category) => {
  try {
    let result = await dbBase.categories.update({ _id: id }, { $set: category });
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.getCategories = async () => {
  try {
    let result = await dbBase.categories.find();
    return result;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

// Item
dbBase.createItem = async (item) => {
  try {
    let newItem = new dbBase.items(item);
    if(!newItem.date){
      newItem.date = new Date();
    }
    let doc = await newItem.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.updateItem = async (id, item) => {
  try {
    let result = await dbBase.items.update({ '_id': id }, { $set: item });
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.getItem = async (id, code) => {
  try {
    let q = {};
    if (id) {
      q._id = id;
    }
    if (code) {
      q.code = code;
    }
    let docs = await dbBase.items.find(q).populate('supplierID', 'name');
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.queryItems = async (name, supplierID, category, size, stock, skip, limit, sort, dir) => {
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
        q.stock = { $lte: stock.max };
      }
    }
    let total = await dbBase.items.count(q);
    let query = dbBase.items.find(q);
    query.populate('supplierID', 'name');
    if(sort){
      let s = {};
      s[sort]=dir;
      query.sort(s);
    }
    let s = parseInt(skip);
    if (!isNaN(s)) {
      query.skip(s);
    }
    let l = parseInt(limit);
    if (!isNaN(l)) {
      query.limit(l);
    }

    let docs = await query.lean().exec();
    return { 'total': total, 'docs': docs };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

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
};

// receipt
dbBase.createReceipt = async (receipt) => {
  try {
    if(!receipt.date){
      receipt.date = new Date().getTime();
    }
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
};

dbBase.updateReceipt = async (receipt) =>{
  try {
    let id = receipt._id;
    delete receipt._id;
    // only allow these 4 fields
    let updateObj={
      'date': receipt.date, 
      'payBy': receipt.payBy, 
      'pay': receipt.pay,
      'remark': receipt.remark,
      'items':receipt.items
    };
    let result = await dbBase.receipts.update({'_id': id}, {$set:updateObj});
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

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
    // let pipe2 = [
    //   {
    //     '$match': q
    //   }, {
    //     '$unwind': '$items'
    //   }, {
    //     '$group': {
    //       '_id': '$_id',
    //       'quantity': { '$first': '$quantity' },
    //       'pay': { '$first': '$pay' },
    //       'cost': { '$sum': {'$multiply':['$items.cost', '$items.quantity']}}
    //     }
    //   }, {
    //     '$group':{
    //       '_id': null, 
    //       'total': {'$sum':1},
    //       'quantity': {'$sum':'$quantity'},
    //       'revenue': {'$sum': '$pay'},
    //       'cost': {'$sum': '$cost'}
    //     }
    //   }
    // ];
    // let result2 = await dbBase.receipts.aggregate(pipe2);    

    let pipe = [
      {
        '$match': q
      }, {
        '$group':{
          '_id': null, 
          'total': {'$sum':1},
          'quantity': {'$sum':'$quantity'},
          'revenue': {'$sum': '$pay'},
          'cost': {'$sum': '$cost'}
        }
      }
    ];
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

    // migrate
    // for(let i in docs){
    //   let cost = 0;
    //   for(let j in docs[i].items){
    //     cost += docs[i].items[j].cost*docs[i].items[j].quantity;
    //   }
    //   await dbBase.receipts.update({'_id': docs[i]._id}, {$set:{'cost': cost}});
    // }
    if(result.length > 0){
      return { 'total': result[0].total, 'quantity': result[0].quantity, 'revenue':result[0].revenue, 'cost':result[0].cost, 'docs': docs };
    }else{
      return { 'total': 0, 'quantity': 0, 'revenue':0, 'cost':0, 'docs': docs };
    }
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.queryReceiptsForDownload = async (id, date, payBy, remark, returnRefID, skip, limit) => {
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
   
    let pipe = [
      {
        '$match': q
      },{
        '$unwind': '$items'
      }, {
        '$lookup': {
          'from': 'items',
          'localField': 'items.itemID',
          'foreignField': '_id',
          'as': 'item_doc'
        },
      }, {
        '$unwind': '$item_doc'
      }, {
        '$lookup': {
          'from': 'suppliers',
          'localField': 'item_doc.supplierID',
          'foreignField': '_id',
          'as': 'supplier_doc'
        }
      }, {
        '$unwind': '$supplier_doc'
      }, {
        '$sort': { 'date': 1}
      }
    ];
    return await dbBase.receipts.aggregate(pipe);
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.getImportData = async(filename) => {
  try{
    return await dbBase.imports.findOne({'fileName':filename});
  }catch(err){
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);    
  }
};

dbBase.updateImportData = async(filename, sheetname) => {
  try{
    let doc = await dbBase.imports.findOne({'fileName':filename});
    if(doc){
      let sheets = doc.sheetNames;
      sheets.push(sheetname);
      dbBase.impoets.updateOne({'_id': doc._id}, {$set:{'sheetNames': sheets}});
    }else{
      let newImport = new dbBase.imports({
        'date': new Date(),
        'fileName': filename,
        'sheetNames': [sheetname]
      });
      doc = await newImport.save();
    }
    return { 'id': doc.id };
  }catch(err){
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};
module.exports = dbBase;