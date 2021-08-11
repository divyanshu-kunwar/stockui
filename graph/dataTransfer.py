import pandas as pd
import renkolib
import atrlib
import linebreaklib

class Data:
    def __init__(self , df=None , graphtype="candle"):
        self.df = df
        self.graphtype = graphtype
        self.x = len(self.df)
        self.cal_data()
    
    
    def cal_data(self):
        if self.graphtype=='bars':
            self.bars()
        elif self.graphtype=='candle':
            self.candle()
        elif self.graphtype=='hollowcandle':
            self.hollowcandle()
        elif self.graphtype=='heikinashi':
            self.heikinashi()
        elif self.graphtype=='line':
            self.line()
        elif self.graphtype=='area':
            self.line()
        elif self.graphtype=='baseline':
            self.line()
        elif self.graphtype=='renko':
            self.renko()
        elif self.graphtype=='linebreak':
            self.linebreak()




    def bars(self):
        self.df['color'] = 'r'
       
        for i in range(0,self.x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'     #green
            else:
                self.df['color'][i] = '#ff6960'     #red
        self.send_data()
   
    def candle(self):
        self.df['color'] = 'r'
    
        for i in range(0,self.x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'  #green
            else:
                self.df['color'][i] = '#ff6960'  #red
        self.send_data()
    

    def hollowcandle(self):

        self.df['color']='r'
        self.df['stroke']='r'
        
        for i in range(0,self.x):
            if i==0:
                if(self.df['close'][i]>self.df['open'][i]):
                    self.df['color'][i]="#00ca73"  #green
                    self.df['stroke'][i]="#00ca73"  #green
                else:
                    self.df['color'][i]='#ff6960'  #red
                    self.df['stroke'][i]='#ff6960'  #red


            elif(self.df['close'][i]>self.df['open'][i]):
                if(self.df['close'][i]>self.df['close'][i-1]):
                    self.df['color'][i]='#ffffff'  #white
                    self.df['stroke'][i]="#00ca73"  #green
                else:
                    self.df['color'][i]='#ffffff'  #white
                    self.df['stroke'][i]='#ff6960'  #red
            else:
                if(self.df['close'][i]>self.df['close'][i-1]):
                    self.df['color'][i]="#00ca73"  #green
                    self.df['stroke'][i]="#00ca73"  #green
                else:
                    self.df['color'][i]='#ff6960'  #red
                    self.df['stroke'][i]='#ff6960'  #red
        self.send_data()
                
    def heikinashi(self):
        self.df['ha_open'] = 0.0
        self.df['ha_high'] = 0.0
        self.df['ha_low'] = 0.0
        self.df['ha_close'] = 0.0
        
        for i in range(0,self.x):
            if(i==0):
                self.df['ha_open'][i] = self.df['open'][i]
                self.df['ha_close'][i] = self.df['close'][i]
                self.df['ha_low'][i]  = self.df['low'][i]
                self.df['ha_high'][i] = self.df['high'][i]
            else:
                self.df['ha_open'][i] = (self.df['ha_open'][i-1] + self.df['ha_close'][i-1])/2
                self.df['ha_close'][i] = (self.df['close'][i] + self.df['open'][i] + self.df['high'][i] + self.df['low'][i])/4
                self.df['ha_high'][i]  = max(self.df['close'][i] , self.df['open'][i] , self.df['high'][i])
                self.df['ha_low'][i] = min(self.df['close'][i] , self.df['open'][i] , self.df['low'][i])

        self.df = self.df.drop(columns=['open','close','low','high'])
        self.df = self.df.rename(columns={'ha_open':'open',
                            'ha_high':'high',
                            'ha_low':'low',
                            'ha_close':'close'})

        self.df['color'] = 'r'
        for i in range(0,self.x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'  #green
            else:
                self.df['color'][i] = '#ff6960'  #red
        self.send_data()

    def line(self):
        self.df['color'] = 'r'
       
        for i in range(0,self.x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'     #green
            else:
                self.df['color'][i] = '#ff6960'     #red
        self.send_data()
   
    def renko(self):
        
        # Get optimal brick size based
        optimal_brick = renkolib.renko().set_brick_size(
            auto = True, HLC_history = self.df[["high", "low", "close"]])
        # Build Renko chart
        renko_obj = renkolib.renko()
        renko_obj.set_brick_size(auto = False, brick_size = optimal_brick)
        dates_ = self.df[['date']]
        dates_ = dates_.loc[::-1].reset_index()
        renko_obj.build_history(prices = self.df["close"], dates = dates_["date"])
        

        self.x = range(0,len(renko_obj.renko_prices))
        self.df= pd.DataFrame(renko_obj.dates,columns=['date'])
        
        
        self.df['close'] = 0.0
        self.df['open'] = 0.0
        self.df['high'] = 0.0
        self.df['low'] = 0.0
        self.df['color'] = "r"
        bric_size = renko_obj.brick_size
        for i in self.x:
            if(renko_obj.renko_directions[i]==1):
                self.df['close'][i] = renko_obj.renko_prices[i]
                self.df['open'][i] = renko_obj.renko_prices[i] - bric_size
                self.df['high'][i] = renko_obj.renko_prices[i]
                self.df['low'][i] = renko_obj.renko_prices[i] - bric_size
                self.df['color'][i] = '#00ca73'         #green
                
            else:
                self.df['close'][i] = renko_obj.renko_prices[i]
                self.df['open'][i] = renko_obj.renko_prices[i] + bric_size
                self.df['high'][i] = renko_obj.renko_prices[i] + bric_size
                self.df['low'][i] = renko_obj.renko_prices[i]
                self.df['color'][i] = '#ff6960'         #red
                
        self.send_data()

    def linebreak(self):
        self.df = linebreaklib.linebreak(self.df)
        self.send_data()

    #tranfer data as json to changeGraph.js file
    def send_data(self):
        print(self.df.to_json())
