'use strict';

const dbBase = require('./dbBase');
const log = require('../logger');
const errCode = require('../statusCode').ErrorCode;
const config = require('../../config/config');

dbBase.queryReceiptHistogram = async (date, group) => {
  try {
    let q = {};
    if (date && (date.min || date.max)) {
      q.date = {};
      if (date.min && !isNaN(date.min)) {
        q.date['$gte'] = new Date(date.min);
      }
      if (date.max && !isNaN(date.max)) {
        q.date['$lte'] = new Date(date.max);
      }
    }
    let groupID;
    let sort;
    switch (group) {
      case 'dayOfWeek':
        groupID = {'dayOfWeek': { '$add':['$dayOfWeek', -1]}};
        sort = { '_id.dayOfWeek': 1 };
        break;
      case 'dayOfMonth':
        groupID = {
          'year': '$year',
          'month': { '$add': ['$month', -1] },
          'date': '$dayOfMonth'
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
          'month': { '$add': ['$month', -1] }
        };
        sort = {
          '_id.year': 1,
          '_id.month': 1
        };
        break;
      case 'year':
        groupID= {'year': '$year'};
        sort = { '_id.year': 1 };
    }
    let pipe = [
      {
        '$match': q
      }, {
        '$addFields': {
          'year': { '$year': '$date' },
          'month': { '$month': '$date' },
          'dayOfMonth': { '$dayOfMonth': '$date' },
          'dayOfWeek': { '$dayOfWeek': '$date' },
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