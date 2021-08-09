// initialized variable
let canvas;
var paddingY = 100;
var paddingX = 100;
var data;
var dataloaded = false;
var date = [];
var open_ = [];
var close_ = [];
var low = [];
var high = [];
var color_ = [];
var height_ = [];
var min_low = 0;
var max_high = 0;
var translateX = 0;
var data_length = 0;
var selectedI = 0;
var parents = document.getElementById("graph_area");
var parentWidth = parents.getBoundingClientRect().width;
var parentHeight = parents.getBoundingClientRect().height;
function setup() {
    canvas = createCanvas(parentWidth, parentHeight-30);
}

function draw() {
  calcScales();
  background(255);
  stroke(0);
  drawGridY();
  translate(translateX,0);
  if(dataloaded){
  for(var i = 0; i<data_length; i++){
     d = new candle_cal(i,width,height);
     drawScaleX(i);
     fill (d.color);
     stroke (d.color);
     rect(d.x1,d.y1,d.widthX,d.heightY);
     line(d.x2,d.y2,d.x2,d.y3);
     rect(d.x1,d.y4,d.widthX,50);
     
     d.isInBound(mouseX-translateX);
  }
  translate(-translateX,0)
    drawScaleY()
    legend()
    strokeWeight(0.4);
    canvas.drawingContext.setLineDash([5, 5]);
    line(0,mouseY,width-paddingX,mouseY);
    line(mouseX,0,mouseX,height-50);
    canvas.drawingContext.setLineDash([0, 0]);
    strokeWeight(1);
}
}

function calcScales(){
    var dataMoved = Math.round(translateX / 30);
    min_low = getMinOfArray(low.slice(data_length-31-dataMoved,data_length-dataMoved));
    max_high = getMaxOfArray(high.slice(data_length-31-dataMoved,data_length-dataMoved));
}

function drawGridY(){
    var y1 = map(-min_low,-max_high,-min_low,height-paddingY,paddingY);
    var y2 = map(-max_high,-max_high,-min_low,height-paddingY,0);
    for(var i=0; i<9; i++){
        y = map(i,0,6,y2,y1);
        canvas.drawingContext.setLineDash([2, 2]);
        strokeWeight(0.1);
        line(0,y,width-102,y);
        canvas.drawingContext.setLineDash([0, 0]);
        strokeWeight(1);
    }
}

function drawScaleX(i){
    x = map(i,data_length-30,data_length,0,this.width-paddingX);
    x_next = map(i+3,data_length-30,data_length,0,this.width-paddingX);
    fill(0);
    stroke(0);
    if(i%3==0){
    line(x,height-50,x_next,height-50);
    line(x,height-40,x,height-50);
    strokeWeight(0.1);
    canvas.drawingContext.setLineDash([2, 2]);
    line(x,0,x,height-50);
    strokeWeight(1);
    canvas.drawingContext.setLineDash([0, 0]);
     strokeWeight(0);
    text(date[i],x-20,height-30);
    strokeWeight(1);
    }
    
}
function drawScaleY(){
    var y1 = map(-min_low,-max_high,-min_low,height-paddingY,paddingY/2);
    var y2 = map(-max_high,-max_high,-min_low,height-paddingY,paddingY/2);
    stroke(0);
    line(width-102,20,width-102,height-50);  
    stroke(255);
    fill(255);
    rect(width-100,0,100,height-20);
    stroke(0);
    fill(0);
    for(var i=0; i<9; i++){
        var difTick = (max_high-min_low)/7;
        y = map(i,0,7,y2,y1);
        line(width-90,y,width-102,y);
        strokeWeight(0);
        text((min_low+difTick*i).toFixed(2),width-90,y+4);
        strokeWeight(1);
    }
    strokeWeight(0);
}
function legend(){
    fill(255);
    rect(8,10,380,30);
    console.log(color_[selectedI]);
    fill(color_[selectedI]);
    text("O :",10,30);
    text(open_[selectedI],30,30);
    text("L :",110,30);
    text(low[selectedI],130,30);
    text("H :",210,30);
    text(high[selectedI],230,30);
    text("C :",310,30);
    text(close_[selectedI],330,30);
    strokeWeight(1);
}

function mouseDragged(){
    var scrollWidth = (data_length-29)*((width-paddingX)/30);
    if(translateX + (mouseX - pmouseX)>0 && translateX + (mouseX - pmouseX)<scrollWidth-50) {
        translateX += (mouseX - pmouseX);
    }
}
setInterval(function(){
    if(document.getElementById("hidden").innerHTML!="" && dataloaded==false){
        data = JSON.parse(document.getElementById("hidden").innerHTML);
        data_length = Object.keys(data["date"]).length;
        console.log(data_length);
        for( var i = 0; i<data_length ; i++){
            date[i] = (data['date'][i]);
            open_[i] = (data['open'][i]);
            close_[i] = (data['close'][i]);
            low[i] = (data['low'][i]);
            high[i] = (data['high'][i]);
            color_[i] = (data['color'][i]);
        }
        min_low = getMinOfArray(low.slice(data_length-31,data_length));
        max_high = getMaxOfArray(high.slice(data_length-31,data_length));
        console.log(min_low,max_high);
        console.log(data);
        dataloaded = true;
    }
},100);
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}
class candle_cal{
    constructor(i,width,height){
        this.i = i
        this.width = width;
        this.height = height;
        this.widthX = 0;
        this.heightX = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.y3 = 0;
        this.color = 0;
        this.calc();
    }
    calc(){
        let i = this.i;
        this.x1 = map(i-0.25 , data_length-30,data_length,0,width-paddingX)
        this.y1 = map(-close_[i],-min_low,-max_high,height-paddingY,paddingY/2)
        this.x2 = map(i,data_length-30,data_length,0,this.width-paddingX);
        this.y2 = map(-high[i],-min_low,-max_high,height-paddingY,paddingY/2);
        this.y3 = map(-low[i],-min_low,-max_high,height-paddingY,paddingY/2)
        this.widthX = map(0.5 ,0,30,0,this.width-paddingX);
        this.heightY = map(-open_[i],-min_low,-max_high,height-paddingY,paddingY/2)-this.y1;
        this.color = color_[i]
    }
    isInBound(mouseX){
        if(mouseX>this.x1 && mouseX< this.x1+this.widthX ){
            selectedI = this.i;
        }
    }
}