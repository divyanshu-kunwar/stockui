function drawIndicator(){
    if(indicator!=null){
    if(indicator.hasOwnProperty(0)){             //atr
        atr = new subplotly('atr' , indicator[0].data, 'line');
        
    }
    if(indicator.hasOwnProperty(1)){             //dema
        dema = new plotly('dema' , indicator[1].data, 'line');
    }
    if(indicator.hasOwnProperty(2)){             //ema
        ema = new plotly('ema', indicator[2].data, 'line')
    }
}
}

// draw scale Y if there is any subplot and adjust size of main plot
function drawIndicatorScaleY(){
    
}
class plotly{
    constructor(indName, indData, shapeType){
        this.indName = indName;
        this.indData = indData;
        this.shapeType = shapeType;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.drawPlotly();

    }
    drawPlotly(){
        if(this.shapeType == "line"){ 
            let no_of_plotly = Object.keys(this.indData).length;
            for(var j=0; j < no_of_plotly; j++){
                for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
                    this.calculatePlotly(i , j);
                    console.log("values:",this.x1,this.y1,this.x2,this.y2)
                    strokeWeight(1);
                    stroke(0);
                    line (this.x1,this.y1,this.x2,this.y2);
                }
            }
        }
    }
    calculatePlotly(i , j){
        this.x1 = map(i-1 , data_length - data_on_graph, data_length, 0, width - paddingX);
        this.x2 = map(i , data_length - data_on_graph, data_length, 0, width - paddingX);
        this.y1 = map(-this.indData[j][i-1],-min_low, -max_high, height - paddingY, paddingY / 2);
        this.y2 = map(-this.indData[j][i],-min_low, -max_high, height - paddingY, paddingY / 2);
    }

}
class subplotly{
    constructor(indName, indData, shapeType){
        this.indName = indName;
        this.indData = indData;
        this.shapeType = shapeType;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.min_ind = 0;
        this.max_ind = 0;
        this.drawSubPlotly();

    }
    drawSubPlotly(){
        if(this.shapeType == "line"){ 
            let no_of_subPlotly = Object.keys(this.indData).length;
            for(var j=0; j < no_of_subPlotly; j++){
                for (var i = (data_length - data_on_graph - dataMoved); i < data_length - dataMoved; i++) {
                    this.calculateSubPlotly(i , j);
                    console.log("values:",this.x1,this.y1,this.x2,this.y2);
                    console.log("min / max", this.min_ind ," ", this.max_ind);
                    strokeWeight(1);
                    stroke(0);
                    line (this.x1,this.y1,this.x2,this.y2);
                }
            }
        }

    }
    calculateSubPlotly(i , j){
        if(i==data_length - data_on_graph - dataMoved){
            let ind_arr = []
            let k = 0;
            for(var l = (data_length - data_on_graph - dataMoved-2); l < data_length - dataMoved; l++){
                ind_arr[k] = this.indData[j][l];
                k++;
            }
            console.log("arr",ind_arr)
            this.min_ind = getMinOfArray(ind_arr);
            this.max_ind = getMaxOfArray(ind_arr);
            this.drawSubScale(j);
        }
        this.x1 = map(i-1 , data_length - data_on_graph, data_length, 0, width - paddingX);
        this.x2 = map(i , data_length - data_on_graph, data_length, 0, width - paddingX);
        this.y1 = map(-this.indData[j][i-1],-this.min_ind, -this.max_ind, (parentHeight -80), 0.75*(parentHeight-40));
        this.y2 = map(-this.indData[j][i],-this.min_ind, -this.max_ind, (parentHeight -80), 0.75*(parentHeight-40));
    }
    drawSubScale(j){
        let maxTick = map(-this.min_ind,-this.min_ind, -this.max_ind, (parentHeight -80), 0.75*(parentHeight-40));
        let minTick = map(-this.max_ind,-this.min_ind, -this.max_ind, (parentHeight -80), 0.75*(parentHeight-40));;
        push()
        translate(-translateX,0)
        fill(background_color);
        strokeWeight(0);
        rect(width - 100, 0.75*(parentHeight-40), 100, parentHeight - 30);
        stroke(0);
        fill(0);
        text(this.indData[j][selectedI],20,0.75*(parentHeight-40));
        rect(width - 102, mouseY - 10, 60, 20);
        let ycurrent = map(mouseY, (parentHeight -80), 0.75*(parentHeight-40),this.min_ind,this.max_ind);
        fill(255);
        text(ycurrent.toFixed(3),width - 102,mouseY+5)
        fill(0);
        for(var i =0; i<4; i++){
            strokeWeight(1);
            line(width - 100 , maxTick + i*(minTick-maxTick)/4 , width - 120 , maxTick+ i*(minTick-maxTick)/4);
            strokeWeight(0);
            text((this.min_ind + i*(this.max_ind-this.min_ind)/4).toFixed(2) ,
             width- 80 , maxTick+5 + i*(minTick-maxTick)/4);
        }
        pop();     
    }
}
function calcIfSubPlot(){
    height = 0.8 * (parentHeight-30);
}