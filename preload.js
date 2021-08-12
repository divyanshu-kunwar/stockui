// preload.js
const electron = require('electron');
const { ipcRenderer } = electron;
const remote = electron.remote;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {



  document.getElementById("view-graph").addEventListener("click", event => {
      ipcRenderer.send('main:graph');
  });


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
      maximize_btn.setAttribute("src", "../icon/restore.svg");
    } else {
      window_.unmaximize();
      maximize_btn.setAttribute("src", "../icon/maximize.svg");
    }
  });
  close_btn.addEventListener('click', function (e) {
    var window_ = remote.getCurrentWindow();
    window_.close();
  });
})