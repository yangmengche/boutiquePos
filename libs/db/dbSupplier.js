'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

dbBase.createSupplier = async (supplier) => {
  try {
    let newSupplier = new dbBase.suppliers(supplier);
    let doc = await newSupplier.save();
    return { 'id': doc.id };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

dbBase.updateSupplier = async (supplier) => {
  try {
    let id = supplier.id;
    delete supplier.id;
    let result = await dbBase.suppliers.update({ '_id': id }, { '$set': supplier });
    return { 'nModified': result.nModified };
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}
dbBase.getSupplier = async (query) => {
  try {
    let docs = await dbBase.suppliers.find(query).lean();
    return docs;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
}

module.exports = dbBase;