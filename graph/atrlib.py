import numpy as np
import pandas as pd

def ATR(high,low,close):
    df = pd.DataFrame(high,columns=['h'])
    df['l'] = pd.DataFrame(low)
    df['c'] = pd.DataFrame(close)
    high_low = df['h'] - df['l']
    high_close = np.abs(df['h'] - df['c'].shift())
    low_close = np.abs(df['l'] - df['c'].shift())

    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)

    atr = true_range.rolling(14).sum()/14
    return atr