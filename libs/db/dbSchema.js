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
      logo: String,
      removed: Boolean
    });

    this.categorySchema = new mongoose.Schema({
      name: {type: String, required: true, unique:true}
    });

    this.itemSchema = new mongoose.Schema({
      code: {type: String, required: true},
      name: String,
      pic: String,
      supplierID: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'suppliers' },
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
      code: String,
      cost: { type: Number, requires: true},
      listPrice: { type: Number, requires: true},
      marketPrice: { type: Number, required: true},
      salePrice: { type: Number, required: true},
      quantity: {type: Number, required: true}
    })
    this.receiptSchema = new mongoose.Schema({
      date: {type: Date, required: true},
      items: [receiptItemSchema],
      payBy: {type: String, enum: def.payBy},
      pay: {type: Number, required: true},
      quantity: {type: Number, required: true},
      remark: String,
      returnRefID: mongoose.Schema.Types.ObjectId
    })
  }
}

module.exports = new DBSchema();