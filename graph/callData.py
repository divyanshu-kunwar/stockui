import dataTransfer
import pandas as pd
import sys , json

# read incoming message from javascript i.e name of graph
message_in = sys.stdin.readlines()
message_in = json.loads(message_in[0])
df =pd.read_csv('graph/ACC.csv')
# df['Date']=pd.to_datetime(df['Date'])
df=df.loc[::-1].reset_index()
df=df.drop(columns=['index'])
df=df.rename(columns={'Date':'date','Open Price':'open',
                            'High Price':'high',
                            'Low Price':'low',
                            'Close Price':'close',
                            'Total Traded Quantity':'volume'})

#create a data transfer object of graph type message in
dataTransfer.Data(df,message_in)

sys.stdout.flush()

