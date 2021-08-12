import pandas as pd

def atr(df):
    ar = []
    for i in range(0,len(df)):
        if i==0:
            ar.append(df['high'][i]-df['low'][i])
        else:
            hl=(df['high'][i]-df['low'][i])
            hc=abs(df['high'][i]-df['close'][i-1])
            lc=abs(df['low'][i]-df['close'][i-1])
            ar.append(max(hl,hc,lc))
    df['ar'] = ar
    atrlist = (df['ar'].rolling(14, min_periods=1).sum()/14).tolist()
    atr = pd.DataFrame(atrlist,columns= ['atr'])
    return atr

def brick_size(df):
    brick_size= atr(df)['atr'].median()
    return brick_size