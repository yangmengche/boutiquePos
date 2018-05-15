'use strict';

const utils = require('./utils');
const config = require('../config/config');
const log = require('./logger');
const db = require('./db/dbAccount');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;

exports.authenticate = async (req, res, next) => {
  // check info in session
  if (!!req.session.account) {
    next();
  } else {
    log.writeLog('authenticate fail, ' + req.session.account, 'warn');
    utils.fnResponse(errCode.Unauthorized, null, res);
  }
};

exports.login = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let account = await db.getAccount(body.account);
    if (!account) {
      log.writeLog('Account not found. ' + body.account, 'warn');
      return utils.fnResponse(errCode.Unauthorized, null, res);
    }
    if (!account.password) {
      // force reset password
      req.session.account = account.account;
      // await db.addOpLog(account.account, 'LOGIN');
      return utils.fnResponse(null, { 'act': 'resetPassword' }, res);
      // return res.redirect(302, config.host+'/#!/resetPassword');
    }
    let ep = utils.crypto(body.password);
    if (ep === account.password) {
      req.session.account = account.account;
      // await db.addOpLog(account.account, 'LOGIN');
      return utils.fnResponse(null, null, res);
    } else {
      return utils.fnResponse(errCode.Unauthorized, null, res);
    }
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.logout = async (req, res) => {
  await db.addOpLog(req.session.account, 'LOGOUT');
  delete req.session.account;
  utils.fnResponse(null, null, res);
};

exports.updateAccount = async (req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let updateObj = {
      'password': body.password,
      'email': body.email
    };
    updateObj = JSON.parse(JSON.stringify(updateObj));
    let r = await db.updateAccount(body.account, updateObj);
    utils.fnResponse(null, { 'nModified': r.nModified }, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }
};

exports.getAccount = async (req, res) => {
  try {
    if (!req.session || !req.session.account) {
      log.writeLog('No account info in session', 'error');
      utils.fnResponse(errCode.ParameterError, null, res);
    }
    let account = await db.getAccount(req.session.account);
    delete account.password;
    utils.fnResponse(null, account, res);
  } catch (err) {
    log.writeLog('account=' + req.session.account + ', ' + err.message, 'error');
    utils.fnResponse(errCode.ParameterError, null, res);
  }
};

exports.createAccount = async(req, res) => {
  try {
    let body = await utils.fnGetBody(req);
    let updateObj = {
      'account': body.account,
      'password': utils.crypto(body.password),
      'type': body.type
    };
    updateObj = JSON.parse(JSON.stringify(updateObj));
    let r = await db.createAccount(updateObj);
    utils.fnResponse(null, r, res);
  } catch (err) {
    log.writeLog(err.message, 'error');
    utils.fnResponse(err, null, res);
  }  
}
