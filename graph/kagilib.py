import pandas as pd
import renkolib
import numpy as np


def kagi(df):
    kagi_break = renkolib.renko().set_brick_size(auto = True, HLC_history = df[["high", "low", "close"]])
    d , o ,  c, ko , kc, color  = [],[],[],[],[],[]
    ko.append(df["open"][0])
    d.append(df["date"][0])
    o.append(df["open"][0])
    c.append(df["close"][0])
    leng = len(ko)
    i=0
    if(ko[leng-1]+kagi_break>df["close"][i]):
        i = 0
        color.append("g")
        while(ko[leng-1]+kagi_break>df["close"][i]):
            i= i+1
    elif(ko[leng-1]-kagi_break<df["close"][i]):
        i = 0
        color.append("r")
        while(ko[leng-1]-kagi_break<df["close"][i]):
            i= i+1
    kc.append(df["close"][i])

    j = i+1
    while(j<len(df)):
        leng = len(ko)
        if(kc[leng-1]>ko[leng-1]):
            if(df["close"][j]>kc[leng-1]):
                kc[leng-1] = df["close"][j]
            elif(df["close"][j]<kc[leng-1]-kagi_break):
                ko.append(kc[leng-1])
                d.append(df["date"][j])
                kc.append(df["close"][j])

        else:
            if(df["close"][j]<kc[leng-1]):
                kc[leng-1] = df["close"][j]
            elif(df["close"][j]>kc[leng-1]+kagi_break):
                ko.append(kc[leng-1])
                d.append(df["date"][j])
                kc.append(df["close"][j])


        j = j+1
    data = pd.DataFrame(d,columns=["date"])
    data["ko"] = ko
    data["kc"] = kc

    x=np.arange(0,len(data))
    height = []
    for i in x:
        if data['kc'][i] >data['ko'][i]:
            height.append(data['kc'][i] - data['ko'][i])
        else:
            height.append(data['ko'][i] - data['kc'][i])
    data["height"] = height
    x=np.arange(1,len(data))
    for i in x:
        if data['kc'][i] >data['ko'][i-1]:
            color.append('g')
        else:
            color.append('r')
    data["color"] = color
    return data