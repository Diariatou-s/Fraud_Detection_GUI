import joblib
import sys
import json
import numpy as np
import pandas as pd
import warnings
import os
import statistics

# Ne pas afficher les warnings
warnings.filterwarnings("ignore")

# Chargement des modèles et du scaler
modele_xgb = joblib.load(os.path.abspath("ml_models/modele_xgb.pkl"))
modele_rf = joblib.load(os.path.abspath("ml_models/modele_rf.pkl"))
modele_lgbm = joblib.load(os.path.abspath("ml_models/modele_lgbm.pkl"))
modele_hard = joblib.load(os.path.abspath("ml_models/modele_hard.pkl"))
modele_soft = joblib.load(os.path.abspath("ml_models/modele_soft.pkl"))
scaler = joblib.load(os.path.abspath("ml_models/scaler.pkl"))

# Récupérer l'input donné comme argument
data = sys.argv[1]

# En faire un élément JSON valide
json_data = json.loads(data)

# Creation du dataframe sans la colonne type pour le scaler
df_data = pd.DataFrame({"step":[json_data['step']],"amount":[json_data['amount']],"oldbalanceOrg":[json_data['oldbalanceOrg']],"newbalanceOrig":[json_data['newbalanceOrg']],"oldbalanceDest":[json_data['oldbalanceDest']],"newbalanceDest":[json_data['newbalanceDest']]})

# Scale des données avec le scaler utilisé pour l'entrainement
scaled_data = scaler.transform(df_data)

# Rajout de la colonne type dans l'array numpy des données scaled
np_arr_data = np.array([np.insert(scaled_data, 1, json_data['type'])])

# Créaction de la liste avec les predictions, probabilité de non fraude et probabilité de fraude de tous les modèles et des predictions seules des modèles de hard voting et de soft voting
predicts = [int(modele_rf.predict(np_arr_data)[0]), int(modele_xgb.predict(np_arr_data)[0]), int(modele_lgbm.predict(np_arr_data)[0]), int(modele_hard.predict(np_arr_data)[0]), int(modele_soft.predict(np_arr_data)[0])]

# Affichage du dictionnaire mis dans un format JSON valide
print(json.dumps(statistics.mode(predicts)))
