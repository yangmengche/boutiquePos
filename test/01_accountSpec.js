'use strict';
process.env.NODE_ENV = 'unitTest';

const request = require('supertest');
const assert = require('assert');
const testUtils = require('./testUtils');
const config = require('../config/config');
const testData = require('./testData');

describe('[Account spec]', () => {
  let agent;
  before(async () => {
    try {
      await testUtils.cleanDatabase();
      await testUtils.disconnectDB();
      testUtils.cleanFiles();
      let app = require('../app');
      request(app);
      agent = request.agent(app);
      await testUtils.sleep(2000);
    } catch (err) {
      assert(!err, err.message);
    }
  });
  after(async () => {
  });

  it('should login', async () => {
    try {
      var res = await agent.post('/account/login')
        .set('Content-Type', 'application/json')
        .send(testData.accounts.default)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
  });
  
  it('should get default account info', async () => {
    try{
      var res = await agent.get('/account')
      .set('Content-Type', 'application/json')
      .expect(200);
    }catch(err){
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.account, testData.accounts.default.account);
    assert(!obj.password);
  });
});