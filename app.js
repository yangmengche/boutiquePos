const express = require('express');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const fse = require('fs-extra');

const index = require('./routes/index');
const accountRoute = require('./routes/v1/accountRoute');
const supplierRoute = require('./routes/v1/supplierRoute');
const itemRoute = require('./routes/v1/itemRoute');
const statisticsRoute = require('./routes/v1/statisticsRoute');

const config = require('./config/config');
const dbBase = require('./libs/db/dbBase');


const app = express();
app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  'secret': 'boutiquePos-dybjpIDgMq',
  'resave': true,
  'saveUninitialized': true,
  'unset': 'destroy',
  'cookie': { 'secure': false, maxAge: 12*60*60*1000},
  'store': new MongoStore({ url: config.dbPath })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/v1', accountRoute);
app.use('/v1', supplierRoute);
app.use('/v1', itemRoute);
app.use('/v1', statisticsRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


async function InitApplication(){
  log = require('./libs/logger');
  let os = require('os');
  log.setLogFileName('boutiquePos_'+os.hostname(), config.logPath, true);
  log.scheduleClean(24*60*60*1000);
  try{
    fse.ensureDirSync(config.resourcePath);
    fse.ensureDirSync(config.tempPath);
  }catch(err){
    log.writeLog(err.message, 'error');
  }
  let noImagePath = path.resolve(config.resourcePath, 'noImage.jpeg');
  try{
    fse.statSync(noImagePath);
  }catch(err){
    fse.copyFileSync(config.noImagePath, noImagePath);
  }
  log.writeLog('\n********************************\n*     boutiquePos Server Start!     *\n********************************', 'info');
  if(process.env.LOG ==='no' || process.env.LOG ==='false'){
    log.enableLog(false);
  }
  try{
    await dbBase.connect();
    // create default account
    await dbBase.createDefaultAccount();    
    log.writeLog('Application start!', 'info');
  }catch(err){
    log.writeLog(err.message, 'error');
  }
};

InitApplication();

module.exports = app;
