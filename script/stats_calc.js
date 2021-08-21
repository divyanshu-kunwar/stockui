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
    const alpha = 1.22 / (arr_length+1);
    let ewma = ((numbers.reduce((a, b) => a + b, 0))/arr_length);
    for(var i=arr_length-2; i>=0; i--){
        ewma = (1-(alpha)) * ewma + (alpha) * numbers[i];
    }
    return ewma;
}
function smma(numbers){
    const arr_length = numbers.length;
    let smma = ((numbers.reduce((a, b) => a + b, 0))/arr_length);
    for(var i=arr_length-2; i>=0; i--){
    smma = (smma * (arr_length-1) + numbers[i])/ arr_length;
    }
    return smma;
}