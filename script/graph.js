window.addEventListener('DOMContentLoaded', () => {
  
dragElement(document.getElementById("optionsMenu"));
dragElement(document.getElementById("indicatorDialog"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var collapseBtn = document.getElementById("collapseThreeFourth");
var collapseBtn2 = document.getElementById("dropDownGraphs");
var collapseBtn3 = document.getElementById("dropDownInterval");
var collapseBtn4 = document.getElementById("closeIndicator");
var collapseBtn5 = document.getElementById("toggleIndicator");
var collapseBtn6 = document.getElementById("starredBtn");
var collapseBtn7 = document.getElementById("changeLayoutBtn");
var element = document.getElementById("legendView");
var element2 = document.getElementById("dropGraphType");
var element3 = document.getElementById("dropIntervalType");
var element4 = document.getElementById("indicatorDialog");
var element6 = document.getElementById("StarredList");
var element7 = document.getElementById("dropLayoutType");
toggleDropDown(collapseBtn,element);
toggleDropDown(collapseBtn2,element2);
toggleDropDown(collapseBtn3,element3);
toggleDropDown(collapseBtn5,element4);
toggleDropDown(collapseBtn4,element4);
toggleDropDown(collapseBtn6,element6);
toggleDropDown(collapseBtn7,element7);
element6.style.display="block";
var graphBox = document.getElementById("graphContents");
collapseBtn6.addEventListener("click",function(e){
  if(element6.style.display=="block"){
      graphBox.setAttribute("class", "col-sm-9 col-md-9 col-lg-9 graphContent")
  }else{
      graphBox.setAttribute("class","col-sm-12 col-md-12 col-lg-12 graphContent");
  }
})

function toggleDropDown(btn , elementToCollapse){
    btn.addEventListener("click",function(e){
        if(elementToCollapse.style.display=="none"){
            elementToCollapse.style.display="block";
        }else{
            elementToCollapse.style.display="none";
        }
    })
}
});