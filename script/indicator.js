const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;
window.addEventListener('DOMContentLoaded', () => {
var id = 0;
  var ind_table = document.getElementById('selected_ind_table');
    addIndicator("Volume");
    addIndicator("sma");
    // function for adding indicator
    function addIndicator(name){
        var currentId = id;
      //append new idicator to table
        ind_table.innerHTML = ind_table.innerHTML +
        "<tr id='ind"+currentId+"'><td>"
        +name
        +"</td><td class='rightMenu'><img src='../icon/eyehide.svg' class='eye_indicator'>"
        +"<img src='../icon/setting.svg'>"
        +"<img src='../icon/closebtn.svg' class='close_indicator'></td></tr>"
        id++;         //increment id

        //set On ClickListener to the indicator
        document.getElementById("ind"+currentId).addEventListener('click',function(e){
            ipcRenderer.send("ind",currentId);
        })
    }



    var close_btn = document.getElementById('close_indictor');
    close_btn.addEventListener('click', function (e) {
        e.preventDefault();
        var window_ = remote.getCurrentWindow();
        window_.close();
      });
});