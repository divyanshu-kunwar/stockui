const {PythonShell} = require('python-shell');
// const remote = require('electron').remote;

window.addEventListener('DOMContentLoaded', () => {

  var graph_object = document.getElementById("graph");
  var graphArea = document.getElementById("graph_area");
  setGraph("areaBtn","area");
  setGraph("candleBtn","candle");
  setGraph("baselineBtn","baseline");
  setGraph("heikinashiBtn","heikinashi");
  setGraph("lineBtn","line");
  setGraph("barsBtn","bars");
  setGraph("renkoBtn","renko");
  setGraph("hollowcandleBtn","hollowcandle");
  setGraph("pnfBtn","pnf");
  setGraph("kagiBtn","kagi");
  setGraph("linebreakBtn","linebreak");
function setGraph(elementName,graphName){
    var graphSrc = graphName + "_.svg";
    document.getElementById(elementName).addEventListener("click",function(e){
        document.getElementById("dropGraphType").style.display="none";
        document.getElementById("graphchange").setAttribute("src","../icon/"+ graphSrc);
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
          setTimeout(() => {
            
              graphArea.scrollTo(graph_object.scrollWidth, 0);
          },100);
        });
    });
}
setTimeout(() => {
    graphArea.scrollTo(graph_object.scrollWidth, 0);
},100);

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




})