'use strict';

const utils = require('./utils');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;
const db = require('./db/dbStatistics');
const log = require('./logger');

// date:{min: ms, max: ms}
// group: weekDay, monthDay, month, year
// return: revenue, profit, quantity
exports.queryReceiptHistogram = async (req, res) => {
  try {
    let query = await utils.fnGetBody(req);
    let docs = await db.queryReceiptHistogram(query.date, query.group);
    utils.fnResponse(null, docs, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};