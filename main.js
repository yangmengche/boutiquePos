const { app, BrowserWindow } = require('electron')
const log = require('./libs/logger');
const config = require('./config/config');
const { fork, execFile, execFileSync, spawn } = require('child_process');
const path = require('path')
const fse = require('fs-extra');
const url = require('url');

log.setLogFileName('main', config.logPath, true);
log.scheduleClean(24 * 60 * 60 * 1000);
log.writeLog('******** Launcher, pid:' + process.id + ' ********', 'info');

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // darwin = MacOS
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 400,
    maximizable: true
  })

  
  try{
    win.loadURL('https://localhost:1689');
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'public/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
  }catch(err){
    console.log(err.message);
  }

  // Open DevTools.
  win.webContents.openDevTools()

  // When Window Close.
  win.on('closed', () => {
    win = null
  })

}

const cwd = process.cwd();
function launchServer() {
  let serverPath = path.resolve(cwd, './bin/www');
  if (!fse.existsSync(serverPath)) {
    log.writeLog('Server (' + serverPath + ') Not found', 'error');
  } else {
    let pidServer;
    try {
      // let pidServer = spawn(process.execPath, [serverPath], {cwd: cwd});
      pidServer = fork(serverPath, {cwd: cwd});
    } catch (err) {
      log.writeLog(err.message);
    }
    log.writeLog('Server launched', 'info');
    pidServer.on('exit', (code, signal) => {
      log.writeLog('Server exit and try to restart', 'warn');
      launchServer();
    });
  }
}
launchServer();
