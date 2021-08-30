import pandas as pd
import atrlib
import numpy as np 
  
# module for calculation of data for pnf graph
def pnf(df):
    pnf_brick = atrlib.brick_size(df)
    d , o ,  c, pnf_open , pnf_close, color,vol,pnf_count = [],[],[],[],[],[],[],[]
    pnf_open.append(df["open"][0])
    d.append(df["date"][0])
    o.append(df["open"][0])
    c.append(df["close"][0])
    vol.append(df['volume'][0])
    leng = len(pnf_open)
    i=0
    if(pnf_open[leng-1]+pnf_brick>df["close"][i]):
        i = 0
        while(pnf_open[leng-1]+pnf_brick>df["close"][i]):
            i= i+1
    elif(pnf_open[leng-1]-pnf_brick<df["close"][i]):
        i = 0
        while(pnf_open[leng-1]-pnf_brick<df["close"][i]):
            i= i+1
    pnf_close.append(df["close"][i])

    volume = 0.0
    j = i+1
    while(j<len(df)):
        volume += df['volume'][j]
        leng = len(pnf_open)
        if(pnf_close[leng-1]>pnf_open[leng-1]):
            if(df["close"][j]>pnf_close[leng-1]):
                pnf_close[leng-1] = df["close"][j]
            elif(df["close"][j]<pnf_close[leng-1]-3*pnf_brick):
                pnf_open.append(pnf_close[leng-1]-pnf_brick)
                d.append(df["date"][j])
                vol.append(volume)
                volume = 0.0
                pnf_close.append(df["close"][j])

        else:
            if(df["close"][j]<pnf_close[leng-1]):
                pnf_close[leng-1] = df["close"][j]
            elif(df["close"][j]>pnf_close[leng-1]+3*pnf_brick):
                pnf_open.append(pnf_close[leng-1]+pnf_brick)
                d.append(df["date"][j])
                vol.append(volume)
                volume = 0.0
                pnf_close.append(df["close"][j])


        j = j+1
    data = pd.DataFrame(d,columns=["date"])
    data["open"] = pnf_open
    data["close"] = pnf_close
    data['volume'] = vol

    x=np.arange(0,len(data))
    low,high = [],[]
    for i in x:
        if data['close'][i] >data['open'][i]:
            high.append(data['close'][i])
            low.append(data['open'][i])
            pnf_count.append((data['close'][i]-data['open'][i])//pnf_brick)
            color.append('#00ca73')           #green

        else:
            high.append(data['open'][i])
            low.append(data['close'][i])
            pnf_count.append((data['open'][i]-data['close'][i])//pnf_brick)
            color.append('#ff6960')           #red

    data["low"] =low
    data["high"] = high
    data["color"] = color
    data['pnf_count']=pnf_count
    return data