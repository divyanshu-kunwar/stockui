import dataTransfer
import pandas as pd
import sys , json
import sqlalchemy
import pymysql
import mysql.connector


# read incoming message from javascript i.e name of graph
message_in = sys.stdin.readlines()
graph_type = json.loads(message_in[0])['graphName']
company_name = json.loads(message_in[0])['companyName']
exchange_name = json.loads(message_in[0])['exchangeName']

# Get data From SQL
engine = sqlalchemy.create_engine('mysql+pymysql://root:vishal@127.0.0.1:3306/bse')

# SQL database [ currently used locally ] contains data daily data from nse and bse exchange
df = pd.read_sql("select Date as date,open,high,low,close,volume FROM "+exchange_name+"."+company_name+" order by date asc", engine)
print(df.to_json())
df['date'] = pd.to_datetime(df['date']).dt.strftime("%d-%b-%y")

# Get data from csv
# df=pd.read_csv("graph/acc.csv")
# df = df.loc[::-1].reset_index()
# df = df.drop(columns=['index'])

# create a data transfer object of graph type message in
dataTransfer.Data(df,graph_type)

sys.stdout.flush()

