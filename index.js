// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow ,ipcMain , nativeTheme } = require('electron')
const path = require('path')


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.maximize();
  nativeTheme.shouldUseDarkColors

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let graphWindow;

ipcMain.on('main:graph', event => {
  graphWindow = new BrowserWindow({
    width: 1000, height: 600, frame:false,
    webPreferences: {
      preload: path.join(__dirname, '/script/changeGraph.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  graphWindow.loadURL("file://"+__dirname+"/pages/graph.html");
  //graphWindow.webContents.openDevTools();
  graphWindow.maximize()
  // graphWindow.on('closed', () => {
  //   graphWindow = null;
  // });
});
let childWindow;
ipcMain.on('main:indicatorDialog', event => {

  childWindow = new BrowserWindow({
    top:graphWindow, modal:true,
    width: 400 , 
    height: 600,
    frame:false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '/script/indicator.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  childWindow.loadURL("file://"+__dirname+"/pages/indicator.html");
})
ipcMain.on("ind",function(e,indId){
    graphWindow.webContents.send('ind', indId);
    console.log(indId);
});
