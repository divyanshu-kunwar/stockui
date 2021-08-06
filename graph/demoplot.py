import sys,json
from graphplot import graph
import pandas as pd

data = sys.stdin.readlines()
data = json.loads(data[0])
df =pd.read_csv('graph/ACC.csv')
df['Date']=pd.to_datetime(df['Date'])
df=df.head(200).loc[::-1].reset_index()
df=df.drop(columns=['index'])
df=df.rename(columns={'Date':'date','Open Price':'open',
                            'High Price':'high',
                            'Low Price':'low',
                            'Close Price':'close',
                            'Total Traded Quantity':'volume'})
print(data)
sys.stdout.flush()
graph(df,data)