// initialized variable
var canvas;
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
var dataMoved = 0;
var scaleValue = 1;
var data_on_graph = 30;

//get width and height of parents
var parents = document.getElementById("graph_area");
var parentWidth = parents.getBoundingClientRect().width;
var parentHeight = parents.getBoundingClientRect().height;
function setup() {
    canvas = createCanvas(parentWidth, parentHeight - 30);
}

// all drawing goes inside i.e the main graph plotting function
function draw() {

    //calculate scale value i.e minimum and maximum value and moved value of data
    calcScales();
    background(255);

    stroke(0);
    //only horizontal grid 
    drawGridY();

    //when data is loaded start drawing graph
    if (dataloaded) {
        push()
        // move  data to left or right 
        translate(translateX, 0);
        // calculate number of candles to show on screen
        for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
            // draw grid and scale on x axis
            drawScaleX(i);
            // create a candle object and pass i , width and height for calculation
            d = new candle_cal(i, width, height);
            //set color of candles and position of rect and line on basis of calculation
            fill(d.color);
            stroke(d.color);
            rect(d.x1, d.y1, d.widthX, d.heightY);
            line(d.x2, d.y2, d.x2, d.y3);
            //calculate selected candle
            d.isInBound(mouseX - translateX);
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
        rect(mouseX - 35, height - 40, 70, 20);
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

//change min and maximum value of scales
function calcScales() {
    //get no of graph elements moved
    dataMoved = Math.round((translateX * data_on_graph) / 900);
    // get low price and high price value for scale
    min_low = getMinOfArray(low.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
    max_high = getMaxOfArray(high.slice(data_length - data_on_graph - 5 - dataMoved, data_length - dataMoved));
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
    fill(255);
    //background rectangle
    rect(8, 10, 380, 30);
    fill(color_[selectedI]);
    text("O :", 10, 30);
    text(open_[selectedI], 30, 30);
    text("L :", 110, 30);
    text(low[selectedI], 130, 30);
    text("H :", 210, 30);
    text(high[selectedI], 230, 30);
    text("C :", 310, 30);
    text(close_[selectedI], 330, 30);
    strokeWeight(1);
}

// translate on basis of click and drag
function mouseDragged() {
    // do not drag to right when reached last data
    if (translateX + (mouseX - pmouseX) > 0) {
        translateX += (mouseX - pmouseX);
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


// a class for calculating values and behaviour of candle stick rect and line
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
        this.calc();                    //perform calculation
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

        this.color = color_[i]              //color of candle
    }
    //check if mouseX is on the candle area anywhere between candle width
    isInBound(mouseX) {
        //mousex is in rectangle bound (X)
        if (mouseX > this.x1 && mouseX < this.x1 + this.widthX) {
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
    // whenever there is value in hidden element and data is not loaded then load the data
    if (document.getElementById("hidden").innerHTML != "" && dataloaded == false) {
        // get data and change to json object
        data = JSON.parse(document.getElementById("hidden").innerHTML);
        //calculate length of data by date length
        data_length = Object.keys(data["date"]).length;
        console.log(data_length);

        // add all data to corresponding arrays
        for (var i = 0; i < data_length; i++) {
            date[i] = (data['date'][i]);
            open_[i] = (data['open'][i]);
            close_[i] = (data['close'][i]);
            low[i] = (data['low'][i]);
            high[i] = (data['high'][i]);
            color_[i] = (data['color'][i]);
        }
        //calculate min and max of first 30 data
        min_low = getMinOfArray(low.slice(data_length - 31, data_length));
        max_high = getMaxOfArray(high.slice(data_length - 31, data_length));
        dataloaded = true;
    }
}, 100);