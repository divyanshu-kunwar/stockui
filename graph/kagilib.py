import pandas as pd
import atrlib
import numpy as np

# module for calculation of data for kagi graph
def kagi(df):
    kagi_break = atrlib.brick_size(df)
    d , o ,  c, ko , kc, color,vol = [],[],[],[],[],[],[]
    ko.append(df["open"][0])
    d.append(df["date"][0])
    o.append(df["open"][0])
    c.append(df["close"][0])
    vol.append(df['volume'][0])
    leng = len(ko)
    i=0
    if(ko[leng-1]+kagi_break>df["close"][i]):
        i = 0
        color.append("#00ca73")     #green
        while(ko[leng-1]+kagi_break>df["close"][i]):
            i= i+1
    elif(ko[leng-1]-kagi_break<df["close"][i]):
        i = 0
        color.append("#ff6960")      #red
        while(ko[leng-1]-kagi_break<df["close"][i]):
            i= i+1
    kc.append(df["close"][i])

    volume = 0.0
    j = i+1
    while(j<len(df)):
        volume += df['volume'][j]
        leng = len(ko)
        if(kc[leng-1]>ko[leng-1]):
            if(df["close"][j]>kc[leng-1]):
                kc[leng-1] = df["close"][j]
            elif(df["close"][j]<kc[leng-1]-kagi_break):
                ko.append(kc[leng-1])
                d.append(df["date"][j])
                vol.append(volume)
                volume = 0.0
                kc.append(df["close"][j])

        else:
            if(df["close"][j]<kc[leng-1]):
                kc[leng-1] = df["close"][j]
            elif(df["close"][j]>kc[leng-1]+kagi_break):
                ko.append(kc[leng-1])
                d.append(df["date"][j])
                vol.append(volume)
                volume = 0.0
                kc.append(df["close"][j])


        j = j+1
    data = pd.DataFrame(d,columns=["date"])
    data["open"] = ko
    data["close"] = kc
    data['volume'] = vol

    x=np.arange(0,len(data))
    height,low,high = [],[],[]
    for i in x:
        if data['close'][i] >data['open'][i]:
            height.append(data['close'][i] - data['open'][i])
            high.append(data['close'][i])
            low.append(data['open'][i])

        else:
            height.append(data['open'][i] - data['close'][i])
            high.append(data['open'][i])
            low.append(data['close'][i])
    data["height"] = height
    data["low"] =low
    data["high"] = high
    x=np.arange(1,len(data))
    for i in x:
        if data['close'][i] >data['open'][i-1]:
            color.append('#00ca73')           #green
        else:
            color.append('#ff6960')           #red
    data["color"] = color
    return data