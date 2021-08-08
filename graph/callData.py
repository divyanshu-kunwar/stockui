import dataTransfer
import pandas as pd
import sys

df =pd.read_csv('graph/ACC.csv')
# df['Date']=pd.to_datetime(df['Date'])
df=df.head(100).loc[::-1].reset_index()
df=df.drop(columns=['index'])
df=df.rename(columns={'Date':'date','Open Price':'open',
                            'High Price':'high',
                            'Low Price':'low',
                            'Close Price':'close',
                            'Total Traded Quantity':'volume'})
dataTransfer.Data(df,'candle')
sys.stdout.flush()

