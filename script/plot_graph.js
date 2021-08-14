// function for candle graph , hollow candle and heikin ashi , bars
function draw_candle_heikinashi() {

    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new candle_cal(i, width, height);
        indicatorPlot(i,width,height,d.x1,d.widthX);
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
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new line_area_cal(i, width, height);
        indicatorPlot(i,width,height,d.x1,d.widthX);
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
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new line_area_cal(i, width, height);

        indicatorPlot(i,width,height,d.x1,d.widthX);
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
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new renko(i, width, height);
        indicatorPlot(i,width,height,d.x1,d.widthX);
        //set color of candles and position of rect and line on basis of calculation
        fill(d.color);
        stroke(d.color);
        rect(d.x1, d.y1, d.widthX, d.heightY);
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}
function drawkagi() {
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new kagi_cal(i, width, height);
        indicatorPlot(i,width,height,d.x1,d.widthX);

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
    // calculate number of candles to show on screen
    for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
        // draw grid and scale on x axis
        drawScaleX(i);
        // create a candle object and pass i , width and height for calculation
        d = new renko(i, width, height);
        indicatorPlot(i,width,height,d.x1,d.widthX);
        //set color of candles and position of rect and line on basis of calculation
        fill("#fff");
        stroke(d.color);
        strokeWeight(1);
        // rect(d.x1, d.y1, d.widthX, d.heightY);
        for(var j = 0; j<pnf_count[i]; j++){
            var pnf_height = d.heightY/pnf_count[i];
            if(d.color=='#00ca73'){
                line(d.x1+d.widthX/4,d.y1+(j*pnf_height),d.x1+3*d.widthX/4,d.y1+((j+1)*pnf_height));
                line(d.x1+d.widthX/4,d.y1+((j+1)*pnf_height),d.x1+3*d.widthX/4,d.y1+(j*pnf_height));
            }else {
                ellipseMode(CORNER);
                ellipse(d.x1+d.widthX/4,d.y1+((j+1)*pnf_height),d.widthX/2,-pnf_height);
            }
        }
        //calculate selected candle
        d.isInBound(mouseX - translateX);
    }
}

function move_baseline(mouseY, pmouseY) {
    if (mouseY > yb - 20 && mouseY < yb + 20) {
        yb = pmouseY;
    }
}



// a class for calculating values and behaviour[candle hollow candle bar and heikin ashi]
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
    }
    //check if mouseX is on the bar area anywhere between bar width
    isInBound(mouseX) {
        //mousex is in  bound (X)
        if (mouseX > this.x1 - this.widthX && mouseX < this.x1 + this.widthX) {
            selectedI = this.i;
        }
    }
}
// a class for calculating values and behaviour[renko , line_break and pnf]
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
    }
    //check if mouseX is on the candle area anywhere between candle width
    isInBound(mouseX) {
        //mousex is in rectangle bound (X)
        if (mouseX > this.x1 && mouseX < this.x1 + this.widthX) {
            selectedI = this.i;
        }
    }
}

// a class for calculating values and behaviour[kagi]
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

