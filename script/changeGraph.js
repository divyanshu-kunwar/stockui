const {PythonShell} = require('python-shell');
// const remote = require('electron').remote;

window.addEventListener('DOMContentLoaded', () => {

  var graph_object = document.getElementById("graph_object");
  setGraph("areaBtn","area");
  setGraph("candleBtn","candle");
  setGraph("baselineBtn","baseline");
  setGraph("heikinashiBtn","heikinashi");
  setGraph("lineBtn","line");
  setGraph("barBtn","bars");
  setGraph("renkoBtn","renko");
  setGraph("hollowcandleBtn","hollowcandle");
  setGraph("pnfBtn","pnf");
  setGraph("kagiBtn","kagi");
  setGraph("linebreakBtn","linebreak");
function setGraph(elementName,graphName){
    var graphSrc = graphName + "_.svg";
    document.getElementById(elementName).addEventListener("click",function(e){
        document.getElementById("dropGraphType").style.display="none";
        document.getElementById("selectedGraphBtn").setAttribute("src","../media/icons/"+ graphSrc);
        let pyshell = new PythonShell('graph/demoplot.py');
        pyshell.send(JSON.stringify(graphName));
        pyshell.on('message', function(message) {
            console.log(message);
          });
        pyshell.end(function (err) {
          if (err){
            throw err;
          };
          console.log('finished');
          graph_object.setAttribute("data","../graph/demo.svg")
        });
    });
}





})