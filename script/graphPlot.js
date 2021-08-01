window.addEventListener('DOMContentLoaded', () => {
    setTimeout(function(){
        var graphObj = document.getElementById("graph_object").contentDocument;
        var mainGraphArea = graphObj.getElementById("patch_2");
        var crosslineX = graphObj.getElementById("crosslineX").getElementsByTagName("path")[0];
        var crosslineY = graphObj.getElementById("crosslineY").getElementsByTagName("path")[0];
        var calculatedX;
        var calculatedY;
        var svgWidth , svgHeight , box;
        var boxWidth, boxHeight;
        box = document.getElementById("graph_object");
    mainGraphArea.addEventListener("mousemove",function(e){
        crosslineX.style.display="block";
        crosslineY.style.display="block";
        svgWidth = parseInt(graphObj.getElementsByTagName("svg")[0].getAttribute("width"),10);
        svgHeight = parseInt(graphObj.getElementsByTagName("svg")[0].getAttribute("height"),10);
        boxWidth = box.getBoundingClientRect().width;
        boxHeight = box.getBoundingClientRect().height;
        calculatedX = ((e.offsetX)/boxWidth*svgWidth);
        calculatedY = ((e.offsetY)/boxHeight*svgHeight);

        console.log("x:"+calculatedX+"y:"+calculatedY);
        crosslineX.setAttribute("d","M 100 "+calculatedY+"  L 1200 "+calculatedY);
        crosslineY.setAttribute("d","M "+calculatedX+" 550  L "+calculatedX+" 50");
    });
    },3000);
    


});