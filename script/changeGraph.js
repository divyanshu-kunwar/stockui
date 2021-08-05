const {PythonShell} = require('python-shell');
// const remote = require('electron').remote;

window.addEventListener('DOMContentLoaded', () => {

  var graph_object = document.getElementById("graph_object");
  setGraph("areaGraphBtn","area");
  // setGraph("candleGraphBtn","candle");
  setGraph("baselineGraphBtn","baseline");
  setGraph("heikinashiGraphBtn","heikinashi");
  setGraph("lineGraphBtn","line");
  setGraph("barGraphBtn","bars");
  setGraph("renkoGraphBtn","renko");
  setGraph("hollowcandleGraphBtn","hollowcandle");
  setGraph("pnfGraphBtn","pnf");
  setGraph("kagiGraphBtn","kagi");
  setGraph("linebreakGraphBtn","linebreak");
function setGraph(elementName,graphName){
    document.getElementById(elementName).addEventListener("click",function(e){
        console.log("clicked");

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