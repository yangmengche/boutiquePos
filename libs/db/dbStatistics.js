'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

dbBase.queryReceiptHistogram = async (date, group) => {
  try {
    let q = {};
    if (date) {
      q.date = {};
      if (!isNaN(date.min)) {
        q.date['$gte'] = new Date(date.min);
      }
      if (!isNaN(date.max)) {
        q.date['$lte'] = new Date(date.max);
      }
    }
    let groupID;
    let sort;
    switch (group) {
      case 'weekDay':
        groupID = '$weekDay';
        sort = { '_id': 1 };
        break;
      case 'monthDay':
        groupID = {
          'year': '$year',
          'month': '$month',
          'date': '$monthDay'
        };
        sort = {
          '_id.year': 1,
          '_id.month': 1,
          '_id.date': 1
        };
        break;
      case 'month':
        groupID = {
          'year': '$year',
          'month': '$month'
        };
        sort = {
          '_id.year': 1,
          '_id.month': 1
        };
        break;
      case 'year':
        grourID: '$year';
        sort = { '_id': 1 };
    }
    let pipe = [
      {
        '$match': q
      }, {
        '$addFields': {
          'year': { '$year': '$date' },
          'month': { '$month': '$date' },
          'monthDay': { '$dayOfMonth': '$date' },
          'weekDay': { '$dayOfWeek': '$date' },
        }
      }, {
        '$group': {
          '_id': groupID,
          'revenue': { $sum: '$pay' },
          'cost': { $sum: '$cost' },
          'quantity': { $sum: '$quantity' }
        }
      }, {
        '$sort': sort
      }
    ];
    let data = await dbBase.receipts.aggregate(pipe);
    return data;
  } catch (err) {
    log.writeLog(err.message, 'error');
    throw dbBase.errorMap(err);
  }
};

module.exports = dbBase;