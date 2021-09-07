const { PythonShell } = require('python-shell');
const electron = require('electron');
const remote = electron.remote;
const mysql = require('mysql');
const { ipcRenderer } = require('electron');
require('./updateFavList.js')

window.addEventListener('DOMContentLoaded', () => {
  var indicator_list = {}
  var exchangeName = "BSE"
  var prevExchange = ""
  var companyName = "reliance";
  var prevCompany = "";
  var prevGraph = "";
  var graphName = "candle";
  setGraph("barsBtn", "bars");
  setGraph("candleBtn", "candle");
  setGraph("hollowcandleBtn", "hollowcandle");
  setGraph("heikinashiBtn", "heikinashi");
  setGraph("lineBtn", "line");
  setGraph("areaBtn", "area");
  setGraph("baselineBtn", "baseline");
  setGraph("renkoBtn", "renko");
  setGraph("linebreakBtn", "linebreak");
  setGraph("kagiBtn", "kagi");
  setGraph("pnfBtn", "pnf");

  function setGraph(elementName, graph) {
    var graphSrc = graph + "_.svg";
    document.getElementById(elementName).addEventListener("click", function (e) {
      document.getElementById("dropGraphType").style.display = "none";
      document.getElementById("graphchange").setAttribute("src", "../icon/" + graphSrc);
      graphName = graph;
      change_graph();
    });
  }

  change_graph();

  function change_graph() {
    if (prevGraph == graphName && (prevCompany == companyName) && (prevExchange== exchangeName)) {
    }
    else if ((prevGraph == "candle" || prevGraph == "bars" || prevGraph == "line"
     || prevGraph == "area" || prevGraph == "baseline")
        && (graphName == "candle" || graphName == "bars" || graphName == "line" 
        || graphName == "area" || graphName == "baseline")&&(prevCompany == companyName) && (prevExchange== exchangeName)) {
      document.getElementById("hiddenGraphType").innerHTML = graphName;
    } else {
      let pyshell = new PythonShell('graph/callData.py');
      var message_send = { graphName, companyName , exchangeName };
      // send name of the graph
      pyshell.send(JSON.stringify(message_send));

      //receieve data from python
      pyshell.on('message', function (message) {
        document.getElementById("hiddenGraphType").innerHTML = graphName;
        document.getElementById("hiddenData").innerHTML = message;
        console.log(JSON.parse(message));
      });
      pyshell.end(function (err) {
        if (err) {
          console.log(err)
          throw err;
        };
        console.log('finished');
      });
    }
    prevGraph = graphName;
    prevCompany = companyName;
    prevExchange = exchangeName;
  }

  btn = document.getElementById("intervalchange");
  btn2 = document.getElementById("graphchange");
  btn3 = document.getElementById("indicator");
  btn4 = document.getElementById("close_indictor");

  elementToCollapse = document.getElementById("dropIntervalType");
  elementToCollapse2 = document.getElementById("dropGraphType");
  elementToCollapse3 = document.getElementById("indicator_box");


  toggleDropDown(btn, elementToCollapse);
  toggleDropDown(btn2, elementToCollapse2);
  // toggleDropDown(btn3, elementToCollapse3);
  // toggleDropDown(btn4, elementToCollapse3);

  btn3.addEventListener("click", (e) => {
    ipcRenderer.send("main:indicatorDialog");
  })


  // toogle drop down menu by passing btn id and drop down id
  function toggleDropDown(btn, elementToCollapse) {
    btn.addEventListener("click", function (e) {

      // change display property on basis of previous property
      if (elementToCollapse.style.display == "none") {
        elementToCollapse.style.display = "block";
      } else {
        elementToCollapse.style.display = "none";
      }
    })
  }

  // make search list visible on input focus (searching)
  var search_list = document.getElementById("search_list");
  var company_list = document.getElementById("company_list");
  var search_box = document.getElementById("search_input");
  var table_for_search = document.getElementById("search_result");

  search_box.addEventListener("focus", function (e) {
    var input_text = "";
    search_list.style.display = "block";
    company_list.style.display = "none";
    setInterval(function (e) {
      if (search_box.value != input_text) {
        input_text = search_box.value;
        var queryBSE = "SELECT Table_name as stock from information_schema.tables where (table_schema = 'bse') and (table_name Like '%" + input_text + "%');"
        var queryNSE = "SELECT Table_name as stock from information_schema.tables where (table_schema = 'nse') and (table_name Like '%" + input_text + "%');"
        con.query(queryBSE, function (err, result) {
          if (err) throw err;
          var search_row = ""
          for (var i = 0; i < 5; i++) {
            try {
              search_row += "<tr class='companyName' ><td id='companyBSE" + i.toString() + "'>" + result[i]['stock'] + "</td>"
                + "<td class='action_btn'>"
                + "<img src='../icon/buy_btn.svg' />"
                + "<img src='../icon/sell_btn.svg' />"
                + "<img id='addFavComBSE"+ i.toString() +"' src='../icon/add_btn.svg' />"
                + "</td>"
                + "<td class='exchange_'>BSE</td>"
                + "<td class='view_g'><img src='../icon/graph_fav.svg' /></td></tr>"
            } catch { }
          }
          table_for_search.innerHTML = search_row;
        });
        con.query(queryNSE, function (err, result) {
          if (err) throw err;
          var search_row = ""
          for (var i = 0; i < 5; i++) {
            try {
              search_row += "<tr class='companyName' ><td id='companyNSE" + (i).toString() + "'>" + result[i]['stock'] + "</td>"
                + "<td class='action_btn'>"
                + "<img src='../icon/buy_btn.svg' />"
                + "<img src='../icon/sell_btn.svg' />"
                + "<img id='addFavComNSE"+ i.toString() +"' src='../icon/add_btn.svg' />"
                + "</td>"
                + "<td class='exchange_'>NSE</td>"
                + "<td class='view_g'><img src='../icon/graph_fav.svg' /></td></tr>"
            } catch { }
          }
          table_for_search.innerHTML += search_row;
          for (var j = 0; j < 5; j++) {
            if (document.getElementById("companyBSE" + j.toString()) != null) {
              let company_res = document.getElementById("companyBSE" + j.toString());
              let company_add = document.getElementById("addFavComBSE" + j.toString())
              console.log(company_res);
              console.log(j);

              company_res.addEventListener("click", function (e) {
                change_company(company_res.innerHTML,"bse");
              })

              // add event listener on add button
              company_add.addEventListener("click",()=>{
                add_list(company_res.innerHTML,"bse")
              })
            }
            if (document.getElementById("companyNSE" + (j).toString()) != null) {
              let company_res = document.getElementById("companyNSE" + j.toString());
              let company_add = document.getElementById("addFavComNSE" + j.toString())
              console.log(company_res);
              console.log(j);

              company_res.addEventListener("click", function (e) {
                change_company(company_res.innerHTML,"nse");
              })

              // add event listener on add button
              company_add.addEventListener("click",()=>{
                add_list(company_res.innerHTML,"nse")
              })

            }
          }
        });
      }
    }, 100);
  }, true);

  search_box.addEventListener("blur", function (e) {
    if (search_box.value == "") {
      search_list.style.display = "none";
      company_list.style.display = "block";
    }
  }, true);


  // connect to my sql database for company data
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vishal"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  minimize_btn = document.getElementById('minimize_btn');
  maximize_btn = document.getElementById('maximize_btn');
  close_btn = document.getElementById('close_btn');


  function change_company(company , exchange) {
    document.getElementById("selected_company").innerHTML = company;
    // console.log(company);
    companyName = company;
    exchangeName = exchange;
    change_graph();
  }


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

  var hiddenInd = document.getElementById("hiddenInd");
  ipcRenderer.on('indicator', function (evt, message_r) {
    let msg_received = message_r;
    let pyshell = new PythonShell('graph/callIndicator.py');
    indicator_id = msg_received.id;
    no_of_controls = Object.keys(msg_received.controls).length;
    column_arr = [], period_arr = [];
    for (var i = 0; i < no_of_controls; i++) {
      hasNumInput = (msg_received.controls[i].numInput != null);
      hasSelectInput = (msg_received.controls[i].selectInput != null);
      if (hasNumInput) period_arr[period_arr.length] = msg_received.controls[i].numInput.value;
      if (hasSelectInput) column_arr[column_arr.length] = msg_received.controls[i].selectedValue;
    }
    data_to_send = JSON.parse(document.getElementById("hiddenData").innerHTML);
    console.log(data_to_send);

    if (column_arr.length > 0 && period_arr.length > 0) {
      send_data(0);
    } else if (column_arr.length > 0) {
        send2_data(0);
    } else if (period_arr.length > 0) {
        send3_data(0);
    } else {
      message_send = { indicator_id, data_to_send };
      pyshell.send(JSON.stringify(message_send));

      pyshell.on('message', function (message) {
        msg_received.data[Object.keys(msg_received.data).length] = JSON.parse(message);
        indicator_list[msg_received.number] = msg_received;
        hiddenInd.innerHTML = JSON.stringify(indicator_list);
      });
      pyshell.end(function (err) {
        if (err) {
          console.log(err)
          throw err;
        };
        console.log('finished');
      });

    }

    function send_data(i){
      column = column_arr[i], period = period_arr[i];
      message_send = { indicator_id, data_to_send, column, period };
      pyshell.send(JSON.stringify(message_send));

      pyshell.on('message', function (message) {
        msg_received.data[i] = JSON.parse(message);
        indicator_list[msg_received.number] = msg_received;
        hiddenInd.innerHTML = JSON.stringify(indicator_list);
      });
      pyshell.end(function (err) {
        if (err) {
          console.log(err)
          throw err;
        };
        if (i < column_arr.length){
            send_data(i+1);
        }
        console.log('finished');
      });
    }

    function send2_data(i){
      column = column_arr[i]
      message_send = { indicator_id, data_to_send, column};
      pyshell.send(JSON.stringify(message_send));

      pyshell.on('message', function (message) {
        msg_received.data[Object.keys(msg_received.data).length] = JSON.parse(message);
        indicator_list[msg_received.number] = msg_received;
        hiddenInd.innerHTML = JSON.stringify(indicator_list);
      });
      pyshell.end(function (err) {
        if (err) {
          console.log(err)
          throw err;
        };
        if (i < column_arr.length){
            send2_data(i+1)
        }
        console.log('finished');
      });
    }

    function send3_data(i){
      period = period_arr[i];
      message_send = { indicator_id, data_to_send, period };
      pyshell.send(JSON.stringify(message_send));

      pyshell.on('message', function (message) {
        msg_received.data[Object.keys(msg_received.data).length] = JSON.parse(message);
        indicator_list[msg_received.number] = msg_received;
        hiddenInd.innerHTML = JSON.stringify(indicator_list);
      });
      pyshell.end(function (err) {
        if (err) {
          console.log(err)
          throw err;
        };
        if (i < column_arr.length){
            send3_data(i+1)
        }
        console.log('finished');
      });
    }
  });

  ipcRenderer.on('dashboard:open',function(evt){
    console.log("opening dashboard");
    document.getElementById("dashboard_").style.display = "block";
    document.getElementById("graph_").style.display = "none";
  });
  ipcRenderer.on('graph:open',function(evt){
      console.log("opening graph");
      document.getElementById("dashboard_").style.display = "none";
      document.getElementById("graph_").style.display = "block";
  });
  document.getElementById("dashboard_").style.display = "block";
  document.getElementById("graph_").style.display = "none";

  document.getElementById("portofolio_link").addEventListener("click",function(e){
      document.getElementById("transaction_main").style.display = "none";
      document.getElementById("portofolio_main").style.display = "block";
      document.getElementById("portofolio_link").style.color = "#007bff"
      document.getElementById("transaction_link").style.color = "#555"
  });
  document.getElementById("transaction_link").addEventListener("click",function(e){
    document.getElementById("transaction_main").style.display = "block";
    document.getElementById("portofolio_main").style.display = "none";
    document.getElementById("portofolio_link").style.color = "#555"
    document.getElementById("transaction_link").style.color = "#007bff"
  });

  var prev_con_length = 0;
  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function () {
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
  }
  /*
  setInterval(() =>{
    if(console.logs.length>prev_con_length){
      for(var i=prev_con_length; i<console.logs.length; i++){
        ipcRenderer.send("console_log",console.logs[i]);
         
      }
      prev_con_length = console.logs.length;
    }

  },300);

*/

// require file system for read and write
const fs = require('fs')

var favList = {
    0:{Company_name:"Reliance" , Company_exchange:"bse"},
}

function add_list(comp_name , comp_exchange){
favList[ Object.keys(favList).length ] = {Company_name:comp_name, Company_exchange:comp_exchange};
fs.writeFile('./user_settings/fav_list.json', JSON.stringify(favList), err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })
}


});

