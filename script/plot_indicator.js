function indicatorPlot(i,width,height,x1,widthX){
    if(indicator.includes(0)){
        const y1 = map(volume[i], max_vol, min_vol,height-height/3,height-paddingY/2);
        volumePlot(i,x1,y1,widthX);
    }
}
// indicators i.e volume 
function volumePlot(i,x,y,widthX){
    fill(color_[i]+"44");
    if(graph_type=="hollowcandle")fill(stroke_[i]+"44");
    stroke(color_[i]+"44")
    rect(x,y,widthX,height-y-paddingY/2);
}