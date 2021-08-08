const {PythonShell} = require('python-shell');
const electron = require('electron');
const remote =  electron.remote;

window.addEventListener('DOMContentLoaded', () => {

  // setGraph("areaBtn","area");
  setGraph("candleBtn","candle");
  /*setGraph("baselineBtn","baseline");
  setGraph("heikinashiBtn","heikinashi");
  setGraph("lineBtn","line");
  setGraph("barsBtn","bars");
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
        // pyshell.send(JSON.stringify(graphName));
        pyshell.on('message', function(message) {
            document.getElementById("hidden").innerHTML = message;
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
