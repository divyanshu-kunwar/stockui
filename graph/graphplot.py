from __future__ import (absolute_import, division, print_function,
                        unicode_literals)
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.lines import TICKLEFT, TICKRIGHT, Line2D
from matplotlib.patches import Rectangle
import xml.etree.ElementTree as ET
from io import BytesIO
import pandas as pd
from matplotlib import colors as mcolors
from matplotlib.collections import LineCollection, PolyCollection
from matplotlib.transforms import Affine2D
from six.moves import xrange, zip
import scipy.optimize as opt
from sklearn.utils import resample
import datetime as dt
from dateutil.relativedelta import relativedelta
from svg2mpl import parse_path
import renkolib 
import linebreaklib
import kagilib
import pnflib


ET.register_namespace("", "http://www.w3.org/2000/svg")

class graph:
    fig = ""
    ax = ""
    x = ""
    def __init__(self ,df=None, type_='candle',indicators=None,volume=None):
        self.df = df
        self.type_ = type_
        self.indicators = indicators
        self.volume = volume
        self.drawGraph()
                   
    def drawGraph(self):
        self.fig, self.ax = plt.subplots(1, figsize=(18,8))
        self.x=np.arange(0,len(self.df))
        if(self.type_=="candle"):
            self.candlestick()
        elif(self.type_=="heikinashi"):
            self.hekinashi()
        elif(self.type_=="bars"):
            self.bars()
        elif(self.type_=="line"):
            self.line()
        elif(self.type_=="area"):
            self.area()
        elif(self.type_=="baseline"):
            self.baseline()
        elif(self.type_=="renko"):
            self.renko()
        elif(self.type_=="linebreak"):
            self.linebreak()
        elif(self.type_=="kagi"):
            self.kagi()
        elif(self.type_=="pnf"):
            self.pnf()
        elif(self.type_=="hollowcandle"):
            self.hollowcandle()





    def candlestick(self):
        lines = []
        patches = []
        for i in self.x:
            if self.df['close'][i] >=self.df['open'][i]:
                color = 'g'
                lower = self.df['open'][i]
                height = self.df['close'][i] - self.df['open'][i]
            else:
                color = 'r'
                lower = self.df['close'][i]
                height = self.df['open'][i] - self.df['close'][i]

            vline = Line2D(xdata=(i, i), ydata=(self.df['low'][i],self.df['high'][i]),color=color)

            rect = Rectangle(xy=(i-0.3,lower),width=0.6,height=height,facecolor=color,edgecolor='k')
            rect.set_alpha(alpha=1.0)

            lines.append(vline)
            patches.append(rect)
            self.ax.add_line(vline)
            self.ax.add_patch(rect)

        self.labels_plot()


    def hollowcandle(self):
        self.x=np.arange(1,len(self.df))
        for i in self.x:
            if(self.df['close'][i]>self.df['open'][i]):
                if(self.df['close'][i]>self.df['close'][i-1]):
                    color ="w"
                    edgecolor="g"
                else:
                    color="w"
                    edgecolor="r"
                lower = self.df['open'][i]
                height = self.df['close'][i] - self.df['open'][i]
            else:
                if(self.df['close'][i]>self.df['close'][i-1]):
                    color="g"
                    edgecolor="g"
                else:
                    color="r"
                    edgecolor="r"
                lower = self.df['close'][i]
                height = self.df['open'][i] - self.df['close'][i]

            
            vline = Line2D(xdata=(i, i), ydata=(self.df['low'][i],self.df['high'][i]),color=edgecolor,zorder=1)
            rect = Rectangle(xy=(i-0.4,lower),width=0.8,height=height,facecolor=color,edgecolor=edgecolor,alpha=1,zorder=3)
            self.ax.add_line(vline)
            self.ax.add_patch(rect)
        self.labels_plot()
           

    def hekinashi(self):
        self.df['ha_open'] = 0.0
        self.df['ha_high'] = 0.0
        self.df['ha_low'] = 0.0
        self.df['ha_close'] = 0.0
        
        for i in self.x:
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
        
        lines = []
        patches = []

        for i in self.x:
            if self.df['ha_close'][i] >= self.df['ha_open'][i]:
                color = 'g'
                lower = self.df['ha_open'][i]
                height = self.df['ha_close'][i] - self.df['ha_open'][i]
            else:
                color = 'r'
                lower = self.df['ha_close'][i]
                height = self.df['ha_open'][i] - self.df['ha_close'][i]

            vline = Line2D(xdata=(i, i), ydata=(self.df['low'][i],self.df['high'][i]),color=color)

            rect = Rectangle(xy=(i-0.3,lower),width=0.6,height=height,facecolor=color,edgecolor='k')
            rect.set_alpha(alpha=1.0)

            lines.append(vline)
            patches.append(rect)
            self.ax.add_line(vline)
            self.ax.add_patch(rect)

        self.labels_plot()

    def bars(self):
        lines = []
        for i in self.x:
            if self.df['close'][i] >=self.df['open'][i]:
                color = 'g'
            else:
                color = 'r'
            
            vline = Line2D(xdata=(i, i), ydata=(self.df['low'][i],self.df['high'][i]),color=color)
            oline = Line2D(xdata=(i, i), ydata=(self.df['open'][i], self.df['open'][i]),color=color,marker=TICKLEFT,markersize=3)
            cline = Line2D(xdata=(i, i), ydata=(self.df['close'][i], self.df['close'][i]),color=color,markersize=3,marker=TICKRIGHT)

            lines.extend((vline, oline, cline))
            self.ax.add_line(vline)
            self.ax.add_line(oline)
            self.ax.add_line(cline)

        self.labels_plot()

    def line(self):
        plt.plot(self.x,self.df['close'])
        self.labels_plot()

    def area(self):
        plt.plot(self.x,self.df['close'])
        y_min, y_max = self.ax.get_ylim()
        self.ax.fill_between(self.x,self.df['close'],y_min,alpha=0.2)
        self.labels_plot()

    def baseline(self):
        plt.plot(self.x,self.df['close'])
        y_min, y_max = self.ax.get_ylim()
        x_min, x_max = self.ax.get_xlim()
        baseline = (y_min+y_max)/2
        baselineX = Line2D((x_min,x_max),(baseline,baseline))   
        self.ax.add_line(baselineX)
        self.labels_plot()

    def renko(self):
        # Get optimal brick size based
        optimal_brick = renkolib.renko().set_brick_size(
            auto = True, HLC_history = self.df[["high", "low", "close"]])
        print(optimal_brick)
        # Build Renko chart
        renko_obj_atr = renkolib.renko()
        renko_obj_atr.set_brick_size(auto = False, brick_size = optimal_brick)
        renko_obj_atr.build_history(prices = self.df["close"], dates = self.df["date"])
        if len(renko_obj_atr.get_renko_prices()) > 1:
            renko_obj_atr.plot_renko()
            self.labels_plot()

    def linebreak(self):
        data_ = self.df = linebreaklib.linebreak(self.df)
        self.x= np.arange(0,len(data_))

        for i in self.x:
            if(data_['lbclose'][i]>data_['lbopen'][i]):
                color='g'
                lower=data_['lbopen'][i]
                height=data_['lbclose'][i]-data_['lbopen'][i]
            else:
                color='r'
                lower=data_['lbclose'][i]
                height=data_['lbopen'][i]-data_['lbclose'][i]

            self.ax.add_patch(Rectangle((i-0.5,lower),width=1.0,height=height,facecolor=color))
        self.labels_plot()
    
    def kagi(self):
        data = self.df = kagilib.kagi(self.df)
        self.x=np.arange(1,len(data))
        width = {"g":1.5,"r":1}
        for i in self.x:
            if data['kc'][i] >data['ko'][i]:
                lower = data['ko'][i]
            else:
                lower = data['kc'][i]
                
            if((data['height'][i]>data['height'][i-1]) and data['kc'][i] >data['ko'][i-1]):
                vline1 = Line2D(xdata=(i, i), ydata=(lower,(lower+data['height'][i-1])),color=data["color"][i-1],lw=width[data["color"][i-1]])
                vline2 = Line2D(xdata=(i, i), ydata=((lower+data['height'][i-1]),(lower+data['height'][i])),color=data["color"][i],lw=width[data["color"][i]])
                self.ax.add_line(vline1)
                self.ax.add_line(vline2)
            elif((data['height'][i]>data['height'][i-1]) and data['kc'][i] <data['ko'][i-1]):
                vline1 = Line2D(xdata=(i, i), ydata=((lower+data['height'][i]-data['height'][i-1]),(lower+data['height'][i])),color=data["color"][i-1],lw=width[data["color"][i-1]])
                vline2 = Line2D(xdata=(i, i), ydata=(lower,(lower+data['height'][i]-data['height'][i-1])),color=data["color"][i],lw=width[data["color"][i]])
                self.ax.add_line(vline1)
                self.ax.add_line(vline2)
            else:
                vline = Line2D(xdata=(i, i), ydata=(lower,(lower+data['height'][i])),color=data["color"][i-1],lw=width[data["color"][i-1]])
                data["color"][i] = data["color"][i-1]
                self.ax.add_line(vline)
            hline = Line2D(xdata=((i-1), i), ydata=(data['kc'][i-1],data['ko'][i]),color=data["color"][i-1],lw=width[data["color"][i-1]])
            self.ax.add_line(hline)

        self.labels_plot()

    def pnf(self):
        kagi_break = renkolib.renko().set_brick_size(auto = True, HLC_history = self.df[["high", "low", "close"]])
        pf = pnflib.Point_and_Figure()
        pf.box_size = kagi_break
        pf.process(self.df['open'], self.df["high"], self.df["low"], self.df['close'],self.df['date'])
        pf.prepare_datasource()
        oval = parse_path("""M40 40C40 62.0914 31.0457 80 20 80C8.95431 80 0 62.0914 0 40C0 17.9086 8.95431 0 20 0C31.0457 0 40 17.9086 40 40Z""")
        cross = parse_path("""M1.58258 1L30.4174 48M1 47.0873L31 1.91272""")
        oval.vertices -= oval.vertices.mean(axis=0)
        cross.vertices -= cross.vertices.mean(axis=0)
        # self.ax = self.fig.add_axes([.15, .15, .7, .7])
        self.ax.yaxis.get_major_formatter().set_useOffset(False)
        plt.ticklabel_format(style='plain', axis='y')

        symbol = {-1:oval,
                   1:cross}
        self.ax.scatter(pf.x_x, pf.x_y,
                   marker=symbol[1],
                   s=100,edgecolor='g')   #<----- control size of scatter symbol
        self.ax.scatter(pf.o_x, pf.o_y,
                   marker=symbol[-1],
                   s=100,edgecolor='r',facecolor="w")   #<----- control size of scatter symbol

        self.ax.set_xlim(0, len(pf.xticks)+1)
        self.x = list(pf.xticks)
        self.df = pd.DataFrame(pf.d,columns=["date"])
        self.labels_plot()

   
    def labels_plot(self):
        if(self.type_ != "renko"):
            self.ax.autoscale_view()

            # ticks top plot
            self.ax.set_xticks(self.x[::5])
            self.ax.set_xticklabels(self.df['date'].dt.date[::5])
            # self.ax.invert_xaxis()
            self.ax.yaxis.tick_right()
        

            #line pointer
            crosslineX = Line2D((0,1),(0.5,0.5),linestyle="--",color="k",alpha=0.5,linewidth=0.7)
            crosslineY = Line2D((0.5,0.5),(0,1),linestyle="--",color="k",alpha=0.5,linewidth=0.7)
            self.fig.add_artist(crosslineX)
            self.fig.add_artist(crosslineY)
            crosslineX.set_gid('crosslineX')
            crosslineY.set_gid('crosslineY')

            # labels
            self.ax.yaxis.set_label_position("right")
            self.ax.set_ylabel('Price\n (rupees)',color='k',fontsize=10)
            self.ax.set_xlabel('Date',color='k',fontsize=10)

            # grid

            self.ax.xaxis.grid(color='g',  alpha=0.15)
            self.ax.yaxis.grid(color='g',  alpha=0.15)
            
            # remove spines
            self.ax.spines['left'].set_visible(False)
            self.ax.spines['top'].set_visible(False)

            # title
            self.ax.set_title('ACC Stock Price\n', loc='center', fontsize=20)
        f = BytesIO()
        plt.savefig(f,format="svg")
        tree , xmlid = ET.XMLID(f.getvalue())
        ET.ElementTree(tree).write('graph/demo.svg')
        # plt.show()

        