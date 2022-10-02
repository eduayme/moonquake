# -*- coding: utf-8 -*-
"""
Created on Sat Oct  1 14:15:23 2022

@author: Gibrán Farid Majul Villarreal
"""

#%% Packages 

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import random
from datetime import datetime
import math

#%%

datos_naka = pd.read_csv("levent.1008weber.csv")

datos_naka_matrix = np.array(datos_naka)

#%%

# plt.grid()
# plt.plot(datos_naka_matrix[:,0], datos_naka_matrix[:,1], '.', color='blue', alpha = 0.2)
# plt.xticks(fontsize = 15)
# plt.yticks(fontsize = 15)
# plt.xlabel('Año')
# plt.ylabel('Día')
# plt.title("Moonquakes")
# plt.show

#%%

datos_gnp = pd.read_csv("gagnepian_2006_catalog.csv")

datos_gnp_matrix = np.array(datos_gnp)


#%%
r_moon = 0.02
new_data_matrix=np.zeros(np.shape(datos_gnp_matrix[:,:12]))
for x,n in enumerate(datos_gnp_matrix[:,4]):
    for y,m in enumerate(datos_naka_matrix[:,0]):
        day_num = str(datos_naka_matrix[y,1])
        day_num.rjust(3 + len(day_num), '0')
        res1= str(n)[:6]
        res2= datetime.strptime("19"+ str(m) + "-" + day_num, "%Y-%j").strftime("%Y%m%d")[2:]
        if res1 == res2:
            new_data_matrix[x,0] = "19" + res1 #date
            v = datos_naka_matrix[y,4:8]
            for z,o in enumerate(v):
                if str(o) == "nan":
                    v[z] = 0
            print(v)
            new_data_matrix[x,1] = np.max(np.abs(v)) #amplitude in abs
            new_data_matrix[x,2] = datos_gnp_matrix[x,1] #latitude
            new_data_matrix[x,3] = datos_gnp_matrix[x,2] #longitude
            new_data_matrix[x,4] = datos_gnp_matrix[x,3] #depth
            if str(datos_gnp_matrix[x,0])[0] == "S":
                new_data_matrix[x,5] = 0 #class superficial
            elif str(datos_gnp_matrix[x,0])[0] == "M":
                new_data_matrix[x,5] = 1 #class meteorite
            elif str(datos_gnp_matrix[x,0])[0] == "A":
                new_data_matrix[x,5] = 2 #class deep
            else: new_data_matrix[x,5] = 3 #class artificial
            new_data_matrix[x,6] = r_moon*math.cos(math.radians(datos_gnp_matrix[x,1]))*math.cos(math.radians(datos_gnp_matrix[x,2])) #X_coord
            new_data_matrix[x,7] = r_moon*math.cos(math.radians(datos_gnp_matrix[x,1]))*math.sin(math.radians(datos_gnp_matrix[x,2])) #Y_coord
            new_data_matrix[x,8] = r_moon*math.sin(math.radians(datos_gnp_matrix[x,1])) #Z_coord
            new_data_matrix[x,9] = datos_naka_matrix[y,2] #start
            new_data_matrix[x,10] = datos_naka_matrix[y,3] #finish
            if datos_naka_matrix[y,2] < datos_naka_matrix[y,3]:
                new_data_matrix[x,11] = datos_naka_matrix[y,2] - datos_naka_matrix[y,3]
            else: new_data_matrix[x,11] = 00000
            

new_data = pd.DataFrame(new_data_matrix)

new_data.columns = ["Date YYYYMMDD", "Amplitude", "Latitude", "Longitude", "Depth (unused)", "Class", "X_coord", "Y_coord", "Z_coord", "start", "finish", "duration"]

new_data.to_json("datos.json")


