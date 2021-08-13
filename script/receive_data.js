// calculate maximum value and minimum value in a given array
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}
//getting data from the hidden div element and adding it back to arrays
setInterval(function () {
    if(document.getElementById("hiddenInd").innerHTML != ""){
    indicator = JSON.parse(document.getElementById("hiddenInd").innerHTML);
    }
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
