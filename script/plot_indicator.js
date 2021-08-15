function indicatorPlot(i,width,height,x1,widthX){
    if(indicator_list[0]){
        if(indicator_list[0]['applied']==true && indicator_list[0]['hidden']==false){
        const y1 = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);
        volumePlot(i,x1,y1,widthX,
            indicator_list[0]['controls'][0]['color1']['value'],
            indicator_list[0]['controls'][0]['color2']['value']);
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