import json
import os
import sqlite3

import matplotlib
import matplotlib.pyplot as plt

matplotlib.use('agg')

dirname = os.path.dirname(__file__)
image = os.path.join(dirname, '../assets/images/graphMessages.png')
dbPath = os.path.join(dirname, './db/enmap.sqlite')
db = sqlite3.connect(dbPath)
data = db.execute('select * from messages').fetchall()

plt.style.use('dark_background')
plt.plot(json.loads(data[1][1]), "#4b5afd")
plt.ylabel('nombre de commandes utilisées')
plt.xlabel('nombre de jours')
plt.savefig(image)
