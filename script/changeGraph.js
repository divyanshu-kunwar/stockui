const { PythonShell } = require('python-shell');
const electron = require('electron');
const remote = electron.remote;
const mysql = require('mysql');

window.addEventListener('DOMContentLoaded', () => {

  var companyName = "acc1";
  var graphName = "candle";
  setGraph("barsBtn", "bars");
  setGraph("candleBtn", "candle");
  setGraph("hollowcandleBtn", "hollowcandle");
  setGraph("heikinashiBtn", "heikinashi");
  setGraph("lineBtn","line");
  setGraph("areaBtn","area");
  setGraph("baselineBtn","baseline");
  /*
  
  setGraph("renkoBtn","renko");
  
  setGraph("pnfBtn","pnf");
  setGraph("kagiBtn","kagi");
  setGraph("linebreakBtn","linebreak"); */
  function setGraph(elementName, graph) {
    var graphSrc = graph + "_.svg";
    document.getElementById(elementName).addEventListener("click", function (e) {
      document.getElementById("dropGraphType").style.display = "none";
      document.getElementById("graphchange").setAttribute("src", "../icon/" + graphSrc);
      graphName = graph;
      change_graph();
    });
  }

  function change_graph() {

    let pyshell = new PythonShell('graph/callData.py');
    var message_send = { graphName, companyName };
    // send name of the graph
    pyshell.send(JSON.stringify(message_send));

    //receieve data from python
    pyshell.on('message', function (message) {
      document.getElementById("hiddenGraphType").innerHTML = graphName;
      document.getElementById("hiddenData").innerHTML = message;
      console.log(message);
    });
    pyshell.end(function (err) {
      if (err) {
        console.log(err)
        throw err;
      };
      console.log('finished');
    });
  }

  btn = document.getElementById("intervalchange");
  btn2 = document.getElementById("graphchange");

  elementToCollapse = document.getElementById("dropIntervalType");
  elementToCollapse2 = document.getElementById("dropGraphType");

  toggleDropDown(btn, elementToCollapse);
  toggleDropDown(btn2, elementToCollapse2);


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
        var query = "SELECT Table_name as stock from information_schema.tables where (table_schema = 'company') and (table_name Like '%" + input_text + "%');"
        con.query(query, function (err, result) {
          if (err) throw err;
          var search_row = ""
          for (var i = 0; i < 15; i++) {
            try {
              search_row += "<tr><td id='company" + i.toString() + "'>" + result[i]['stock'] + "</td>"
                + "<td>full name</td>"
                + "<td>NSE</td>"
                + "<td class='show_graph'>graph</td>"
                + "<td class='add_company'>add</td></tr>"
            } catch { }
          }
          table_for_search.innerHTML = search_row;
          for (var j = 0; j < 15; j++) {
            if (document.getElementById("company" + j.toString()) != null) {
              let company_res = document.getElementById("company" + j.toString());
              console.log(company_res);
              console.log(j);

              company_res.addEventListener("click", function (e) {
                change_company(company_res.innerHTML);
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


  function change_company(company) {
    console.log(company);
    companyName = company;
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
});
