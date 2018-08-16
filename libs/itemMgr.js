'use strict';
const utils = require('./utils');
const config = require('../config/config');
const log = require('./logger');
const db = require('./db/dbItem');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;
const uuid = require('uuid');
const path = require('path');
const xl = require('excel4node');
const moment = require('moment');
const fse = require('fs-extra');
const xlsx = require('xlsx');
const def = require('./db/def');

exports.addCategories = async (req, res) => {
  try {
    let categories = await utils.fnGetBody(req);
    let result = await db.addCategories(categories);
    utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.removeCategory = async (req, res) => {
  try {
    let id = req.query.id;
    let result = await db.removeCategories([id]);
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

exports.uploadImage = async (req, res) => {
  let fileID = uuid.v4();
  try {
    // save file
    let data = await utils.fnUploadFile(req, config.resourcePath, fileID);
    utils.fnResponse(null, { 'url': data.file }, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.getResource = async (req, res) => {
  let resFile = path.resolve(config.resourcePath, req.params.fileID);
  res.download(resFile, (err) => {
    if (err) {
      log.writeLog(err.message, 'error');
      utils.fnResponse(errCode.ObjectNotFound, null, res);
    }
  });
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
    let docs = await db.queryItems(query.name, query.supplierID, query.category, query.size, query.stock, query.skip, query.limit, query.sort, query.dir);
    utils.fnResponse(null, docs, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.downloadItems = async (req, res) => {
  try {
    let query = await utils.fnGetBody(req);
    let data = await db.queryItems(query.name, query.supplierID, query.category, query.size, query.stock, query.skip, query.limit, query.sort, query.dir);
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet('庫存');
    ws.cell(1, 1).string('條碼');
    ws.cell(1, 2).string('名稱');
    ws.cell(1, 3).string('供應商');
    ws.cell(1, 4).string('分類');
    ws.cell(1, 5).string('尺吋');
    ws.cell(1, 6).string('成本');
    ws.cell(1, 7).string('牌價');
    ws.cell(1, 8).string('定價');
    ws.cell(1, 9).string('庫存');
    let docs = data.docs;
    for (let i in docs) {
      let index = Number(i) + 2;
      ws.cell(index, 1).string(docs[i].code);
      ws.cell(index, 2).string(docs[i].name);
      ws.cell(index, 3).string(docs[i].supplierID.name);
      ws.cell(index, 4).string(docs[i].category);
      ws.cell(index, 5).string(docs[i].size);
      ws.cell(index, 6).number(docs[i].cost);
      ws.cell(index, 7).number(docs[i].listPrice);
      ws.cell(index, 8).number(docs[i].marketPrice);
      ws.cell(index, 9).number(docs[i].stock);
    }
    let fileName = '庫存_' + moment().format('Y-M-D') + '.xlsx';
    let filePath = path.resolve(config.tempPath, fileName);
    wb.write(filePath, (err, stats) => {
      if (err) {
        log.writeLog(err.message, 'error');
        utils.fnResponse(errCode.InternalError, null, res);
        return;
      }
      let headers = {
        'Content-Type': 'application/octet-stream',
        'filename': encodeURI(fileName),
        'Content-Disposition': 'attachment; filename=' + encodeURI(fileName)
      };
      res.sendFile(filePath, { 'headers': headers }, (err) => {
        if (err) {
          log.writeLog(err.message, 'error');
        }
        fse.unlinkSync(filePath);
      });
    });


  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.getItem = async (req, res) => {
  try {
    let docs = await db.getItem(req.query.id, req.query.code);
    return utils.fnResponse(null, docs, res);
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
    let item = await db.getItem(body.itemID);
    if (item.length <= 0) {
      log.writeLog('Can\'t find item=' + body.itemID, 'error');
      return utils.fnResponse(errCode.ObjectNotFound, null, res);
    }
    let stock = item[0].stock + body.quantity;
    let result = await db.updateItem(body.itemID, { 'stock': stock });
    return utils.fnResponse(null, result, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

function caculateDiscount(total, pay, quantity, items) {
  if (pay > 0) {
    if (pay < total) {
      let discount = (total - pay) / quantity;
      for (let i in items) {
        items[i].salePrice -= discount;
      }
    }
  } else {
    // return goods
    if (pay > total) {
      let discount = (total - pay) / quantity;
      for (let i in items) {
        items[i].salePrice -= discount;
      }
    }
  }
}

exports.createReceipt = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    log.writeLog(JSON.stringify(body), 'info');
    // create recepit
    let total = 0, quantity = 0, cost = 0;
    for (let i in body.items) {
      let item = (await db.getItem(body.items[i].itemID))[0];
      body.items[i].cost = item.cost;
      body.items[i].code = item.code;
      body.items[i].listPrice = item.listPrice;
      body.items[i].marketPrice = item.marketPrice;
      let stock = item.stock - body.items[i].quantity;
      let result = await db.updateItem(body.items[i].itemID, { 'stock': stock });
      total += body.items[i].salePrice * body.items[i].quantity;
      quantity += body.items[i].quantity;
      cost += body.items[i].cost * body.items[i].quantity;
    }
    body.cost = cost;
    // calculate discount
    caculateDiscount(total, body.pay, quantity, body.items);
    let id = await db.createReceipt(body);
    return utils.fnResponse(null, id, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.queryReceipt = async (req, res) => {
  try {
    let query = await utils.fnGetBody(req);
    let docs = await db.queryReceipts(query.id, query.date, query.payBy, query.remark, query.returnRefID, query.skip, query.limit);
    utils.fnResponse(null, docs, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.updateReceipt = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let total = 0;
    let quantity = 0;
    for (let i in body.items) {
      total += body.items[i].salePrice * body.items[i].quantity;
      quantity += body.items[i].quantity;
    }
    caculateDiscount(total, body.pay, quantity, body.items);
    let docs = await db.updateReceipt(body);
    utils.fnResponse(null, docs, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.downloadReceipts = async (req, res) => {
  try {
    let query = await utils.fnGetBody(req);
    let docs = await db.queryReceiptsForDownload(query.id, query.date, query.payBy, query.remark, query.returnRefID, query.skip, query.limit);
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet('銷售');
    ws.cell(1, 1).string('時間');
    ws.cell(1, 2).string('條碼');
    ws.cell(1, 3).string('分類');
    ws.cell(1, 4).string('尺吋');
    ws.cell(1, 5).string('供應商');
    ws.cell(1, 6).string('成本');
    ws.cell(1, 7).string('牌價');
    ws.cell(1, 8).string('定價');
    ws.cell(1, 9).string('售價');
    ws.cell(1, 10).string('數量');
    ws.cell(1, 11).string('付款方式');
    for (let i in docs) {
      let index = Number(i) + 2;
      console.log(moment(docs[i].date).local().format('Y-M-D H:m:s'));
      // ws.cell(index, 1).string(moment(docs[i].date).local().format('Y-M-D H:m:s'));
      ws.cell(index, 1).date(docs[i].date);
      ws.cell(index, 2).string(docs[i].item_doc.code);
      ws.cell(index, 3).string(docs[i].item_doc.category);
      ws.cell(index, 4).string(docs[i].item_doc.size);
      ws.cell(index, 5).string(docs[i].supplier_doc.name);
      ws.cell(index, 6).number(docs[i].items.cost);
      ws.cell(index, 7).number(docs[i].items.listPrice);
      ws.cell(index, 8).number(docs[i].items.marketPrice);
      ws.cell(index, 9).number(docs[i].items.salePrice);
      ws.cell(index, 10).number(docs[i].items.quantity);
      ws.cell(index, 11).string(docs[i].payBy);
    }
    ws.cell(docs.length + 2, 6).formula('SUM(F2:F' + (docs.length + 1) + ')');
    ws.cell(docs.length + 2, 9).formula('SUM(I2:I' + (docs.length + 1) + ')');
    ws.cell(docs.length + 2, 10).formula('SUM(J2:J' + (docs.length + 1) + ')');
    let fileName = '銷售_' + moment().format('Y-M-D') + '.xlsx';
    let filePath = path.resolve(config.tempPath, fileName);
    wb.write(filePath, (err, stats) => {
      if (err) {
        log.writeLog(err.message, 'error');
        utils.fnResponse(errCode.InternalError, null, res);
        return;
      }
      let headers = {
        'Content-Type': 'application/octet-stream',
        'filename': encodeURI(fileName),
        'Content-Disposition': 'attachment; filename=' + encodeURI(fileName)
      };
      res.sendFile(filePath, { 'headers': headers }, (err) => {
        if (err) {
          log.writeLog(err.message, 'error');
        }
        fse.unlinkSync(filePath);
      });
    });
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.uploadItems = async (req, res) => {
  // get upload excel file
  try{
    let payload = await utils.fnUploadExcelFile(req);
    if(!payload.file || !payload.filename || !payload.sheetname || !payload.supplier){
      log.writeLog('No necessary info '+ payload.toJSON(), 'error');
      return utils.fnResponse(errCode.Forbidden, null, res);
    }
    let workbook = xlsx.readFile(payload.file);
    let importData = await db.getImportData(payload.filename);
    if(importData && payload.sheetname in importData.sheetNames){
      log.writeLog(importData.sheetNames+ 'has been imported', 'warn');
      return utils.fnResponse(errCode.Forbidden, null, res);
    }
    let ws = workbook.Sheets[payload.sheetname];
    // parse sheet
    let keys = Object.keys(ws);
    let data={};
    // let header={};
    for(let k of keys){
      if(k[0] == '!'){
        // ignore meta data
        continue;
      }
      let col = k.match(/[a-zA-Z]/g)[0];
      let row = parseInt(k.split(col)[1]);
      if(row == 1){
        //header
        // header[ws[k].v]=col;
        continue;
      }
      if(!data[row]){
        data[row]={};
      }
      data[row][col]=ws[k].v;
    }
    // update database
    // A: id, B: listprice, C: quantity, D: name, E:category, F:size, G: cost
    let supplier = (await db.getSupplier({'name': payload.supplier}))[0];
    if(!supplier){
      // no supplier, need to create a new one
      log.writeLog('Can\'t find supplier: '+ payload.supplier, 'error');
      return utils.fnResponse(errCode.SupplierNotFound, null, res);
    }
    let nModified =0;
    let nCreate = 0;
    for(let row in data){
      let item = await db.getItem(null, data[row].A)[0];
      if(item){
        id = item._id;
        stock = item.stock + parseInt(data[row].C);
        let result = await db.updateItem(id, {'stock': stock});
        if(result.nModified == 1){
          nModified ++;
        }
      }else{
        let cost = parseInt(data[row].G);
        if(supplier.type == def.supplierType[0]){
          cost = parseInt(data[row].B) * supplier.shareRate;
        }
        let id = await db.createItem({
          'code': data[row].A,
          'name': data[row].D,
          'supplierID': supplier._id,
          'category': data[row].E,
          'size': data[row].F,
          'cost': cost,
          'listPrice': parseInt(data[row].B),
          'marketPrice': parseInt(data[row].B),
          'stock': parseInt(data[row].C)
        });
        if(id){
          nCreate ++;
        }
      }
    }
    utils.fnResponse(null, {'nCreate': nCreate, 'nModified': nModified}, res);
  }catch(err){
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);    
  }
};
