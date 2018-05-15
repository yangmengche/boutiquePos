/**
 * write log to file
 * v: 1.1.1
 * 2017/9/21
 * Yang Meng-Che
**/

"use strict";
const fs = require('fs');
const path = require('path');
let logFile = 'error';
var addDate = false;
var isEnable = false;

// customize >>>
var logPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
logPath = logPath ? logPath : '/var/log';
// var logPath = '/var/log';
// customize <<<

// logPath = logPath+'/.aplogger/';

// var LEVEL={
//   info: '[INFO] ',
//   warn: '[WARN] ',
//   error: '[ERROR] ',
//   assert: '[ASSERT] ',
//   debug: '[DEBUG] '
// };

var LEVEL = {
  info: '[@I] ',
  warn: '[@W] ',
  error: '[@E] ',
  assert: '[@A] ',
  debug: '[@D] '
};

function nextRotate(){
  let now = new Date();
  let a = now.getTime();
  now.setUTCHours(23, 59, 59, 999);
  return now.getTime()-a+60000;
}

function setLogFileName(fileName, folder, bAddDate) {
  isEnable = true;
  if (folder) {
    logPath = path.resolve(logPath, folder);
  } else {
    logPath = logPath + '/.aplogger/';
  }
  logFile = fileName;
  addDate = bAddDate ? true : false;
  try {
    if (!fs.existsSync(logPath))
      fs.mkdirSync(logPath);
    fs.mkdirSync(logPath + '/zip');
  } catch (e) { }
  zipfile();
  removeLogFile();
  setTimeout(onRotate, nextRotate());
}

function getLogFileName2(date){
  var file = path.resolve(logPath,logFile);
  var now = date? new Date(date):new Date();
  if (addDate) {
    file = path.resolve(logPath, logFile+'.log.'+now.toISOString().split('T')[0]);
  }
  return file;
}

function getLogFileName(date, postfix, bNoDate){
  var file = path.resolve(logPath,logFile);
  postfix = postfix?'-'+postfix:'';
  if (addDate && !bNoDate) {
    var now = date? new Date(date):new Date();
    file = path.resolve(logPath, logFile+'-'+now.toISOString().split('T')[0]+postfix+'.log');
  }else{
    file = path.resolve(logPath, logFile+postfix+'.log');
  }
  return file;
}

function enableLog(bEnable) {
  isEnable = Boolean(bEnable);
}

function scheduleClean(time) {
  setInterval(() => {
    zipfile();
    removeLogFile();
  }, time);
}

function onRotate(){
  let file = getLogFileName(null, null, true);
  // let file = path.resolve(logPath, logFile);
  let time = new Date();
  time.setDate(time.getDate()-1);
  let newFile = getLogFileName(time);
  try{
    for(let i=0; ;i++){
      let stat = fs.statSync(newFile);
      newFile = getLogFileName(time, i);
    }
  }catch(err){};
  fs.renameSync(file, newFile);
  setTimeout(onRotate, nextRotate());
}

function _getCallerInfo() {
  try {
    var err = new Error();
    var callerfile;
    var currentfile;
    var curStack;

    Error.prepareStackTrace = function (err, stack) { return stack; };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      curStack = err.stack.shift();
      callerfile = curStack.getFileName();

      if (currentfile !== callerfile) {
        return { 'file': callerfile, 'line': curStack.getLineNumber(), 'function': curStack.getFunctionName() };
      }
    }
  } catch (err) { }
  return undefined;
}

// format log topic
function flt(tags) {
  let ret = '';
  if (tags && tags.length > 0) {
    ret += '<';
    for (let i in tags) {
      ret += tags[i] + '/';
    }
    ret += '>';
  }
  return ret;
}

/*
 * Write log to file.
 * @param {String} log log string.
 * @param {String} level The log level. Support five levels: info, warn, error, assert, debug.
 * @param {number} stackType 0: disable, 1: file and line, 2:full
 */
function writeLog(log, level, stackType) {
  if (!isEnable) {
    return;
  }
  var callerInfo = _getCallerInfo();
  var prefix = LEVEL[level];
  var now = new Date();

  // customize>>>
  let file = getLogFileName(null, null, true);
  // let file = getLogFileName();
  // customize <<<

  var logText = '[' + now.toJSON() + ']';
  if (prefix) {
    logText += prefix;
  }
  stackType = (typeof stackType === 'number') ? stackType : 2;
  if (stackType > 0) {
    var callfile = callerInfo.file.split('/');
    var fun = '';
    if (callerInfo.function) {
      fun = callerInfo.function.split(".").pop();
    }
    if (stackType === 1) {
      logText += '[' + callfile.pop() + '(' + callerInfo.line + ')]';
    } else {
      logText += '[' + callfile.pop() + '(' + callerInfo.line + '):' + fun + ']';
    }
  }
  logText += log;

  fs.appendFile(file, logText + '\r\n', () => { });

  if (process.env.DEBUG && (process.env.DEBUG === 'yes') && console.log) {
    console.log(logText);
  }
}

function removeLogFile() {
  var d = new Date();
  d.setMonth(d.getMonth() - 6);
  var files = fs.readdirSync(logPath + '/zip');
  const exec = require('child_process').exec;
  for (var i = 0; i < files.length; i++) {
    if (path.extname(files[i]) !== '.gz') {
      continue;
    }
    var name = path.basename(files[i], '.log.tar.gz');
    var date = name.split('-', 3);
    if (date.length === 3) {
      var d2 = new Date();
      d2.setFullYear(date[0]);
      d2.setMonth(date[1] - 1);
      d2.setDate(date[2]);
      if (d2 < d) {
        try {
          fs.unlinkSync(path.resolve(logPath, 'zip', files[i]));
        } catch (err) { }
      }
    }
  }
}

function zipfile() {
  var d = new Date();
  d.setDate(d.getDate() - 7);
  var files = fs.readdirSync(logPath);
  const exec = require('child_process').exec;
  function zip() {
    try {
      // zip file
      let src = path.resolve(logPath, files[i]);
      let out = path.resolve(logPath, 'zip', files[i] + '.tar.gz');
      let cmd = 'tar zcf ' + out + ' -C ' + logPath + ' ' + files[i];
      exec(cmd, (err, stdout, stderr) => {
        if (!err) {
          try {
            fs.unlinkSync(src);
          } catch (err) { }
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  for (var i = 0; i < files.length; i++) {
    if (path.extname(files[i]) !== '.log') {
      continue;
    }
    var name = path.basename(files[i], '.log');
    var date = name.split('-', 3);
    if (date.length === 3) {
      var d2 = new Date();
      d2.setFullYear(date[0]);
      d2.setMonth(date[1] - 1);
      d2.setDate(date[2]);
      if (d2 < d) {
        zip();
      }
    }
  }
}

exports.setLogFileName = setLogFileName;
exports.getLogFileName = getLogFileName;
exports.flt = flt;
exports.writeLog = writeLog;
exports.enableLog = enableLog;
exports.level = LEVEL;
exports.scheduleClean = scheduleClean;

exports.getLogFileName2 = getLogFileName2;