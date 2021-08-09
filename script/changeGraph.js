const {PythonShell} = require('python-shell');
const electron = require('electron');
const remote =  electron.remote;
const mysql = require('mysql');

window.addEventListener('DOMContentLoaded', () => {

  
  setGraph("barsBtn","bars");
  setGraph("candleBtn","candle");
  // setGraph("areaBtn","area");
  /*setGraph("baselineBtn","baseline");
  setGraph("heikinashiBtn","heikinashi");
  setGraph("lineBtn","line");
  
  setGraph("renkoBtn","renko");
  setGraph("hollowcandleBtn","hollowcandle");
  setGraph("pnfBtn","pnf");
  setGraph("kagiBtn","kagi");
  setGraph("linebreakBtn","linebreak"); */
function setGraph(elementName,graphName){
    var graphSrc = graphName + "_.svg";
    document.getElementById(elementName).addEventListener("click",function(e){
        document.getElementById("dropGraphType").style.display="none";
        document.getElementById("graphchange").setAttribute("src","../icon/"+ graphSrc);
        let pyshell = new PythonShell('graph/callData.py');

        // send name of the graph
        pyshell.send(JSON.stringify(graphName));

        //receieve data from python
        pyshell.on('message', function(message) {
            document.getElementById("hiddenGraphType").innerHTML = graphName;
            document.getElementById("hiddenData").innerHTML = message;
          });
        pyshell.end(function (err) {
          if (err){
            console.log(err)
            throw err;
          };
          console.log('finished');
    });
});
}

btn = document.getElementById("intervalchange");
btn2 = document.getElementById("graphchange");

elementToCollapse = document.getElementById("dropIntervalType");
elementToCollapse2 = document.getElementById("dropGraphType");

toggleDropDown(btn,elementToCollapse);
toggleDropDown(btn2,elementToCollapse2);


// toogle drop down menu by passing btn id and drop down id
function toggleDropDown(btn , elementToCollapse){
  btn.addEventListener("click",function(e){

    // change display property on basis of previous property
      if(elementToCollapse.style.display=="none"){
          elementToCollapse.style.display="block";
      }else{
          elementToCollapse.style.display="none";
      }
  })
}

// make search list visible on input focus (searching)
var search_list = document.getElementById("search_list");
var company_list = document.getElementById("company_list");
var search_box = document.getElementById("search_input");

search_box.addEventListener("focus",function(e){
    var input_text = "";
    search_list.style.display="block";
    company_list.style.display="none";
    setInterval(function(e){
  if(search_box.value != input_text){
    input_text = search_box.value;
    var query = "SELECT Table_name as stock from information_schema.tables where (table_schema = 'company') and (TABLE_TYPE LIKE 'VIEW') and (table_name Like '%"+input_text+"%');"
    con.query(query, function (err, result) {
      if (err) throw err;
      var names =""
        for(var i=0; i<5 ; i++){
          try{
            names += result[i]['stock']
          }catch{}
        }
        console.log(names);
    });
  }
    },100);
},true);

search_box.addEventListener("blur",function(e){
    search_list.style.display="none";
    company_list.style.display="block";
},true);

// connect to my sql database for company data
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vishal"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

minimize_btn = document.getElementById('minimize_btn');
maximize_btn = document.getElementById('maximize_btn');
close_btn = document.getElementById('close_btn');



minimize_btn.addEventListener('click',function(e){
  var window = remote.getCurrentWindow();
  window.minimize(); 
});
maximize_btn.addEventListener('click',function(e){
  var window = remote.getCurrentWindow();
  if (!window.isMaximized()) {
      window.maximize();
      maximize_btn.setAttribute("src","../icon/restore.svg");     
  } else {
      window.unmaximize();
      maximize_btn.setAttribute("src","../icon/maximize.svg");
  }
});
close_btn.addEventListener('click',function(e){
  var window = remote.getCurrentWindow();
  window.close();
});
});
