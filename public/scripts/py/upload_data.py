import joblib
import sys
import json
import numpy as np
import pandas as pd
import warnings
import os

# Ne pas afficher les warnings
warnings.filterwarnings("ignore")

# Chargement des modèles et du scaler
modele_xgb = joblib.load(os.path.abspath("public/models/modele_xgb.pkl"))
modele_rf = joblib.load(os.path.abspath("public/models/modele_rf.pkl"))
modele_lgbm = joblib.load(os.path.abspath("public/models/modele_lgbm.pkl"))
modele_hard = joblib.load(os.path.abspath("public/models/modele_hard.pkl"))
modele_soft = joblib.load(os.path.abspath("public/models/modele_soft.pkl"))
scaler = joblib.load(os.path.abspath("public/models/scaler.pkl"))

# Récupérer le fichier donné comme argument
file = sys.argv[1]

# Chargement des données dans une dataframes pandas
raw_data = pd.read_csv(file)
data = pd.read_csv(file)

# Encodage de la variable type
data['type'] = pd.get_dummies(data['type'],drop_first=True)

# Scale des données de toutes les colonnes sauf celles de la colonne type avec le scaler utilisé pour entrainer le modèle
data[['step','amount','oldbalanceOrg','newbalanceOrig','oldbalanceDest','newbalanceDest']] = scaler.transform(data[['step','amount','oldbalanceOrg','newbalanceOrig','oldbalanceDest','newbalanceDest']])

# Création d'un dataframe avec les predictions, probabilités de non fraude et probabilités des fraude des différents modèles et des predictions des modèles de hard voting et de soft voting
predictions = pd.DataFrame({
    'xgb_pred': modele_xgb.predict(data),
    'xgb_proba_nfraud': np.round(modele_xgb.predict_proba(data)[0][0], decimals=2)*100,
    'xgb_proba_fraud': np.round(modele_xgb.predict_proba(data)[0][1], decimals=2)*100,
    'rf_pred': modele_rf.predict(data),
    'rf_proba_nfraud': np.round(modele_rf.predict_proba(data)[0][0], decimals=2)*100,
    'rf_proba_fraud': np.round(modele_rf.predict_proba(data)[0][1], decimals=2)*100,
    'lgbm_pred': modele_lgbm.predict(data),
    'lgbm_proba_nfraud': np.round(modele_lgbm.predict_proba(data)[0][0], decimals=2)*100,
    'lgbm_proba_fraud': np.round(modele_lgbm.predict_proba(data)[0][1], decimals=2)*100,
    'hard_pred': modele_hard.predict(data),
    'soft_pred': modele_soft.predict(data),
})

# Fonction pour convertir les données de la colonne step en jour et heure
def split_step(row):
    day = row // 24 + 1
    hour = (row % 24) - 1
    if hour < 0:
        day -= 1
        hour += 24
    return pd.Series([day, hour], index=['day', 'hour'])

# Insertion de deux nouvelles colonnes jour et heure et application la fonction split_step sur la colonne step
raw_data[['day', 'hour']] = raw_data['step'].apply(split_step)
raw_data.drop(columns=['step'],inplace=True)

# Concaténation du dataframe des données brutes et des données des différents modèles
df = pd.concat([raw_data, predictions], axis=1)

# Affichage du dictionnaire fait à partir du dataframe dans un format JSON valide
print(json.dumps(df.to_dict(orient='records')))