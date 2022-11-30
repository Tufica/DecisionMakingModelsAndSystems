import matplotlib.pyplot as plt
import math
import pandas as pd

f=open("data_Htable.txt")
p=pd.read_csv(f,delimiter=" ")
x=p.pop('h').to_list()
plt.plot(x,p)
plt.xticks(x)
plt.legend(list(p.columns.values))
plt.grid()
plt.savefig('wykres')