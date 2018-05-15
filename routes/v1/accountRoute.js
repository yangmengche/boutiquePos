'use strict';
const express = require('express');
let router = express.Router();
const accountMgr = require('../../libs/accountMgr');

// Account API

/**
 * @api {post} /account/login Login
 * @apiDescription Login.
 * @apiGroup Account API
 * @apiParam {String} account Account ID.
 * @apiParam {String} password Password of account.
 * @apiParamExample {json} Body of Request-Example:
 *  {
 *    "account":"adm",
 *    "password":"1111"
 *  } 
 * @apiSuccess (Success 200) - No Content.
 * @apiSuccess (Redirect 302) - No Content.
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse InternalError
 */
router.post('/account/login', accountMgr.login);


/**
 * @api {post} /account/logout Logout
 * @apiDescription Logout.
 * @apiGroup Account API
 * @apiSuccess (Success 200) - No Content.
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse InternalError
 */
router.post('/account/logout', accountMgr.authenticate, accountMgr.logout);
/**
 * @api {post} /account/update Update
 * @apiDescription Update account password and email.
 * @apiGroup Account API
 * @apiParam {String} account Account ID.
 * @apiParam {String} password Password of account.
 * @apiParam {String} email Email of account.
 * @apiParamExample {json} Body of Request-Example:
 *  {
 *    "account":"adm",
 *    "password":"1111",
 *    "email":"admin@gmail.com"
 *  } 
 * @apiSuccess (Success 200) {Number} nModified The number of account be modified.
 * @apiSuccessExample Success-Response
 *  { 
 *    "nModified": 1,
 *  }
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse InternalError
 */
router.post('/account/update', accountMgr.authenticate, accountMgr.updateAccount);

/**
 * @api {get} /account Get account ifno
 * @apiDescription Get account info by login session
 * @apiGroup Account API
 * @apiSuccess (Success 200) {String} account Account ID.
 * @apiSuccess (Success 200) {String} email email of account.
 * @apiSuccessExample Body of Response-Example:
 *  {
 *    "account": "admin",
 *    "email": "xxx@gmail.com"
 *  }
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse InternalError
 */
router.get('/account', accountMgr.authenticate, accountMgr.getAccount);

module.exports = router;