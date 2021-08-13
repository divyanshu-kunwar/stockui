// indicators i.e volume 
function volumePlot(i,x,y,widthX){
    fill(color_[i]+"44");
    if(graph_type=="hollowcandle")fill(stroke_[i]+"44");
    stroke(color_[i]+"44")
    rect(x,y,widthX,height-y-paddingY/2);
}