// main.js

// Modules to control application life and create native browser window
const {BrowserView, app, BrowserWindow ,ipcMain , nativeTheme } = require('electron')
const path = require('path')

let mainWindow;
function createWindow () {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    resizable:true,
    transparent:true,
    
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
  showGraphWindow();

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
  mainWindow.addBrowserView(graphWindow);
    graphWindow.webContents.send("graph:open");
});
ipcMain.on('main:dashboard', event => {
  mainWindow.addBrowserView(graphWindow);
  graphWindow.webContents.send("dashboard:open");
});

function showGraphWindow(){
   graphWindow = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, '/script/changeGraph.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  
  width_ = mainWindow.getBounds().width;
  height_ = mainWindow.getBounds().height;
  graphWindow.setBounds({ x: 82, y: 50,
     width: width_-82, height: height_-50 });
  mainWindow.setBrowserView(graphWindow);
  // graphWindow.setAutoResize({width:true, height: true});
  graphWindow.webContents.loadURL("file://"+__dirname+"/pages/graph.html");
  graphWindow.webContents.openDevTools()
  
}

ipcMain.on("main:closeBrowserView", ()=>{
  try{
    mainWindow.removeBrowserView(graphWindow);
  }catch{}
});
let childWindow;
ipcMain.on('main:indicatorDialog', event => {
  if(childWindow!=null){
    try{
    childWindow.focus();
  }catch{
    showIndicatorWindow();
  }
  }else{
    showIndicatorWindow();
}
})

ipcMain.on("console_log",function(e,message){
  mainWindow.webContents.send("console_logs",message);
})

function showIndicatorWindow(){
  childWindow = new BrowserWindow({
    top:graphWindow, modal:true,
    width: 400 , 
    height: 600,
    frame:false,
    resizable: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, '/script/indicator.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  childWindow.loadURL("file://"+__dirname+"/pages/indicator.html");
}
ipcMain.on("indicator",function(e,settings){
    graphWindow.webContents.send('indicator', settings);
});