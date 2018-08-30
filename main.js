const log = require('./libs/logger');
const config = require('./config/config');
const { fork, execFile, execFileSync, spawn } = require('child_process');
const path = require('path');
const fse = require('fs-extra');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const utils = require('./libs/utils');

log.setLogFileName('main', config.logPath, true);
log.scheduleClean(24 * 60 * 60 * 1000);
log.writeLog('******** process start, pid:' + process.pid + ' ********', 'info');


// if (environment.production) {
//   enableProdMode();
//   if(window){
//     window.console.log=function(){};
//   }
// }

let pidServer;
let bTerminate=false;
app.on('ready', async ()=>{
  await utils.sleep(2000);
  createWindow();
});

app.on('window-all-closed', () => {
  // darwin = MacOS
  log.writeLog('electron window-all-closed', 'info');
  if (process.platform !== 'darwin') {
    bTerminate = true;
    app.quit();
    pidServer.kill('SIGINT', );
  }
});

app.on('activate', async () => {
  if (win === null) {
    await utils.sleep(3000);
    createWindow();
  }
});

function createWindow() {
  // Create the browser window.
  log.writeLog('electron create borwser window', 'info');
  win = new BrowserWindow({
    width: 1024,
    height: 800,
    maximizable: true,
    autoHideMenuBar: true,
    resizable: true,
  });

  try{
    win.loadURL('http://localhost:1688');
    log.writeLog('electron load url', 'info');
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'public/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
  }catch(err){
    log.writeLog(err.message, 'error');
    // console.log(err.message);
  }

  // Open DevTools.
  // win.webContents.openDevTools()

  // When Window Close.
  win.on('closed', () => {
    log.writeLog('electron window-closed', 'info');
    win = null;
  });

}

const cwd = process.cwd();
function launchServer() {
  let serverPath = path.resolve(cwd, config.serverPath);
  if (!fse.existsSync(serverPath)) {
    log.writeLog('Server (' + serverPath + ') Not found', 'error');
  } else {
    try {
      // let pidServer = spawn(process.execPath, [serverPath], {cwd: cwd});
      pidServer = fork(serverPath, {cwd: cwd});
    } catch (err) {
      log.writeLog(err.message);
    }
    log.writeLog('Server launched', 'info');
    pidServer.on('exit', (code, signal) => {
      if(!bTerminate){
        log.writeLog('Server exit and try to restart', 'warn');
        launchServer();
      }
    });
  }
}
launchServer();