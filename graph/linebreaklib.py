import pandas as pd
def linebreak(df):
    d  ,lbo ,lbc, vol , low , high  = [],[],[],[],[],[]
    for i in range(0,3):
        d.append(df['date'][i])
        lbo.append(df["open"][i])
        lbc.append(df["close"][i])
        vol.append(df["volume"][i])
        low.append(min(lbo[i],lbc[i]))
        high.append(max(lbo[i],lbc[i]))
    volume = 0.0
    for i in range(3,len(df)):
        volume += df['volume'][i]
        leng = len(lbo)
        if(df['close'][i]>max(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(df['close'][i])
            high.append(df['close'][i])
            if(lbc[leng-1]>lbo[leng-1]):
                lnbr_open=lbc[leng-1]
            else:
                lnbr_open=lbo[leng-1]
            lbo.append(lnbr_open)
            low.append(lnbr_open)
            d.append(df['date'][i])
            vol.append(volume)
            volume = 0.0
        elif(df['close'][i]<min(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(df['close'][i])
            low.append(df['close'][i])
            if(lbc[leng-1]>lbo[leng-1]):
                    lnbr_open=lbo[leng-1]
            else:
                lnbr_open=lbc[leng-1]
            lbo.append(lnbr_open)
            high.append(lnbr_open)
            d.append(df['date'][i])
            vol.append(volume)
            volume = 0.0
    

    df_ = pd.DataFrame(d,columns=['date'])
    df_['open'] = lbo
    df_['close'] = lbc
    df_['low'] = low
    df_['high'] = high
    df_['volume'] = vol
 
    return df_