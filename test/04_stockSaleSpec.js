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
    assert.strictEqual(obj.length, 1);
    assert.strictEqual(obj[0].name, testData.items["s02-c02-001-XL"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s02-c02-001-XL"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s02-c02-001-XL"].category);
    assert.strictEqual(obj[0].size, testData.items["s02-c02-001-XL"].size);
    assert.strictEqual(obj[0].cost, testData.items["s02-c02-001-XL"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s02-c02-001-XL"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s02-c02-001-XL"].marketPrice);
  });  
});