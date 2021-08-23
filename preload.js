// preload.js
const electron = require('electron');
const { ipcRenderer } = electron;
const remote = electron.remote;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {



  document.getElementById("home_btn").addEventListener("click", event => {
    ipcRenderer.send('main:dashboard');
  });
  document.getElementById("graph_btn").addEventListener("click", event => {
    ipcRenderer.send('main:graph');
  });
  ipcRenderer.on("console_logs",function(e,message){
      document.getElementById("hiddenLog").innerHTML = (message.toString());
  })

  hideBrowserView("screener_btn");
  hideBrowserView("news_btn");
  hideBrowserView("setting_btn");
  hideBrowserView("console_btn");
  hideBrowserView("downloads_btn");
  function hideBrowserView(elementId) {
    btn = document.getElementById(elementId);
    btn.addEventListener("click", function (e) {
      ipcRenderer.send('main:closeBrowserView');
    });
  }

  minimize_btn = document.getElementById('minimize_btn');
  maximize_btn = document.getElementById('maximize_btn');
  close_btn = document.getElementById('close_btn');
  minimize_btn.addEventListener('click', function (e) {
    var window_ = remote.getCurrentWindow();
    window_.minimize();
  });

  maximize_btn.addEventListener('click', function (e) {
    var window_ = remote.getCurrentWindow();
    if (!window_.isMaximized()) {
      window_.maximize();
      maximize_btn.setAttribute("src", "icon/restore.svg");
    } else {
      window_.unmaximize();
      maximize_btn.setAttribute("src", "icon/maximize.svg");
    }
  });
  close_btn.addEventListener('click', function (e) {
    var window_ = remote.getCurrentWindow();
    window_.close();
  });
})