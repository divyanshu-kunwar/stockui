import atrlib
import pandas as pd
def renko(df):
    d , l , h ,lbo ,lbc,vol=[],[],[],[],[],[]
    brick_size = atrlib.brick_size(df)
    volume = 0.0
    for i in range(0,len(df)):
        if i==0:
            if(df['close'][i]>df['open'][i]):
                d.append(df['date'][i])
                l.append(df['open'][i])
                h.append(df["close"][i])
                lbo.append(df["open"][i])
                lbc.append(df["close"][i])
                vol.append(df['volume'][i])
            else:
                d.append(df['date'][i])
                l.append(df['close'][i])
                h.append(df["open"][i])
                lbo.append(df["open"][i])
                lbc.append(df["close"][i])
                vol.append(df['volume'][i])
        else:
            volume += df["volume"][i]
            leng = len(lbo)
            if(lbc[leng-1]>lbo[leng-1]):
                if(df["close"][i]>=(lbc[leng-1]+brick_size)):
                    lbc.append((lbc[leng-1]+brick_size))
                    lbo.append(lbc[leng-1])
                    l.append(lbc[leng-1])
                    h.append((lbc[leng-1]+brick_size))
                    d.append(df["date"][i])
                    vol.append(volume)
                    volume = 0.0
                elif(df["close"][i]<=(lbo[leng-1]-brick_size)):
                    lbc.append((lbo[leng-1]-brick_size))
                    lbo.append(lbo[leng-1])
                    h.append(lbo[leng-1])
                    l.append((lbo[leng-1]-brick_size))
                    d.append(df["date"][i])
                    vol.append(volume)
                    volume = 0.0
            else:
                if(df["close"][i]>=(lbo[leng-1]+brick_size)):
                    lbc.append((lbo[leng-1]+brick_size))
                    lbo.append(lbo[leng-1])
                    l.append(lbo[leng-1])
                    h.append((lbo[leng-1]+brick_size))
                    d.append(df["date"][i])
                    vol.append(volume)
                    volume = 0.0
                elif(df["close"][i]<=(lbc[leng-1]-brick_size)):
                    lbc.append((lbc[leng-1]-brick_size))
                    lbo.append(lbc[leng-1])
                    h.append(lbc[leng-1])
                    l.append((lbc[leng-1]-brick_size))
                    d.append(df["date"][i])
                    vol.append(volume)
                    volume = 0.0
                
                
    data_ = pd.DataFrame(d,columns=["date"])
    data_["open"] = lbo
    data_["close"] =lbc
    data_["low"] = l
    data_["high"] = h
    data_['volume']=vol
    return data_
  