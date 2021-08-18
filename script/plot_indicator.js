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
            for(let k=0; k<Object.keys(indicator_list[1].controls).length-1; k=k+3){
                if(i>indicator_list[1]['controls'][k]["numInput"]["value"]){
                color_ma = indicator_list[1]['controls'][k+2]['color1']['value'];
                source = indicator_list[1]['controls'][k+1]['selectedValue'];
                priceSum = 0;
                prevPriceSum = 0;
                for(var j=1 ; j<indicator_list[1]['controls'][k]["numInput"]["value"]+1 ; j++){
                    if(source == "high"){
                        priceSum += high[i-j+1];
                        prevPriceSum += high[i-j];
                    }else if(source == "low"){
                        priceSum += low[i-j+1];
                        prevPriceSum += low[i-j];
                    }else if(source == "open"){
                        priceSum += open_[i-j+1];
                        prevPriceSum += open_[i-j];
                    }else{
                        priceSum += close_[i-j+1];
                        prevPriceSum += close_[i-j];
                    }
                    
                }
                ma = priceSum/indicator_list[1]['controls'][k]["numInput"]["value"];
                pma = prevPriceSum/indicator_list[1]['controls'][k]["numInput"]["value"];
                ma = map(-ma,-min_low, -max_high, height - paddingY, paddingY / 2);
                pma = map(-pma,-min_low, -max_high, height - paddingY, paddingY / 2);
                maPlot(x1_offset,ma,x2,pma,color_ma);
                }
            }
        }
    }
    if(indicator_list[2]){
        if(indicator_list[2]['applied']==true && indicator_list[2]['hidden']==false){
            for(let k=0; k<Object.keys(indicator_list[2].controls).length-1; k=k+3){
                if(i>indicator_list[2]['controls'][k]["numInput"]["value"]){
                color_mm = indicator_list[2]['controls'][k+2]['color1']['value'];
                source = indicator_list[2]['controls'][k+1]['selectedValue'];
                price = [];
                prevPrice = [];
                for(var j=1 ; j<indicator_list[2]['controls'][k]["numInput"]["value"]+1; j++){
                    if(source == "high"){
                        price[j-1] = high[i-j+1];
                        prevPrice[j-1] = high[i-j];
                    }else if(source == "low"){
                        price[j-1] = low[i-j+1];
                        prevPrice[j-1] = low[i-j];
                    }else if(source == "open"){
                        price[j-1] = open_[i-j+1];
                        prevPrice[j-1] = open_[i-j];
                    }else{
                        price[j-1] = close_[i-j+1];
                        prevPrice[j-1] = close_[i-j];
                    }
                    
                }
                mm = median(price);
                pmm = median(prevPrice);
                mm = map(-mm,-min_low, -max_high, height - paddingY, paddingY / 2);
                pmm = map(-pmm,-min_low, -max_high, height - paddingY, paddingY / 2);
                maPlot(x1_offset,mm,x2,pmm,color_mm);
                }
            }
        }
    }
    if(indicator_list[3]){
        if(indicator_list[3]['applied']==true && indicator_list[3]['hidden']==false){
            for(let k=0; k<Object.keys(indicator_list[3].controls).length-1; k=k+3){
                if(i>indicator_list[3]['controls'][k]["numInput"]["value"]){
                color_ewma = indicator_list[3]['controls'][k+2]['color1']['value'];
                source = indicator_list[3]['controls'][k+1]['selectedValue'];
                price = [];
                prevPrice = [];
                for(var j=1 ; j<indicator_list[3]['controls'][k]["numInput"]["value"]+1; j++){
                    if(source == "high"){
                        price[j-1] = high[i-j];
                        prevPrice[j-1] = high[i-j-1];
                    }else if(source == "low"){
                        price[j-1] = low[i-j];
                        prevPrice[j-1] = low[i-j-1];
                    }else if(source == "open"){
                        price[j-1] = open_[i-j];
                        prevPrice[j-1] = open_[i-j-1];
                    }else{
                        price[j-1] = close_[i-j];
                        prevPrice[j-1] = close_[i-j-1];
                    }
                    
                }
                ewma = ewm(price);
                pewma = ewm(prevPrice);
                ewma = map(-ewma,-min_low, -max_high, height - paddingY, paddingY / 2);
                pewma = map(-pewma,-min_low, -max_high, height - paddingY, paddingY / 2);
                maPlot(x1_offset,ewma,x2,pewma,color_ewma);
                }
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

function maPlot(x1_offset,ma,x2,pma,color_ma){
    strokeWeight(1);
    stroke(color_ma);
    line(x1_offset,ma,x2,pma);
}