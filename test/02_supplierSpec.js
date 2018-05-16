'use strict';
process.env.NODE_ENV = 'unitTest';

const request = require('supertest');
const assert = require('assert');
const testUtils = require('./testUtils');
const config = require('../config/config');
const testData = require('./testData');

describe('[Supplier spec]', () => {
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
    testUtils.fillSupplierID();
  });

  it('should create the new supplier s01', async () => {
    try {
      var res = await agent.post('/supplier/create')
        .set('Content-Type', 'application/json')
        .send(testData.suppliers.s01)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.suppliers.s01.id = obj.id;
  });

  it('should create the new supplier s02', async () => {
    try {
      var res = await agent.post('/supplier/create')
        .set('Content-Type', 'application/json')
        .send(testData.suppliers.s02)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert(obj.id);
    testData.suppliers.s02.id = obj.id;
  });

  it('should update a supplier', async () => {
    try {
      let updateObj = JSON.parse(JSON.stringify(testData.suppliers.s01));
      updateObj.shareRate = 0.7
      var res = await agent.put('/supplier/update')
        .set('Content-Type', 'application/json')
        .send(updateObj)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.nModified, 1);
  });

  it('should get all supplier', async () => {
    try {
      var res = await agent.get('/supplier')
        .set('Content-Type', 'application/json')
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 2);
    assert.strictEqual(obj[0]._id, testData.suppliers.s01.id);
    assert.strictEqual(obj[0].name, testData.suppliers.s01.name);
    assert.strictEqual(obj[0].type, testData.suppliers.s01.type);
    assert.strictEqual(obj[0].shareRate, 0.7);
  });

});