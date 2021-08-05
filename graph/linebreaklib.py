import pandas as pd
def linebreak(df):
    data=df[["date", "close","open"]]
    d , o , c ,lbo ,lbc = [],[],[],[],[]
    for i in range(0,3):
        d.append(data['date'][i])
        o.append(data['open'][i])
        c.append(data["close"][i])
        lbo.append(data["open"][i])
        lbc.append(data["close"][i])

    for i in range(3,len(data)):
        leng = len(lbo)
        if(data['close'][i]>max(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(data['close'][i])
            if(lbc[leng-1]>lbo[leng-1]):
                lnbr_open=lbc[leng-1]
            else:
                lnbr_open=lbo[leng-1]
            lbo.append(lnbr_open)
            d.append(data['date'][i])
            o.append(data['open'][i])
            c.append(data['close'][i])
        elif(data['close'][i]<min(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(data['close'][i])
            if(lbc[leng-1]>lbo[leng-1]):
                    lnbr_open=lbo[leng-1]
            else:
                lnbr_open=lbc[leng-1]
            lbo.append(lnbr_open)
            d.append(data['date'][i])
            o.append(data['open'][i])
            c.append(data['close'][i])
    data_ = pd.DataFrame(d,columns=['date'])
    data_['open'] = o
    data_['close'] = c
    data_['lbopen'] = lbo
    data_['lbclose'] = lbc
    data_=data_.reset_index()
    data_ = data_.drop(columns=["index"])
    return data_