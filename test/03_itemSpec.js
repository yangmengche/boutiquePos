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
    testUtils.fillItemID();
  });

  it('should create the new category c01', async () => {
    try {
      var res = await agent.post('/category/create')
        .set('Content-Type', 'application/json')
        .send([testData.categories.c01])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.ids);
    testData.categories.c01.id = obj.ids[0];
  });

  it('should create the new category c02, c03', async () => {
    try {
      let categories = [testData.categories.c02, testData.categories.c03]
      var res = await agent.post('/category/create')
        .set('Content-Type', 'application/json')
        .send(categories)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.ids);
    assert.strictEqual(obj.ids.length, 2);
    testData.categories.c02.id = obj.ids[0];
    testData.categories.c03.id = obj.ids[1];
  });

  it('should update the category c03', async () => {
    try {
      let c03 = JSON.parse(JSON.stringify(testData.categories.c03))
      c03.name = 'newc03'
      var res = await agent.put('/category/update')
        .set('Content-Type', 'application/json')
        .send(c03)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1);
  });

  it('should get categories', async () => {
    try {
      var res = await agent.get('/category')
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 3);
    assert.strictEqual(obj[0]._id, testData.categories.c01.id);
    assert.strictEqual(obj[0].name, testData.categories.c01.name);
    assert.strictEqual(obj[1]._id, testData.categories.c02.id);
    assert.strictEqual(obj[1].name, testData.categories.c02.name);
    assert.strictEqual(obj[2]._id, testData.categories.c03.id);
    assert.strictEqual(obj[2].name, 'newc03');
  });

  it('should delete the category c03', async () => {
    try {
      var res = await agent.delete('/category')
        .set('Content-Type', 'application/json')
        .send([testData.categories.c03.id])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nRemove, 1);
  });

  it('should create item s01-c01-001-S', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s01-c01-001-S"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s01-c01-001-S'].id = obj.id;
  });

  it('should create item s01-c01-001-M', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s01-c01-001-M"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s01-c01-001-M'].id = obj.id;
  });

  it('should create item s01-c01-001-L', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s01-c01-001-L"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s01-c01-001-L'].id = obj.id;
  });

  it('should create item s01-c02-001-3S', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s01-c02-001-3S"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s01-c02-001-3S'].id = obj.id;
  });

  it('should create item s02-c02-001-XL', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s02-c02-001-XL"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s02-c02-001-XL'].id = obj.id;
  });

  it('should create item s02-c02-001-2L', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s02-c02-001-2L"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s02-c02-001-2L'].id = obj.id;
  });

  it('should create item s02-c02-001-3L', async () => {
    try {
      var res = await agent.post('/item/create')
        .set('Content-Type', 'application/json')
        .send(testData.items["s02-c02-001-3L"])
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.items['s02-c02-001-3L'].id = obj.id;
  });

  it('should get all items', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 7);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-S"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s01-c01-001-S"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s01-c01-001-S"].category);
    assert.strictEqual(obj[0].size, testData.items["s01-c01-001-S"].size);
    assert.strictEqual(obj[0].cost, testData.items["s01-c01-001-S"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s01-c01-001-S"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s01-c01-001-S"].marketPrice);
  });

  it('should get items of supplier=s01', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .send({ supplierID: testData.suppliers.s01.id })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 4);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-S"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s01-c01-001-S"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s01-c01-001-S"].category);
    assert.strictEqual(obj[0].size, testData.items["s01-c01-001-S"].size);
    assert.strictEqual(obj[0].cost, testData.items["s01-c01-001-S"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s01-c01-001-S"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s01-c01-001-S"].marketPrice);
  });

  it('should get items whose name has c02', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .send({ 'name': 'C02' })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 4);
    assert.strictEqual(obj[0].name, testData.items["s01-c02-001-3S"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s01-c02-001-3S"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s01-c02-001-3S"].category);
    assert.strictEqual(obj[0].size, testData.items["s01-c02-001-3S"].size);
    assert.strictEqual(obj[0].cost, testData.items["s01-c02-001-3S"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s01-c02-001-3S"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s01-c02-001-3S"].marketPrice);
  });

  it('should get items of category=c01', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .send({ 'category': testData.categories.c01.name })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 3);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-S"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s01-c01-001-S"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s01-c01-001-S"].category);
    assert.strictEqual(obj[0].size, testData.items["s01-c01-001-S"].size);
    assert.strictEqual(obj[0].cost, testData.items["s01-c01-001-S"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s01-c01-001-S"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s01-c01-001-S"].marketPrice);
  });

  it('should get items of size=L', async () => {
    try {
      var res = await agent.post('/item/query')
        .set('Content-Type', 'application/json')
        .send({ 'size': 'L' })
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 1);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-L"].name);
    assert.strictEqual(obj[0].supplierID, testData.items["s01-c01-001-L"].supplierID);
    assert.strictEqual(obj[0].category, testData.items["s01-c01-001-L"].category);
    assert.strictEqual(obj[0].size, testData.items["s01-c01-001-L"].size);
    assert.strictEqual(obj[0].cost, testData.items["s01-c01-001-L"].cost);
    assert.strictEqual(obj[0].listPrice, testData.items["s01-c01-001-L"].listPrice);
    assert.strictEqual(obj[0].marketPrice, testData.items["s01-c01-001-L"].marketPrice);
  });

  it('should get item by id', async () => {
    try {
      var res = await agent.get('/item?id='+testData.items["s01-c01-001-S"].id)
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-S"].name);
  });

  it('should get item by code', async () => {
    try {
      var res = await agent.get('/item?code='+testData.items["s01-c01-001-S"].code)
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 3);
    assert.strictEqual(obj[0].name, testData.items["s01-c01-001-S"].name);
  });  
});


