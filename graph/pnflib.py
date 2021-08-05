# coding: utf-8

# для совместимости с версией 3
from __future__ import (absolute_import, division,
                       print_function, unicode_literals)
from builtins import *

import matplotlib.pyplot as plt
# plt.rc('figure', figsize=(15, 15))
import pandas as pd
import numpy as np
from math import floor

class Point_and_Figure():
    def __init__(self):        
        self.box_size = 1000.     
        self.boxes_to_reverse = 3 
        self.boxes = [] 
        self.levels = np.zeros(1)
        self.start_point_graph = 0. 
        self.scale_factor = 1.
        self.bokeh_picture = None
        self.x_x = []
        self.x_y = []
        self.o_x = []
        self.o_y = []
        self.d = []
        self.digits_x = []
        self.digits_y = []
        self.digits_text = []
        self.xticks = None
        self.yticks = None
        self.grid_divider = 50.
        self.asset_ticker = 'SPFB.RTS'
        self.bokeh_ticks_format = '0,0'
        self.digits_on_graph_format = '0:.0f'
        
    
    def prepare_datasource(self):

        BOX = self.box_size
        START = self.start_point_graph
        self.yticks = set([START, START + BOX, START - BOX])
        self.xticks = set([])
        changes = self.boxes
        
        def sign(val):
            return val / abs(val)

        chgStart = START
        self.x_x = []
        self.x_y = []
        self.o_x = []
        self.o_y = []
        self.digits_x = []
        self.digits_y = []   
        self.digits_text = [] 
        for ichg, chg in enumerate(changes):  
            if chg == 0:
                print('zero changes!')
                continue
            direction = int(sign(chg))
            abs_change = abs(chg)
            #abs_change = abs(chg) + 1
            if direction < 0:
                pass
                #abs_change = abs_change - 1                        
            
            x = [ichg + 1] * abs_change
            self.xticks = self.xticks.union(x)
            x = [value - 0.5 for value in x]
            
            if direction > 0:
                y = [chgStart + (i + 1) * BOX * direction for i in range(abs_change)]
            else:
                y = [chgStart + (i + 1) * BOX * direction for i in range(abs_change)]
                
            self.yticks = self.yticks.union(y)
            y = [value + 0.5 * BOX for value in y]
                     
            if direction < 0:
                pass                  
            chgStart += BOX * direction * (abs_change)
            if direction == -1:
                self.o_x += x
                self.o_y += y
            elif direction == 1:
                self.x_x += x
                self.x_y += y
            
            if len(self.x_x) > 0:
                last_x = self.x_x[-1]
            else:
                last_x = 0
            if len(self.o_x) > 0:
                last_o = self.o_x[-1]
            else:
                last_o = 0            
            if last_x > last_o:
                max_x = last_x
            else:
                max_x = last_o
            
        for tick in self.yticks:
            self.digits_x.append(max_x + 1 / 2)
            self.digits_y.append(tick - self.box_size)
            self.digits_text.append(('{' + self.digits_on_graph_format + '}').format(tick))
            
            self.digits_x.append(max_x + 2)
            self.digits_y.append(tick - self.box_size)
            self.digits_text.append('')  

    def process_df(self, quote):
        H = quote[self.asset_ticker + '_High'].values
        L = quote[self.asset_ticker + '_Low'].values
        C = quote[self.asset_ticker + '_Close'].values
        O = quote[self.asset_ticker + '_Open'].values 
        self.process(O, H, L, C)    

    def process(self, O, H, L, C,D):
        self.grid_divider = self.box_size
        self.boxes = []
        last_box_level = 0
        direction = 0 
        start_point = 0.
        box_size = self.box_size
        boxes_to_reverse = self.boxes_to_reverse
        data_length = H.shape[0]
        self.levels = np.zeros(data_length)
        opposite_boxes = 0.
        for i in range(data_length):           
            if direction == 0:
                if C[i] > O[i]:
                    direction = 1
                    start_point = (floor(L[i] / self.grid_divider)) * self.grid_divider
                    extremum = H[i]
                else:
                    direction = -1
                    start_point = (floor(H[i] / self.grid_divider)) * self.grid_divider
                    extremum = L[i]
                distance_from_start = direction * (extremum - start_point)
                boxes_from_start = int(floor(distance_from_start / box_size))
                self.start_point_graph = start_point
                last_box_level = start_point + direction * boxes_from_start * box_size
                boxes = direction * boxes_from_start
                self.boxes.append(boxes)
                self.d.append(D[i])
            elif direction == 1 or direction == -1:
                new_last_box_level = -1.
                if direction == 1:
                    continue_level = H[i]
                    opposite_level = L[i]
                    sign = 1
                else:
                    continue_level = L[i]
                    opposite_level = H[i]
                    sign = -1
                if sign * (continue_level - last_box_level) >= box_size:
                    distance_from_start = (continue_level - start_point)
                    boxes_from_start = int(floor(distance_from_start / box_size))
                    new_last_box_level = start_point + boxes_from_start * box_size
                opposite_distance = sign * (last_box_level - opposite_level)        
                opposite_boxes = int(floor(opposite_distance / box_size))
                if opposite_boxes >= boxes_to_reverse and new_last_box_level < 0:                    
                    direction = - direction
                    self.boxes.append(direction * (opposite_boxes))
                    self.d.append(D[i])
                    start_point = last_box_level
                    last_box_level = start_point + direction * opposite_boxes * box_size
                elif new_last_box_level > 0:
                    last_box_level = new_last_box_level
                    self.boxes[-1] = boxes_from_start
            self.levels[i] = last_box_level