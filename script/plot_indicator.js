function indicatorPlot(i,width,height,x1,widthX){
    x1_offset = map(i, data_length - data_on_graph, data_length, 0, width - paddingX);
    var x2 = map(i-1, data_length - data_on_graph, data_length, 0, width - paddingX);
    if(indicator_list[0]){
        if(indicator_list[0]['applied']==true && indicator_list[0]['hidden']==false){
        const y1 = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);
        volumePlot(i,x1,y1,widthX,
            indicator_list[0]['controls'][0]['color1']['value'],
            indicator_list[0]['controls'][0]['color2']['value']);
        }
    }
    if(indicator_list[1]){
        if(indicator_list[1]['applied']==true && indicator_list[1]['hidden']==false){
            if(i>indicator_list[1]['controls'][0]["numInput"]["value"]){
                priceSum = 0;
                prevPriceSum = 0;
                for(var j=1 ; j<indicator_list[1]['controls'][0]["numInput"]["value"]+1 ; j++){
                    priceSum += close_[i-j];
                    prevPriceSum += close_[i-j-1];
                }
                ma = priceSum/indicator_list[1]['controls'][0]["numInput"]["value"];
                pma = prevPriceSum/indicator_list[1]['controls'][0]["numInput"]["value"];
                ma = map(-ma,-min_low, -max_high, height - paddingY, paddingY / 2);
                pma = map(-pma,-min_low, -max_high, height - paddingY, paddingY / 2);
                maPlot(x1_offset,ma,x2,pma);
            }
        }
    }
}
// indicators i.e volume 
function volumePlot(i,x,y,widthX,colorup , colordown){
    var color_name;
    if(color_[i]=="#00ca73") color_name = colorup;
    else color_name = colordown;
    fill(color_name);
    if(graph_type=="hollowcandle")fill(stroke_[i]+"44");
    stroke(color_name)
    rect(x,y,widthX,height-y-paddingY/2);
}

function maPlot(x1_offset,ma,x2,pma){
    strokeWeight(1);
    stroke("#0000ff");
    line(x1_offset,ma,x2,pma);
}