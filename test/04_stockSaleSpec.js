'use strict';
process.env.NODE_ENV = 'unitTest';

const request = require('supertest');
const assert = require('assert');
const testUtils = require('./testUtils');
const config = require('../config/config');
const testData = require('./testData');

describe('[Item spec]', () => {
  let agent;
  let profile;
  before(async () => {
    let app = require('../app');
    request(app);
    agent = request.agent(app);
    try {
      var res = await agent.post('/account/login')
        .set('Content-Type', 'application/json')
        .send({ 'account': testData.accounts.user1.account, 'password': '2222' })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
  });
  after(async () => {
  });

  it('should stock s01-c01-001-S', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock01)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });

  it('should stock s01-c01-001-M', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock02)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });  

  it('should stock s01-c01-001-L', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock03)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });
  
  it('should stock s01-c02-001-3S', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock04)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });
  
  it('should stock s02-c02-001-2L', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock05)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });
  
  it('should stock s02-c02-001-3L', async () => {
    try {
      var res = await agent.post('/item/stock')
        .set('Content-Type', 'application/json')
        .send(testData.stocks.stock06)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1)    ;
  });

  it('should get items of stock <= 0', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .send({ 'stock': { 'max': 0 } })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.total, 1);
    assert.strictEqual(obj.docs.length, 1);
    assert.strictEqual(obj.docs[0].name, testData.items["s02-c02-001-XL"].name);
    assert.strictEqual(obj.docs[0].supplierID._id, testData.items["s02-c02-001-XL"].supplierID);
    assert.strictEqual(obj.docs[0].category, testData.items["s02-c02-001-XL"].category);
    assert.strictEqual(obj.docs[0].size, testData.items["s02-c02-001-XL"].size);
    assert.strictEqual(obj.docs[0].cost, testData.items["s02-c02-001-XL"].cost);
    assert.strictEqual(obj.docs[0].listPrice, testData.items["s02-c02-001-XL"].listPrice);
    assert.strictEqual(obj.docs[0].marketPrice, testData.items["s02-c02-001-XL"].marketPrice);
  });

  it('should create receipt r01', async () => {
    try {
      var res = await agent.post('/receipt/create')
        .set('Content-Type', 'application/json')
        .send(testData.receipts.r01)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.receipts.r01.id = obj.id;
  });

  it('should create receipt r02', async () => {
    try {
      var res = await agent.post('/receipt/create')
        .set('Content-Type', 'application/json')
        .send(testData.receipts.r02)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.receipts.r02.id = obj.id;
  });

  it('should create receipt r03', async () => {
    try {
      var res = await agent.post('/receipt/create')
        .set('Content-Type', 'application/json')
        .send(testData.receipts.r03)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.receipts.r03.id = obj.id;
  });

  let receipt01;
  it('should query all receipt', async () => {
    try {
      var res = await agent.post('/receipt/query')
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.total, 3);
    assert.strictEqual(obj.quantity, 9);
    assert.strictEqual(obj.revenue, 5320);
    assert.strictEqual(obj.cost, 2490.5);
    assert.strictEqual(obj.docs.length, 3);
    receipt01 = obj.docs[1];
  });

  it('should create return of receipt r02', async () => {
    try {
      let returReceipt = {
        'items':[
          {
            'itemID': receipt01.items[1].itemID,
            'salePrice': receipt01.items[1].salePrice,
            'quantity': -receipt01.items[1].quantity
          }
        ],
        'payBy': receipt01.payBy,
        'pay': -190,// -receipt01.items[1].salePrice,
        'remark': 'return for broken',
        'returnRefID': receipt01._id,
      };
      var res = await agent.post('/receipt/create')
        .set('Content-Type', 'application/json')
        .send(returReceipt)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
  });  

});

