'use strict';
const express = require('express');
const router = express.Router();
const supplierMgr = require('../../libs/supplierMgr');
const accountMgr = require('../../libs/accountMgr');
// Supplier API

/**
 * @api {post} /account/create Create
 * @apiDescription create a new account.
 * @apiGroup Account API
 * @apiParam {String} name Supplier name.
 * @apiParam {String} type Supplier type ['CONSIGNMENT', 'BUYOUT'].
 * @apiParam {Number} shareRate Profit share rate for supplier. Ignore the field if type='BUYOUT'.
 * @apiParamExample {json} Body of Request-Example:
 *  {
 *    "name":"S01",
 *    "type":"CONSIGNMENT",
 *    "shareRate":0.65
 *  } 
 * @apiSuccess (Success 200) {Number} nModified The number of account be modified.
 * @apiSuccessExample Success-Response
 *  { 
 *    "id": "xxxxxxxx",
 *  }
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse InternalError
 */
router.post('/supplier/create', accountMgr.authenticate, supplierMgr.createSupplier);
router.get('/supplier', accountMgr.authenticate, supplierMgr.getSupplier);
router.put('/supplier/update', accountMgr.authenticate, supplierMgr.updateSupplier);

module.exports = router;