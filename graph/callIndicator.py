import dataTransfer
import pandas as pd
import sys , json
import indicators


# read incoming message from javascript i.e name of graph
message_in = sys.stdin.readlines()
indicator_name = json.loads(message_in[0])['indicator_id']
data_all = json.loads(message_in[0])['data_to_send']
df=pd.DataFrame.from_dict(data_all)


# call indicator according to the name received and arguements received

if(indicator_name=="atr"):
    period = json.loads(message_in[0])['period']
    print(indicators.atr(df,period).to_json())
elif(indicator_name=="dema"):
    period = json.loads(message_in[0])['period']
    column = json.loads(message_in[0])['column']
    print(indicators.dema(df,period,column).to_json())
elif(indicator_name=="ema"):
    period = json.loads(message_in[0])['period']
    column = json.loads(message_in[0])['column']
    print(indicators.ema(df,period,column).to_json())
elif(indicator_name=="er"):
    print("er_selected")
elif(indicator_name=="evwma"):
    print("evwma_selected")
elif(indicator_name=="ev_macd"):
    print("ev_macd_selected")
elif(indicator_name=="frama"):
    print("frama_selected")
elif(indicator_name=="hma"):
    print("hma_selected")
elif(indicator_name=="kama"):
    print("kama_selected")
elif(indicator_name=="macd"):
    print("macd_selected")
elif(indicator_name=="mom"):
    print("mom_selected")
elif(indicator_name=="pivot_camarilla"):
    print("pivot_camarilla_selected")
elif(indicator_name=="pivot_classic"):
    print("pivot_classic_selected")
elif(indicator_name=="pivot_demark"):
    print("pivot_demark_selected")
elif(indicator_name=="pivot_fibonacci"):
    print("pivot_fibonacci_selected")
elif(indicator_name=="pivot_traditional"):
    print("pivot_traditional_selected")
elif(indicator_name=="pivot_woodie"):
    print("pivot_woodie_selected")
elif(indicator_name=="ppo"):
    print("ppo_selected")
elif(indicator_name=="rsi"):
    print("rsi_selected")
elif(indicator_name=="roc"):
    print("roc_selected")
elif(indicator_name=="sma"):
    print("sma_selected")
elif(indicator_name=="smm"):
    print("smm_selected")
elif(indicator_name=="ssma"):
    print("ssma_selected")
elif(indicator_name=="tema"):
    print("tema_selected")
elif(indicator_name=="tp"):
    print("tp_selected")
elif(indicator_name=="tr"):
    print("tr_selected")
elif(indicator_name=="tma"):
    print("tma_selected")
elif(indicator_name=="trix"):
    print("trix_selected")
elif(indicator_name=="vama"):
    print("vama_selected")
elif(indicator_name=="vwap"):
    print("vwap_selected")
elif(indicator_name=="vw_macd"):
    print("vw_macd_selected")
elif(indicator_name=="vwma"):
    print("vwma_selected")
elif(indicator_name=="wma"):
    print("wma_selected")
elif(indicator_name=="zlema"):
    print("zlema_selected")