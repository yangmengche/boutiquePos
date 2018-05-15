'use strict';
const formidable = require('formidable');
const mime = require('mime-types');
const fse = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const errCode = require('./statusCode').ErrorCode;
const succCode = require('./statusCode').SuccessCode;
const config = require('../config/config');
const log = require('./logger');
// const request = require('request');

class Utils {
  static fnGetBody(req) {
    return new Promise((resolve, reject) => {
      if (req.readable) {
        let data = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
          data += chunk;
        });
        req.on('end', function () {
          let obj;
          if (data.length > 0) {
            try {
              obj = JSON.parse(data);
            } catch (err) {
              log.writeLog('err=' + err.message, 'error');
              return reject(errCode.ParameterError);
            }
          }
          if ('body' in req !== true) req.body = obj;
          resolve(obj);
        });
      } else {
        resolve(req.body);
      }
    });
  }

  static fnResponse(status, data, res) {
    if (!res)
      return;
    if (status) {
      if (status.code) {
        // if (status.code !== 204) {
        //   res.setHeader('Content-Type', 'text/JSON');
        // }
        res.status(status.code);
        if (-1 !== Object.keys(succCode).indexOf(status.id) && data && typeof data === 'object') {
          let raw = JSON.stringify(data);
          res.setHeader('Content-Type', 'text/JSON');
          res.setHeader('Content-length', Buffer.byteLength(raw, 'utf8'));
          res.write(raw, 'utf8');
        } else {
          delete status.prototype;
          // don't output error body
          // res.write(JSON.stringify(status), 'utf8');
        }
      } else {
        res.status(errCode.UnCatchedError.code);
        // don't output error body
        // res.write(JSON.stringify(errCode.UnCatchedError), 'utf8');
      }
    } else {
      res.status(200);
      if (data && typeof data === 'object') {
        let raw = JSON.stringify(data);
        res.setHeader('Content-Type', 'text/JSON');
        res.setHeader('Content-length', Buffer.byteLength(raw, 'utf8'));
        res.write(raw, 'utf8');
      }
    }
    res.end();
  }
  static fnUploadFile(req, folder, name) {
    return new Promise((resolve, reject) => {
      let saveName;
      let form = new formidable.IncomingForm();
      form.parse(req, async (err, field, file) => {
        if (err) {
          log.writeLog('file upload fail, err=' + err.message, 'error');
          return reject(errCode.InternalError);
        }
        let ext = mime.extension(file.file.type);
        if (ext !== 'png' && ext !== 'jpeg' && ext !== 'bmp') {
          log.writeLog('image format not support, ' + file.type, 'warn');
          return reject(errCode.MediaNotSupport);
        }
        let src = file.file;
        if (!src) {
          log.writeLog('file not upload', 'error');
          return reject(errCode.ParameterError);
        }
        let url;
        try {
          if (!fse.existsSync(folder)) {
            fse.mkdirsSync(folder);
          }
          url = '/resource/' + name + '.' + ext;
          saveName = path.join(folder, name + '.' + ext);
          fse.moveSync(src.path, saveName);
          return resolve({ 'file': url, 'type': file.type });
        } catch (e) {
          log.writeLog(e.message, 'error');
          return reject(errCode.InternalError, null);
        }
      });
    });
  }

  static fnRemoveField(obj, field) {
    try {
      for (let k of Object.keys(obj)) {
        if (k === field) {
          delete obj[k];
        } else {
          // let a = obj[k];
          let b = typeof obj[k];
          if (obj[k] !== null && typeof obj[k] === 'object') {
            this.fnRemoveField(obj[k], field);
          }
        }
      }
      return obj;
    } catch (err) {
      log.writeLog(err.message, 'error');
      return obj;
    }
  }

  static crypto(src){
    let cipher = crypto.createCipher('aes256', config.secretKey);
    let encrypted = cipher.update(src);
    encrypted += cipher.final('hex');
    return encrypted;
  }

}

module.exports = Utils;