/* Function for calculating statistical data for indicators*/
function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

//exponetial weighted moving average
function ewm(numbers){
    const arr_length = numbers.length;
    const alpha = 2 / (arr_length+1);
    let ewma = numbers[arr_length-1];
    for(var i=arr_length-2; i>=0; i--){
    ewma = (1-(alpha)) * ewma + (alpha) * numbers[i];
    }
    return ewma;
}