// preload.js
const electron = require('electron');
const { ipcRenderer } = electron;
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "company"
  });

  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT `Prev Close`,`Open Price`,`High Price`,`Close Price`,`Low Price`,`Total Traded Quantity`, DATE(`Date`)  AS  `Date` FROM company.acc Where (`Date` BETWEEN '2021-01-01'AND '2021-07-06');",
     function (err, result, fields) {
      if (err) throw err;
      var data_=" ";
      for(var i=0;i<result.length;i++){
        var date_ = result[i]['Date'].toLocaleDateString();;
        var open_ = result[i]['Open Price'];
        var close_ = result[i]['Close Price'];
        var pclose_ = result[i]['Prev Close'];
        var high_ = result[i]['High Price'];
        var low_ = result[i]['Low Price'];
        var volume_ = result[i]['Total Traded Quantity'];
        data_ = '<tr><td>'+ date_ + '</td><td>' +close_+'</td><td>'+open_+'</td><td>'+pclose_+'</td><td>'+high_+'</td><td>'+low_+'</td><td>'+volume_+'</td><td>'+'</td><td>'+'</td><td>'+'</td>'+'</tr>'+data_;
      }
      document.getElementById('data_body').innerHTML=data_;
    });
  });
  
  document.getElementById("view-graph").addEventListener("click", event => {
      ipcRenderer.send('main:graph');
  });

})