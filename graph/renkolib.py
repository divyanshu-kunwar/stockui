import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import atrlib

class renko:   
    fig = ""
    ax = ""   
    def __init__(self):
        self.source_prices = []
        self.renko_prices = []
        self.renko_directions = []
        self.dates = []
    
    # Setting brick size. Auto mode is preferred, it uses history
    def set_brick_size(self, HLC_history = None, auto = True, brick_size = 10.0):
        if auto == True:
            self.brick_size = self.__get_optimal_brick_size(HLC_history.iloc[:, [0, 1, 2]])
        else:
            self.brick_size = brick_size
        return self.brick_size
    
    def __renko_rule(self, last_price , dates_):
        # Get the gap between two prices
        gap_div = int(float(last_price - self.renko_prices[-1]) / self.brick_size)
        is_new_brick = False
        start_brick = 0
        num_new_bars = 0

        # When we have some gap in prices
        if gap_div != 0:
            # Forward any direction (up or down)
            if (gap_div > 0 and (self.renko_directions[-1] > 0 or self.renko_directions[-1] == 0)) or (gap_div < 0 and (self.renko_directions[-1] < 0 or self.renko_directions[-1] == 0)):
                num_new_bars = gap_div
                is_new_brick = True
                start_brick = 0
            # Backward direction (up -> down or down -> up)
            elif np.abs(gap_div) >= 2: # Should be double gap at least
                num_new_bars = gap_div
                num_new_bars -= np.sign(gap_div)
                start_brick = 2
                is_new_brick = True
                self.renko_prices.append(self.renko_prices[-1] + 2 * self.brick_size * np.sign(gap_div))
                self.renko_directions.append(np.sign(gap_div))
                self.dates.insert(0,dates_)
            #else:
                #num_new_bars = 0

            if is_new_brick:
                # Add each brick
                for d in range(start_brick, np.abs(gap_div)):
                    self.renko_prices.append(self.renko_prices[-1] + self.brick_size * np.sign(gap_div))
                    self.renko_directions.append(np.sign(gap_div))
                    self.dates.insert(0,dates_)
        
        return num_new_bars
                
    # Getting renko on history
    def build_history(self, prices , dates):
        if len(prices) > 0:
            # Init by start values
            self.source_prices = prices
            self.renko_prices.append(prices.iloc[0])
            self.renko_directions.append(0)
        
            # For each price in history
            i=0
            for p in self.source_prices[1:]:
                self.__renko_rule(p,dates[i])
                i = i+1
        
        return len(self.renko_prices)
    
    # Getting next renko value for last price
    def do_next(self, last_price):
        if len(self.renko_prices) == 0:
            self.source_prices.append(last_price)
            self.renko_prices.append(last_price)
            self.renko_directions.append(0)
            return 1
        else:
            self.source_prices.append(last_price)
            return self.__renko_rule(last_price)
    
    # Simple method to get optimal brick size based on ATR
    def __get_optimal_brick_size(self, HLC_history, atr_timeperiod = 14):
        brick_size = 0.0
        
        # If we have enough of data
        if HLC_history.shape[0] > atr_timeperiod:
            brick_size = np.median(atrlib.ATR(high = np.double(HLC_history.iloc[:, 0]), 
                                             low = np.double(HLC_history.iloc[:, 1]), 
                                             close = np.double(HLC_history.iloc[:, 2]), 
                                             timeperiod = atr_timeperiod)[atr_timeperiod:])
        
        return brick_size

    def evaluate(self, method = 'simple'):
        balance = 0
        sign_changes = 0
        price_ratio = len(self.source_prices) / len(self.renko_prices)

        if method == 'simple':
            for i in range(2, len(self.renko_directions)):
                if self.renko_directions[i] == self.renko_directions[i - 1]:
                    balance = balance + 1
                else:
                    balance = balance - 2
                    sign_changes = sign_changes + 1

            if sign_changes == 0:
                sign_changes = 1

            score = balance / sign_changes
            if score >= 0 and price_ratio >= 1:
                score = np.log(score + 1) * np.log(price_ratio)
            else:
                score = -1.0

            return {'balance': balance, 'sign_changes:': sign_changes, 
                    'price_ratio': price_ratio, 'score': score}
    
    def get_renko_prices(self):
        return self.renko_prices
    
    def get_renko_directions(self):
        return self.renko_directions
    
    def plot_renko(self, col_up = 'g', col_down = 'r'):
        self.fig, self.ax = plt.subplots(1, figsize=(20, 10))

        # Calculate the limits of axes
        self.ax.set_xlim(0.0, 
                    len(self.renko_prices) + 1.0)
        self.ax.set_ylim(np.min(self.renko_prices) - 3.0 * self.brick_size, 
                    np.max(self.renko_prices) + 3.0 * self.brick_size)

        self.ax.set_xticks(range(1, len(self.renko_prices))[::50])
        self.ax.set_xticklabels(self.dates[::50])
        
        # Plot each renko bar
        for i in range(1, len(self.renko_prices)):
            # Set basic params for patch rectangle
            col = col_up if self.renko_directions[i] == 1 else col_down
            x = i
            y = self.renko_prices[i] - self.brick_size if self.renko_directions[i] == 1 else self.renko_prices[i]
            height = self.brick_size
            # Draw bar with params
            self.ax.add_patch(
                patches.Rectangle(
                    (x, y),   # (x,y)
                    1.0,     # width
                    self.brick_size, # height
                    facecolor = col
                )
            )
        # title
        self.ax.set_title('ACC Stock Price\n', loc='center', fontsize=20)

        # CORRECT VIEW OF AXIS IN GRAPH
        self.ax.yaxis.tick_right()