

class Data:
    def __init__(self , df=None , graphtype="candle"):
        self.df = df
        self.graphtype = graphtype
        self.cal_data()
    def cal_data(self):
        if self.graphtype=='bars':
            self.bars()
        elif self.graphtype=='candle':
            self.candle()



    def bars(self):
        self.df['color'] = 'r'
        x = len(self.df)
        for i in range(0,x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = 'g' 
            else:
                self.df['color'][i] = 'r'
        self.send_data()
   
    def candle(self):
        self.df['color'] = 'r'
        x = len(self.df)
        for i in range(0,x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'  #green
            else:
                self.df['color'][i] = '#ff6960'  #red
        self.send_data()
    
    def send_data(self):
        print(self.df.to_json())
