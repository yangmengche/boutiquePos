'use strict';
const mongoose = require('mongoose');
const def = require('./def.js')
class DBSchema {
  constructor() {
    this.accountSchema = new mongoose.Schema({
      account: { type: String, required: true, index: true, unique: true },
      password: { type: String, required: true },
      type: {type: String, required: true, enum: ['adm', 'user']}
    });

    this.supplierSchema = new mongoose.Schema({
      name: { type: String, required: true, index: true, unique: true },
      type: { type: String, required: true, enum: def.supplierType },
      shareRate: { type: Number },
      logo: String
    });

    this.categorySchema = new mongoose.Schema({
      name: String
    });

    this.itemSchema = new mongoose.Schema({
      name: String,
      pic: String,
      supplierID: { type: mongoose.Schema.Types.ObjectId, required: true },
      category: { type: String, required: true},
      size: { type: String, required: true, enum: def.size },
      cost: { type: Number, requires: true, min: 0 },
      listPrice: { type: Number, requires: true, min: 0 },
      marketPrice: { type: Number, required: true, min: 0 },
      stock: { type: Number, required: true, default: 0 }
    });

    this.stockLogSchema = new mongoose.Schema({
      date: { type: Date, required: true },
      itemID: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: {type: Number, required: true}
    });

    let receiptItemSchema = new mongoose.Schema({
      itemID: {type: mongoose.Schema.Types.ObjectId, required: true},
      cost: { type: Number, requires: true, min: 0 },
      listPrice: { type: Number, requires: true, min: 0 },
      marketPrice: { type: Number, required: true, min: 0 },
      salePrice: { type: Number, required: true, min: 0 }
    })
    this.receiptSchema = new mongoose.Schema({
      date: {type: Date, required: true},
      items: [this.itemSchema],
      payBy: {type: String, enum: def.payBy},
      remark: String
    })
  }
}

module.exports = new DBSchema();