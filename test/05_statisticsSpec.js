'use strict';
process.env.NODE_ENV = 'unitTest';

const request = require('supertest');
const assert = require('assert');
const testUtils = require('./testUtils');
const config = require('../config/config');
const testData = require('./testData');
const moment = require('moment');

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

  it('should get data group by monthDay of a month', async () => {
    try {
      let now = new Date();
      let query={
        'date':{
          'min': now.getTime() - 30*24*60*60*1000,
          'max': now.getTime() + 60*60*1000,
        },
        'group': 'dayOfMonth'
      };
      var res = await agent.post('/receipt/histogram')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 3);
    assert.strictEqual(obj[0].cost, 253.5);
    assert.strictEqual(obj[0].quantity, 1);
    assert.strictEqual(obj[0].revenue, 590);
    assert.strictEqual(obj[1].cost, 1167);
    assert.strictEqual(obj[1].quantity, 5);
    assert.strictEqual(obj[1].revenue, 2730);
    assert.strictEqual(obj[2].cost, 990);
    assert.strictEqual(obj[2].quantity, 2);
    assert.strictEqual(obj[2].revenue, 1810);        
  });
  
  it('should get data group by weekday of a month', async () => {
    try {
      let now = new Date();
      let query={
        'date':{
          'min': now.getTime() - 30*24*60*60*1000,
          'max': now.getTime() + 60*60*1000,
        },
        'group': 'dayOfWeek'
      };
      var res = await agent.post('/receipt/histogram')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    let d = moment().day();
    let index = [0, 1, 2];
    switch(d){
      case 0:
        index = [1, 2, 0];
        break;
      case 1:
        index = [2, 0, 1];
    }

    assert.strictEqual(obj.length, 3);
    assert.strictEqual(obj[index[0]].cost, 253.5);
    assert.strictEqual(obj[index[0]].quantity, 1);
    assert.strictEqual(obj[index[0]].revenue, 590);
    assert.strictEqual(obj[index[1]].cost, 1167);
    assert.strictEqual(obj[index[1]].quantity, 5);
    assert.strictEqual(obj[index[1]].revenue, 2730);
    assert.strictEqual(obj[index[2]].cost, 990);
    assert.strictEqual(obj[index[2]].quantity, 2);
    assert.strictEqual(obj[index[2]].revenue, 1810);        
  });  

  it('should get data group by month of a year', async () => {
    try {
      let now = new Date();
      let query={
        'date':{
          'min': now.getTime() - 365*24*60*60*1000,
          'max': now.getTime() + 60*60*1000,
        },
        'group': 'month'
      };
      var res = await agent.post('/receipt/histogram')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 1);
    assert.strictEqual(obj[0].cost, 2410.5);
    assert.strictEqual(obj[0].quantity, 8);
    assert.strictEqual(obj[0].revenue, 5130);
  }); 

  it('should get all data group by year', async () => {
    try {
      let now = new Date();
      let query={
        'group': 'year'
      };
      var res = await agent.post('/receipt/histogram')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 1);
    assert.strictEqual(obj[0].cost, 2410.5);
    assert.strictEqual(obj[0].quantity, 8);
    assert.strictEqual(obj[0].revenue, 5130);
  });

  it('should pie data and group by supplier name', async () => {
    try {
      let now = new Date();
      let query={
        'group': 'supplier'
      };
      var res = await agent.post('/receipt/pie')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 2);
    assert.strictEqual(obj[0]._id, "S01");
    assert.strictEqual(obj[0].cost, 760.5);
    assert.strictEqual(obj[0].quantity, 3);
    assert.strictEqual(obj[0].revenue, 1770);
    assert.strictEqual(obj[1]._id, "S02");
    assert.strictEqual(obj[1].cost, 1650);
    assert.strictEqual(obj[1].quantity, 5);
    assert.strictEqual(obj[1].revenue, 3360);    
  });

  it('should pie data and group by category', async () => {
    try {
      let now = new Date();
      let query={
        'group': 'category'
      };
      var res = await agent.post('/receipt/pie')
        .set('Content-Type', 'application/json')
        .send(query)
        .expect(200);
    } catch (err) {
      assert(!err, err.message);
    }
    let obj = JSON.parse(res.text);
    assert.strictEqual(obj.length, 2);
    assert.strictEqual(obj[0]._id, "Jeans");
    assert.strictEqual(obj[0].cost, 1650);
    assert.strictEqual(obj[0].quantity, 5);
    assert.strictEqual(obj[0].revenue, 3360);    
    assert.strictEqual(obj[1]._id, "Shirt");
    assert.strictEqual(obj[1].cost, 760.5);
    assert.strictEqual(obj[1].quantity, 3);
    assert.strictEqual(obj[1].revenue, 1770);    
  });  
});

