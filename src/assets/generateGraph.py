import json
import os

import matplotlib
import matplotlib.pyplot as plt

matplotlib.use('agg')

dirname = os.path.dirname(__file__)
image = os.path.join(dirname, '../assets/images/graphMessages.png')
jsonPath = os.path.join(dirname, '../assets/jsons/messages.json')

with open(jsonPath, "r") as f:
    data = json.loads(f.read())

plt.style.use('dark_background')
plt.plot(data["stats"], "#4b5afd")
plt.ylabel('nombre de commandes utilisées')
plt.xlabel('nombre de jours')
plt.savefig(image)
