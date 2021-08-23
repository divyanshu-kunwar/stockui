// initialized variable
var canvas, paddingY = 100, paddingX = 100;
var data, data_ = "", dataloaded = false, graph_type = "candle";
var date = [], open_ = [], close_ = [], low = [], height_ = [];
var high = [], color_ = [], stroke_ = [], volume = [], pnf_count = [];
var min_low = 0, max_high = 0, min_vol = 0, max_vol = 0; translateX = 0, scaleValue = 1;
var data_length = 0, selectedI = 0, dataMoved = 0, data_on_graph = 60;
var yb, xb, drawCount = 0;
var indicatorRaw, indicator;
var background_color = "#fff";
var text_color = "#000";

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
        background(background_color);

        stroke(text_color);
        //only horizontal grid 
        drawGridY();
        strokeWeight(0);
        fill(background_color);
        //background rectangle
        rect(8, 10, 380, 90);
        strokeWeight(1);

        //update the type of graph
        push()
        // move  data to left or right 
        translate(translateX, 0);

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
                draw_candle_heikinashi();
                break;
        }
        pop()

        stroke(text_color);
        //horizontal x line
        line(0, parentHeight - 80, width, parentHeight - 80);
        line(0, height - 50, width, height - 50);

        //draw vertical value and ticks on x-axis
        drawScaleY()

        //show the value of selected candle
        legend()

        //ticks for selected position on graph as date on x-axis and price on y
        fill(text_color);
        //price tick
        rect(width - 102, mouseY - 10, 60, 20);
        //date tick
        rect(mouseX - 35, parentHeight - 70, 80, 20);
        fill(background_color);
        //calculate value of current position
        var ycurrent = map(mouseY, height - paddingY, paddingY / 2, min_low, max_high).toFixed(2);
        //price
        text(ycurrent, width - 100, mouseY + 5)
        //date
        text(date[selectedI], mouseX - 25, parentHeight - 55)
        // dotted cross line according to mouse coordinates
        strokeWeight(0.4);
        canvas.drawingContext.setLineDash([5, 5]);
        line(0, mouseY, width - paddingX, mouseY);
        line(mouseX, 0, mouseX, parentHeight - 80);
        canvas.drawingContext.setLineDash([0, 0]);
        strokeWeight(1);
    }
}

//change min and maximum value of scales
function calcScales() {
    //get no of graph elements moved
    dataMoved = Math.round((translateX * data_on_graph) / 900);
    // get low price and high price value for scale
    min_low = getMinOfArray(low.slice(data_length - data_on_graph - 2 - dataMoved, data_length - dataMoved));
    max_high = getMaxOfArray(high.slice(data_length - data_on_graph - 2 - dataMoved, data_length - dataMoved));
    min_vol = getMinOfArray(volume.slice(data_length - data_on_graph - 2 - dataMoved, data_length - dataMoved));
    max_vol = getMaxOfArray(volume.slice(data_length - data_on_graph - 2 - dataMoved, data_length - dataMoved));
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
    fill(text_color);
    stroke(text_color);
    if (i % Math.round(data_on_graph / 10) == 0) {
        //small dark tick lines on x axis 
        line(x, parentHeight - 70, x, parentHeight - 80);

        //date on x-axis
        strokeWeight(0);
        text(date[i], x - 20, parentHeight - 60);

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
    stroke(text_color);
    //vertical fixed line (y-axis)
    line(width - 102, 0, width - 102, parentHeight - 80);
    stroke(background_color);
    fill(background_color);
    // vertical fixed rectangle right to y-axis
    rect(width - 100, 0, 100, parentHeight - 50);
    stroke(text_color);
    fill(text_color);
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
    text("Volume :", 10, 80);
    text(volume[selectedI], 70, 80);
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

var themeButton = document.getElementById("themeBtn");

var nightMode = false;
themeButton.addEventListener("click", function (e) {
    if (!nightMode) {
        toDark();
        
        document.body.style.filter = "invert(100%)";
        document.getElementById("graph_area").style.filter = "invert(100%)";
        themeButton.setAttribute("src","../icon/changeToLight.svg");
        $(".action_btn").css('filter','invert(100%)')
        nightMode = true;
        background_color = "#020204";
        text_color = "#fffff9";
        
    } else {
        toLight();
        document.body.style.filter = "invert(0%)";
        document.getElementById("graph_area").style.filter = "invert(0%)";
        $(".action_btn").css('filter','invert(0%)')
        nightMode = false;
        background_color = "#fffff9";
        text_color = "#020204";
        themeButton.setAttribute("src","../icon/changeToDark.svg");
        
    }
});

function toLight(){
    document.body.animate([
        // keyframes
        { backgroundColor: '#020204' },
        { backgroundColor: '#fffff9' }
      ], {
        // timing options
        duration: 200,
        iterations: 1
      });
      document.getElementById("graph_area").animate([
        // keyframes
        { opacity: 0 },
        { opacity: 0.3 },
      ], {
        // timing options
        duration: 300,
        iterations: 1
      });
      document.body.style.backgroundColor = "#fffff9";
}
function toDark(){
    document.body.animate([
        // keyframes
        { backgroundColor: '#fffff9' },
        { backgroundColor: '#020204' }
      ], {
        // timing options
        duration: 200,
        iterations: 1
      });
      document.getElementById("graph_area").animate([
        // keyframes
        { opacity: 0 },
        { opacity: 0.3 },
      ], {
        // timing options
        duration: 300,
        iterations: 1
      });

      document.body.style.backgroundColor = "#020204";
}
// themeButton.click();