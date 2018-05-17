'use strict';
const express = require('express');
const router = express.Router();
const itemMgr = require('../../libs/itemMgr');
const accountMgr = require('../../libs/accountMgr');

// Item API

router.post('/category/create', accountMgr.authenticate, itemMgr.addCategories);
router.delete('/category', accountMgr.authenticate, itemMgr.removeCategories);
router.put('/category/update', accountMgr.authenticate, itemMgr.updateCategory);
router.get('/category', accountMgr.authenticate, itemMgr.getCategories);

router.post('/item/create', accountMgr.authenticate, itemMgr.createItem);
router.put('/item/update', accountMgr.authenticate, itemMgr.updateItem);
router.post('/item/query', accountMgr.authenticate, itemMgr.queryItems);
router.post('/item/stock', accountMgr.authenticate, itemMgr.stockItems);
router.get('/item', accountMgr.authenticate, itemMgr.getItem);

router.post('/receipt/create', accountMgr.authenticate, itemMgr.createReceipt);
router.post('/receipt/query', accountMgr.authenticate, itemMgr.queryReceipt);
/**
 * @api {post} /upload/image Upload image resource
 * @apiDescription Upload image resource.
 * @apiGroup Item API 
 * @apiParam {File} file Image file to be uploaded.
 * @apiParamExample {json} upload image
 *  form-date:
 *  {
 *    "file":<source image file>
 *  }
 * @apiSuccess (Success 200) {String} url Resource url.
 * @apiSuccessExample Body of Response-Example:
 *  {
 *    "url": "/resource/a49df82a-b37c-4973-862b-2735c2293915.jpg"
 *  }
 * @apiUse ParameterError
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse InternalError
 */
router.post('/upload/image', accountMgr.authenticate, itemMgr.uploadImage);
module.exports = router;