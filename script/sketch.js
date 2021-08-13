// initialized variable
var canvas, paddingY = 100, paddingX = 100;
var data, data_ = "", dataloaded = false, graph_type = "candle";
var date = [], open_ = [], close_ = [], low = [], height_ = [];
var high = [], color_ = [], stroke_ = [] , volume = [], pnf_count = [];
var min_low = 0, max_high = 0, min_vol = 0, max_vol = 0; translateX = 0, scaleValue = 1;
var data_length = 0, selectedI = 0, dataMoved = 0, data_on_graph = 60;
var yb, xb , drawCount = 0;

//get width and height of parents
var parents = document.getElementById("graph_area");
var parentWidth = parents.getBoundingClientRect().width;
var parentHeight = parents.getBoundingClientRect().height;
function setup() {
    canvas = createCanvas(parentWidth, parentHeight - 30);
    yb = height / 2;
}

// all drawing goes inside i.e the main graph plotting function
function draw() {
    
    //when data is loaded start drawing graph
    if (dataloaded) {
        //calculate scale value i.e minimum and maximum value and moved value of data
        calcScales();
        background(255);

        stroke(0);
        //only horizontal grid 
        drawGridY();
        strokeWeight(0);
        fill("#fffff");
        //background rectangle
        rect(8, 10, 380, 90);
        strokeWeight(1);

        //update the type of graph
        push()
        switch (graph_type) {
            case "bars":
                draw_candle_heikinashi();
                break;
            case "candle":
                draw_candle_heikinashi();
                break;
            case 'hollowcandle':
                draw_candle_heikinashi();
                break;
            case 'heikinashi':
                draw_candle_heikinashi();
                break;
            case 'line':
                draw_line_area();
                break;
            case 'area':
                draw_line_area();
                break;
            case 'baseline':
                drawbaseline();
                break;
            case 'renko':
                drawrenko();
                break;
            case 'linebreak':
                drawrenko();
                break;
            case 'kagi':
                drawkagi();
                break;
            case 'pnf':
                drawpnf();
                break;
            default:
                drawcandle();
                break;
        }
        pop()

        stroke(0);
        //horizontal x line
        line(0, height - 50, width, height - 50);

        //draw vertical value and ticks on x-axis
        drawScaleY()

        //show the value of selected candle
        legend()

        //ticks for selected position on graph as date on x-axis and price on y
        fill(0);
        //price tick
        rect(width - 102, mouseY - 10, 60, 20);
        //date tick
        rect(mouseX - 35, height - 40, 80, 20);
        fill(255);
        //calculate value of current position
        var ycurrent = map(mouseY, height - paddingY, paddingY / 2, min_low, max_high).toFixed(2);
        //price
        text(ycurrent, width - 100, mouseY + 5)
        //date
        text(date[selectedI], mouseX - 25, height - 25)
        // dotted cross line according to mouse coordinates
        strokeWeight(0.4);
        canvas.drawingContext.setLineDash([5, 5]);
        line(0, mouseY, width - paddingX, mouseY);
        line(mouseX, 0, mouseX, height - 50);
        canvas.drawingContext.setLineDash([0, 0]);
        strokeWeight(1);
    }
}

// function for candle graph
function draw_candle_heikinashi() {
    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new candle_cal(i, width, height);
        volumePlot(i,d.x1,d.volY,d.widthX);
        //set color of candles and position of rect and line on basis of calculation
        fill(d.color);
        if (graph_type == 'hollowcandle') stroke(d.stroke);
        else stroke(d.color);
        if (graph_type == 'bars') {
            strokeWeight(2);
            line(d.x2, d.y1, d.x2 + d.widthX / 2, d.y1);
            line(d.x2, d.y1 + d.heightY, d.x2 - d.widthX / 2, d.y1 + d.heightY);
            line(d.x2, d.y2, d.x2, d.y3);
        } else {
            line(d.x2, d.y2, d.x2, d.y3);
            rect(d.x1, d.y1, d.widthX, d.heightY);
        }
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}

//function for line and area
function draw_line_area() {

    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new line_area_cal(i, width, height);
        volumePlot(i,d.x1,d.volY,d.x1-d.x2-3);
        //set color of candles and position of rect and line on basis of calculation
        stroke("#0044ff66");
        strokeWeight(1);
        // line 
        line(d.x1, d.y1, d.x2, d.y2);
        //area 
        strokeWeight(0);
        if (graph_type == 'area') {             //draw shape when graph type is area
            fill("#0066ff10")
            beginShape();
            vertex(d.x1, d.y1);
            vertex(d.x2, d.y2);
            vertex(d.x2, height - 50);
            vertex(d.x1, height - 50);
            endShape();
        }
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }

}

function drawbaseline() {
    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new line_area_cal(i, width, height);

        volumePlot(i,d.x1,d.volY,d.x1-d.x2-3);
        //set color of candles and position of rect and line on basis of calculation

        if (d.y1 < yb && d.y2 < yb) {
            stroke("#00ff00");
            strokeWeight(1);
            // line 
            line(d.x1, d.y1, d.x2, d.y2);
            //area 
            strokeWeight(0);
            fill("#00ff0010")
            beginShape();
            vertex(d.x1, d.y1);
            vertex(d.x2, d.y2);
            vertex(d.x2, yb);
            vertex(d.x1, yb);
            endShape();
        } else if (d.y1 > yb && d.y2 > yb) {
            stroke("#ff0000");
            strokeWeight(1);
            // line 
            line(d.x1, d.y1, d.x2, d.y2);
            //area 
            strokeWeight(0);
            fill("#ff000010");
            beginShape();
            vertex(d.x1, d.y1);
            vertex(d.x2, d.y2);
            vertex(d.x2, yb);
            vertex(d.x1, yb);
            endShape();
        } else if (d.y1 > yb && d.y2 < yb) {
            xb = ((yb - d.y1) * (d.x2 - d.x1) / (d.y2 - d.y1)) + d.x1;
            stroke("#00ff00");
            strokeWeight(1);
            // line 
            line(d.x2, d.y2, xb, yb);
            //area 
            strokeWeight(0);
            fill("#00ff0010");
            triangle(d.x2, d.y2, d.x2, yb, xb, yb);
            stroke("#ff0000");
            strokeWeight(1);
            // line 
            line(d.x1, d.y1, xb, yb);
            //area 
            strokeWeight(0);
            fill("#ff000010");
            triangle(d.x1, d.y1, d.x1, yb, xb, yb)
        } else {
            xb = ((yb - d.y1) * (d.x2 - d.x1) / (d.y2 - d.y1)) + d.x1;
            stroke("#00ff00");
            strokeWeight(1);
            // line 
            line(d.x1, d.y1, xb, yb);
            //area 
            strokeWeight(0);
            fill("#00ff0010");
            triangle(d.x1, d.y1, d.x1, yb, xb, yb)
            stroke("#ff0000");
            strokeWeight(1);
            // line 
            line(d.x2, d.y2, xb, yb);
            //area 
            strokeWeight(0);
            fill("#ff000010");
            triangle(d.x2, d.y2, d.x2, yb, xb, yb);
        }
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
    translate(-translateX, 0);
    stroke(0);
    if (mouseY > yb - 20 && mouseY < yb + 20) {
        canvas.canvas.style.cursor = "ns-resize";
    } else {
        cursor(CROSS);
    }
    // baseline 
    strokeWeight(0.4);
    canvas.drawingContext.setLineDash([2, 2]);
    line(0, yb, width, yb);
    canvas.drawingContext.setLineDash([0, 0]);
    strokeWeight(1);

}

function drawrenko() {
    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new renko(i, width, height);
        volumePlot(i,d.x1,d.volY,d.widthX-3);
        //set color of candles and position of rect and line on basis of calculation
        fill(d.color);
        stroke(d.color);
        rect(d.x1, d.y1, d.widthX, d.heightY);
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}

function drawkagi() {
    drawCount ++ ;
    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new kagi_cal(i, width, height);
        volumePlot(i,d.x1,d.volY,d.x1-d.x2-3);

        strokeWeight(1);

        if ((height_[i]>height_[i-1]) && (close_[i] >open_[i-1])){
            stroke(color_[i-1]);
            line(d.x1, d.y1, d.x1, d.y2);
            stroke(color_[i]);
            line(d.x1, d.y2, d.x1, d.y3);
        }
        else if((height_[i]>height_[i-1]) && (close_[i] <open_[i-1])){
            stroke(color_[i-1]);
            line(d.x1, d.y4, d.x1, d.y3);
            stroke(color_[i]);
            line(d.x1, d.y1, d.x1, d.y4);
        }else{
            stroke(color_[i-1]);
            line(d.x1, d.y1, d.x1, d.y3);
            color_[i] = color_[i-1];
        }
        stroke(color_[i-1]);
        line(d.x2, d.y5, d.x1, d.y6);        //horizontal
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}

function drawpnf() {
    // move  data to left or right 
    translate(translateX, 0);
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new renko(i, width, height);
        volumePlot(i,d.x1,d.volY,d.widthX-3);
        //set color of candles and position of rect and line on basis of calculation
        fill("#fff");
        stroke(d.color);
        strokeWeight(1);
        // rect(d.x1, d.y1, d.widthX, d.heightY);
        for(var j = 0; j<pnf_count[i]; j++){
            var pnf_height = d.heightY/pnf_count[i];
            if(d.color=='#00ca73'){
                console.log(j);
                line(d.x1+8,d.y1+(j*pnf_height),d.x1+d.widthX,d.y1+((j+1)*pnf_height));
                line(d.x1+8,d.y1+((j+1)*pnf_height),d.x1+d.widthX,d.y1+(j*pnf_height));
            }else {
                console.log(j);
                ellipse(d.x1+8,d.y1+((j+0.5)*pnf_height),d.widthX-8,-pnf_height);
            }
        }
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}

//change min and maximum value of scales
function calcScales() {
    //get no of graph elements moved
    dataMoved = Math.round((translateX * data_on_graph) / 900);
    // get low price and high price value for scale
    min_low = getMinOfArray(low.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
    max_high = getMaxOfArray(high.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
    min_vol = getMinOfArray(volume.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
    max_vol = getMaxOfArray(volume.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
}

// draw y grids 
function drawGridY() {

    //mapping of value between min price and max price to canvas height
    //coordinate of min price tick and max price tick
    var y1 = map(-min_low, -max_high, -min_low, height - paddingY, paddingY / 2);
    var y2 = map(-max_high, -max_high, -min_low, height - paddingY, paddingY / 2);

    //draw 7 grids
    for (var i = 0; i < 8; i++) {
        y = map(i, 0, 7, y2, y1);
        canvas.drawingContext.setLineDash([2, 2]);
        strokeWeight(0.2);
        line(0, y, width - 102, y);
        canvas.drawingContext.setLineDash([0, 0]);
        strokeWeight(1);
    }
}

// draw ticks and grid for every i candle
function drawScaleX(i) {
    //calculate position for all x ticks on basis of position
    // of first 30 candles 
    x = map(i, data_length - data_on_graph, data_length, 0, width - paddingX);
    fill(0);
    stroke(0);
    if (i % Math.round(data_on_graph / 10) == 0) {
        //small dark tick lines on x axis 
        line(x, height - 40, x, height - 50);

        //date on x-axis
        strokeWeight(0);
        text(date[i], x - 20, height - 30);

        // dashed vertical grid line
        strokeWeight(0.2);
        canvas.drawingContext.setLineDash([2, 2]);
        line(x, 0, x, height - 50);
        strokeWeight(1);
        canvas.drawingContext.setLineDash([0, 0]);

        strokeWeight(1);
    }

}

// draw y small ticks and 8 price values
function drawScaleY() {
    //calculate scaling value in accordance with max and min price
    var y1 = map(-min_low, -max_high, -min_low, height - paddingY, paddingY / 2);
    var y2 = map(-max_high, -max_high, -min_low, height - paddingY, paddingY / 2);
    stroke(0);
    //vertical fixed line (y-axis)
    line(width - 102, 0, width - 102, height - 50);
    stroke(255);
    fill(255);
    // vertical fixed rectangle right to y-axis
    rect(width - 100, 0, 100, height - 20);
    stroke(0);
    fill(0);
    for (var i = 0; i < 9; i++) {
        var difTick = (max_high - min_low) / 7;
        y = map(i, 0, 7, y2, y1);
        // tick marks line horizontal small
        line(width - 90, y, width - 102, y);
        strokeWeight(0);
        // price value on tick mark
        text((min_low + difTick * i).toFixed(2), width - 90, y + 4);
        strokeWeight(1);
    }
    strokeWeight(0);
}

// display the ohcl data on basis of selecteI (selected candle)
function legend() {
    
    textSize(14);
    
    if (graph_type == 'hollowcandle') fill(stroke_[selectedI]);
    else fill(color_[selectedI]);
    text("O :", 10, 30);
    text(open_[selectedI].toFixed(2), 30, 30);
    text("L :", 110, 30);
    text(low[selectedI].toFixed(2), 130, 30);
    text("H :", 210, 30);
    text(high[selectedI].toFixed(2), 230, 30);
    text("C :", 310, 30);
    text(close_[selectedI].toFixed(2), 330, 30);
    text((close_[selectedI] - close_[selectedI - 1]).toFixed(2), 30, 55);
    text("(" + ((close_[selectedI] - close_[selectedI - 1]) * 100 / close_[selectedI - 1]).toFixed(2) + "%)", 75, 55);
    text("Volume :",10,80);
    text(volume[selectedI],70,80);
    strokeWeight(1);
    textSize(12);
}

// translate on basis of click and drag
function mouseDragged() {
    // do not drag to right when reached last data
    if (translateX + (mouseX - pmouseX) > 0) {
        translateX += (mouseX - pmouseX);
    }
    move_baseline(mouseY, pmouseY);
}

function move_baseline(mouseY, pmouseY) {
    if (mouseY > yb - 20 && mouseY < yb + 20) {
        yb = pmouseY;
    }
}


// zoom in and out and translate on basis of mouse wheel or trackpad scroll x and y
window.addEventListener("wheel", function (e) {
    //increase scale value every time wheel is rotated or trackpad scroll in y
    scaleValue += Math.sign(e.deltaY) * 0.3;
    // increase number of data plotted on graph 
    if (scaleValue > 1) {
        if (data_on_graph < 200) {
            data_on_graph++;
        }
        scaleValue = 0;
    }
    // decreases number of data plotted on graph 
    else if (scaleValue < -1) {
        if (data_on_graph > 10) {
            data_on_graph--;
        }
        scaleValue = 0;
    }

    //increase scale value every time trackpad scroll in x
    translateValue = -Math.sign(e.deltaX) * 5;
    // translatex should never ever be less than 0
    if (translateX + translateValue > 0) {
        translateX += translateValue;
    }
});

// a class for calculating values and behaviour[candle hollow candle and heikin ashi]
class candle_cal {
    constructor(i, width, height) {
        this.i = i;                     // index of data
        this.width = width;             //width of canvas
        this.height = height;           //height of canvas
        this.widthX = 0;                //width of candle
        this.heightX = 0;               //height of candle
        this.x1 = 0;                    //rect x1
        this.y1 = 0;                    //rect y1   
        this.x2 = 0;                    //line x axis value
        this.y2 = 0;                    //line y axis value 1
        this.y3 = 0;                    //line y axis value 2
        this.color = 0;                 //color of candle 
        this.volY = 0;                      //plotting volume
        this.calc();                    //perform calculation
        this.stroke;                // if hollow then will also have stroke colors
    }
    calc() {
        let i = this.i;
        //x1 value for visible candles on basis of i mapped b/w 0 width-paddingX
        this.x1 = map(i - 0.25, data_length - data_on_graph, data_length, 0, width - paddingX)
        //y1 value for visible candles on basis of close price mapped to height
        this.y1 = map(-close_[i], -min_low, -max_high, height - paddingY, paddingY / 2)
        // width of candle is half the regular width
        this.widthX = map(0.5, 0, data_on_graph, 0, this.width - paddingX);
        //height of candle calculated using open and close price
        this.heightY = map(-open_[i], -min_low, -max_high, height - paddingY, paddingY / 2) - this.y1;
        //position of visible line on x-axis 
        this.x2 = map(i, data_length - data_on_graph, data_length, 0, this.width - paddingX);
        //position of visible line on y-axis (y2 and y3)
        this.y2 = map(-high[i], -min_low, -max_high, height - paddingY, paddingY / 2);
        this.y3 = map(-low[i], -min_low, -max_high, height - paddingY, paddingY / 2)

        this.volY = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);

        this.color = color_[i];              //color of candle
        if (graph_type == 'hollowcandle') this.stroke = stroke_[i];
    }
    //check if mouseX is on the candle area anywhere between candle width
    isInBound(mouseX) {
        //mousex is in rectangle bound (X)
        if (mouseX > this.x1 && mouseX < this.x1 + this.widthX) {
            selectedI = this.i;
        }
    }
}
// a class for calculating values and behaviour[line , area and baseline]
class line_area_cal {
    constructor(i, width, height) {
        this.i = i;                     // index of data
        this.width = width;             //width of canvas
        this.height = height;           //height of canvas
        this.widthX = 0;                //width of line
        this.x1 = 0;                    //from position
        this.x2 = 0;                    //to position
        this.y1 = 0;                    //vertical line close 1
        this.y2 = 0;                    //vertical line close 1
        this.color = 0;                 //color 
        this.volY = 0;                  //volume
        this.calc();                    //perform calculation
    }
    calc() {
        let i = this.i;
        //x1 value for visible candles on basis of i mapped b/w 0 width-paddingX
        this.x1 = map(i, data_length - data_on_graph, data_length, 0, width - paddingX)
        this.x2 = map(i - 1, data_length - data_on_graph, data_length, 0, width - paddingX)
        //y1 value for visible candles on basis of close price mapped to height
        this.y1 = map(-close_[i], -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y2 = map(-close_[i - 1], -min_low, -max_high, height - paddingY, paddingY / 2)
        // width of candle is half the regular width
        this.widthX = map(0.5, 0, data_on_graph, 0, this.width - paddingX);
        this.color = color_[i]              //color of bar
        this.volY = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);
    }
    //check if mouseX is on the bar area anywhere between bar width
    isInBound(mouseX) {
        //mousex is in  bound (X)
        if (mouseX > this.x1 - this.widthX && mouseX < this.x1 + this.widthX) {
            selectedI = this.i;
        }
    }
}

class renko {
    constructor(i, width, height) {
        this.i = i;                     // index of data
        this.width = width;             //width of canvas
        this.height = height;           //height of canvas
        this.widthX = 0;                //width of candle
        this.heightX = 0;               //height of candle
        this.x1 = 0;                    //rect x1
        this.y1 = 0;                    //rect y1   
        this.color = 0;                 //color of candle 
        this.volY = 0;                  //volume
        this.calc();                    //perform calculation
    }
    calc() {
        let i = this.i;
        //x1 value for visible candles on basis of i mapped b/w 0 width-paddingX
        this.x1 = map(i - 0.5, data_length - data_on_graph, data_length, 0, width - paddingX)
        //y1 value for visible candles on basis of close price mapped to height
        this.y1 = map(-close_[i], -min_low, -max_high, height - paddingY, paddingY / 2)
        // width of candle is half the regular width
        this.widthX = map(1, 0, data_on_graph, 0, this.width - paddingX);
        //height of candle calculated using open and close price
        this.heightY = map(-open_[i], -min_low, -max_high, height - paddingY, paddingY / 2) - this.y1;
        this.color = color_[i]              //color of candle

        this.volY = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);
    }
    //check if mouseX is on the candle area anywhere between candle width
    isInBound(mouseX) {
        //mousex is in rectangle bound (X)
        if (mouseX > this.x1 && mouseX < this.x1 + this.widthX) {
            selectedI = this.i;
        }
    }
}

class kagi_cal {
    constructor(i, width, height) {
        this.i = i;                     // index of data
        this.width = width;             //width of canvas
        this.height = height;           //height of canvas
        this.widthX = 0;                //width of candle
        this.x1 = 0;                    //position 
        this.x2 = 0;                    //prev position
        this.y1 = 0;                    // lower  
        this.y2 = 0;                    // lower + prev height 
        this.y3 = 0;                    // lower + height
        this.y4 = 0;                    // lower  + height - prev height
        this.y5 = 0;                    // prev close
        this.y6 = 0;                    // open  
        this.color = 0;                 //color of candle 
        this.volY = 0;                  //volume
        if(i!=0)  this.calc();          //perform calculation
    }
    calc() {
        let i = this.i;
        //x1 value for visible candles on basis of i mapped b/w 0 width-paddingX
        this.x1 = map(i, data_length - data_on_graph, data_length, 0, width - paddingX)
        this.x2 = map(i-1, data_length - data_on_graph, data_length, 0, width - paddingX)

        //y1 value for visible candles on basis of close price mapped to height
        this.y1 = map(-min(open_[i],close_[i]), -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y2 = map(-(min(open_[i],close_[i])+height_[i-1]), -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y3 = map(-(min(open_[i],close_[i])+height_[i]), -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y4 = map(-(min(open_[i],close_[i])+height_[i]-height_[i-1]), -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y5 = map(-close_[i-1], -min_low, -max_high, height - paddingY, paddingY / 2)
        this.y6 = map(-open_[i], -min_low, -max_high, height - paddingY, paddingY / 2)
        // width of candle is half the regular width
        this.widthX = map(1, 0, data_on_graph, 0, this.width - paddingX);
        this.volY = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);

        this.color = color_[i];              //color of candle
    }
    //check if mouseX is on the candle area anywhere between candle width
    isInBound(mouseX) {
        //mousex is in rectangle bound (X)
        if (mouseX > this.x1-this.widthX/2 && mouseX < this.x1 + this.widthX/2) {
            selectedI = this.i;
        }
    }
}

// calculate maximum value and minimum value in a given array
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

//getting data from the hidden div element and adding it back to arrays
setInterval(function () {
    if (document.getElementById("hiddenData").innerHTML != data_ || document.getElementById("hiddenGraphType").innerHTML != graph_type) {
        dataloaded = false; data_on_graph = 60;
        translateX = 0; scaleValue = 1;
        selectedI = 0; dataMoved = 0;
    }
    // whenever there is value in hidden element and data is not loaded then load the data
    if (document.getElementById("hiddenData").innerHTML != "" && dataloaded == false) {
        data = []; date = []; open_ = []; close_ = [];
        low = []; high = []; color_ = []; stroke_ = [];
        height_ = []; volume = [] , pnf_count = [];
        // get data and change to json object
        data_ = document.getElementById("hiddenData").innerHTML;
        data = JSON.parse(document.getElementById("hiddenData").innerHTML);
        //get the type of graph
        graph_type = document.getElementById("hiddenGraphType").innerHTML;
        //calculate length of data by date length
        data_length = Object.keys(data["date"]).length;

        // add all data to corresponding arrays
        for (var i = 0; i < data_length; i++) {
            date[i] = (data['date'][i]);
            open_[i] = (data['open'][i]);
            close_[i] = (data['close'][i]);
            low[i] = (data['low'][i]);
            high[i] = (data['high'][i]);
            color_[i] = (data['color'][i]);
            volume[i] = (data['volume'][i]);
            if (graph_type == "hollowcandle") stroke_[i] = (data['stroke'][i]);
            if(graph_type == 'kagi')height_[i] = data['height'][i];
            if(graph_type=="pnf") pnf_count[i] = data['pnf_count'][i];
        }
        //calculate min and max of first 30 data
        min_low = getMinOfArray(low.slice(data_length - 31, data_length));
        max_high = getMaxOfArray(high.slice(data_length - 31, data_length));
        min_vol = getMinOfArray(volume.slice(data_length - 31, data_length));
        max_vol = getMaxOfArray(volume.slice(data_length - 31, data_length));
        dataloaded = true;
    }
}, 100);

// indicators i.e volume 
function volumePlot(i,x,y,widthX){
    fill(color_[i]+"44");
    if(graph_type=="hollowcandle")fill(stroke_[i]+"44");
    stroke(color_[i]+"44")
    rect(x,y,widthX,height-y-paddingY/2);
}