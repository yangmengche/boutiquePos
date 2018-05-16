'use strict';
const express = require('express');
const router = express.Router();
const itemMgr = require('../../libs/itemMgr');

router.post('/category/create', itemMgr.addCategories);
router.delete('/category', itemMgr.removeCategories);
router.put('/category/update', itemMgr.updateCategory);
router.get('/category', itemMgr.getCategories);

router.post('/item/create', itemMgr.createItem);
router.put('/item/update', itemMgr.updateItem);
router.post('/item/query', itemMgr.queryItems);
router.post('/item/stock', itemMgr.stockItems);
router.get('/item', itemMgr.getItem);

router.post('/receipt/create', itemMgr.createRecept);
module.exports = router;