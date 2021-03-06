'use strict';
const express = require('express');
const router = express.Router();
const statisticsMgr = require('../../libs/statisticsMgr');
const accountMgr = require('../../libs/accountMgr');

// Statistics API

router.post('/receipt/histogram', statisticsMgr.queryReceiptHistogram);
router.post('/receipt/pie', statisticsMgr.queryPie);

module.exports = router;