const {PythonShell} = require('python-shell');

window.addEventListener('DOMContentLoaded', () => {
  var graph_object = document.getElementById("graph_object");
  setGraph("areaGraphBtn","area");
  setGraph("area2GraphBtn","area");
  setGraph("candleGraphBtn","candle");
  setGraph("candle2GraphBtn","candle");
  setGraph("baselineGraphBtn","baseline");
  setGraph("baseline2GraphBtn","baseline");
  setGraph("heikinashiGraphBtn","heikinashi");
  setGraph("lineGraphBtn","line");
  setGraph("barGraphBtn","bars");
  setGraph("renkoGraphBtn","renko");
  setGraph("hollowcandleGraphBtn","hollowcandle");
  setGraph("pnfGraphBtn","pnf");
  setGraph("kagiGraphBtn","kagi");
  setGraph("linebreakGraphBtn","linebreakcandle");
function setGraph(elementName,graphName){
    document.getElementById(elementName).addEventListener("click",function(e){
        console.log("clicked");
        let pyshell = new PythonShell('C:/Users/91766/Desktop/Stock Analysis/graph/Final Graph Files/demoplot.py');
        pyshell.send(JSON.stringify(graphName));
        pyshell.on('message', function(message) {
            console.log(message);
          });
        pyshell.end(function (err) {
          if (err){
            throw err;
          };
          console.log('finished');
          graph_object.setAttribute("data","C:/Users/91766/Desktop/Stock Analysis/graph/Final Graph Files/demo.svg")
        });
    });
}
})