import renkolib
import linebreaklib
import kagilib
import pnflib

class Data:
    def __init__(self , df=None , graphtype="candle"):
        self.df = df
        self.graphtype = graphtype
        self.x = len(self.df)
        self.cal_data()
    
    
    def cal_data(self):
        if self.graphtype=='bars':
            self.color()
        elif self.graphtype=='candle':
            self.color()
        elif self.graphtype=='hollowcandle':
            self.hollowcandle()
        elif self.graphtype=='heikinashi':
            self.heikinashi()
        elif self.graphtype=='line':
            self.color()
        elif self.graphtype=='area':
            self.color()
        elif self.graphtype=='baseline':
            self.color()
        elif self.graphtype=='renko':
            self.renko()
        elif self.graphtype=='linebreak':
            self.linebreak()
        elif self.graphtype=='kagi':
            self.kagi()
        elif self.graphtype=='pnf':
            self.pnf()

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
        
                
    def heikinashi(self):
        self.df['close']=round((self.df['open']+self.df['high']+self.df['low']+self.df['close'])/4,2)
        for i in range(1,len(self.df)):
            self.df['open'][i]=round((self.df['open'][i-1]+self.df['close'][i-1])/2,2)
        self.df['low']=self.df[['open','close','low']].min(axis=1)
        self.df['high']=self.df[['open','close','high']].max(axis=1)

        self.df['color'] = 'r'
        self.color()
        
   
    def renko(self):
        self.df = renkolib.renko(self.df)
        self.x = len(self.df)
        self.color()
        
    
    def linebreak(self):
        self.df = linebreaklib.linebreak(self.df)
        self.x = len(self.df)
        self.color()
    
    def kagi(self):
        self.df = kagilib.kagi(self.df)
    
    def pnf(self):
        self.df = pnflib.pnf(self.df)
        

    #tranfer data as json to changeGraph.js file
    def send_data(self):
        print(self.df.to_json())

    def color(self):
        self.df['color'] = 'r'
       
        for i in range(0,self.x):
            if self.df['close'][i] >=self.df['open'][i]:
                self.df['color'][i] = '#00ca73'     #green
            else:
                self.df['color'][i] = '#ff6960'     #red