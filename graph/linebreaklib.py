import pandas as pd
def linebreak(df):
    data = df[["d","c", "o"]].loc[::-1].reset_index()
    data=data[["d", "c","o"]]
    d , o , c ,lbo ,lbc = [],[],[],[],[]
    for i in range(0,3):
        d.append(data['d'][i])
        o.append(data['o'][i])
        c.append(data["c"][i])
        lbo.append(data["o"][i])
        lbc.append(data["c"][i])

    for i in range(3,len(data)):
        leng = len(lbo)
        if(data["c"][i]>max(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(data["c"][i])
            if(lbc[leng-1]>lbo[leng-1]):
                lnbr_open=lbc[leng-1]
            else:
                lnbr_open=lbo[leng-1]
            lbo.append(lnbr_open)
            d.append(data["d"][i])
            o.append(data["o"][i])
            c.append(data["c"][i])
        elif(data["c"][i]<min(lbc[leng-1],lbc[leng-2],lbc[leng-3],lbo[leng-1],lbo[leng-2],lbo[leng-3])):
            lbc.append(data["c"][i])
            if(lbc[leng-1]>lbo[leng-1]):
                    lnbr_open=lbo[leng-1]
            else:
                lnbr_open=lbc[leng-1]
            lbo.append(lnbr_open)
            d.append(data["d"][i])
            o.append(data["o"][i])
            c.append(data["c"][i])
    data_ = pd.DataFrame(d,columns=["d"])
    data_["o"] = o
    data_["c"] = c
    data_["lbo"] = lbo
    data_["lbc"] = lbc
    data_=data_.loc[::-1]
    data_=data_.reset_index()
    data_ = data_.drop(columns=["index"])
    return data_