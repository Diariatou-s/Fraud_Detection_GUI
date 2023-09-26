const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Data = require('./models/data');
const methodOverride = require('method-override');
const path = require('path');
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
mongoose.connect('mongodb://localhost:27017/fraud_detection');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', require('ejs-mate'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let predictions = ""

// Route GET pour afficher la page d'accueil
app.get('/', (req, res) => {
    res.render('home')
});

// Route GET pour afficher la page l'insertion d'un enregistrement
app.get('/input', (req, res) => {
    res.render('input_data')
});

// Route GET pour afficher la page de chargement d'un fichier CSV
app.get('/upload', (req, res) => {
    res.render('upload_data')
});

// Route GET pour afficher la page de chargement d'un fichier CSV
app.get('/simulation', async (req, res) => {
    pred = req.query.pred
    const users = await User.find({});
    res.render('simulation', { users, pred })
});

// Route POST qui renvoie la prédiction d'un enregistrement en lançant le script input_data.py
app.post('/predict_from_input', async (req, res) => {
    predictions = ""
    inputs = req.body
    // Conversion du jour et de l'heure en step
    const step = (parseInt(inputs.day, 10) - 1) * 24 + (parseInt(inputs.hour, 10) + 1);
    const amount = parseFloat(inputs.amount)
    const oldbalanceOrg = parseFloat(inputs.oldbalanceOrg)
    const newbalanceOrg = parseFloat(inputs.newbalanceOrg)
    const oldbalanceDest = parseFloat(inputs.oldbalanceDest)
    const newbalanceDest = parseFloat(inputs.newbalanceDest)
    let type = 0
    if (inputs.type === "TRANSFER" ){
        type = 1
    } else if (inputs.type === "CASH_OUT" ){
        type = 0
    }
    // Creation d'un dictionnaire avec la structure de données attendue par le script
    const data = {
        step: step,
        type: type,
        amount: amount,
        oldbalanceOrg: oldbalanceOrg,
        newbalanceOrg: newbalanceOrg,
        oldbalanceDest: oldbalanceDest,
        newbalanceDest: newbalanceDest
    }
    // Transformation du dictionnaire data en chaine de caractères
    const donneesJSON = JSON.stringify(data);
    // Lancement du script avec comme argument les données précédemment préparées
    const pythonProcess = spawn('python', ['./public/scripts/py/input_data.py', donneesJSON]);
    // Récupération de l'output du script
    pythonProcess.stdout.on('data', (data) => {
        predictions = data.toString();
    });
    // En cas d'erreur d'éxécution du script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
    });
    // A la fin de l'execution du script
    pythonProcess.on('close', async (code) => {
        console.log("Finished")
        try {
            // Parse de l'output du script dans un format JSON valide
            const jsonPredictions = JSON.parse(predictions.trim());
            const datum = new Data({ 
                step: step,
                type: type,
                amount: amount,
                oldbalanceOrg: oldbalanceOrg,
                newbalanceOrig: newbalanceOrg,
                oldbalanceDest: oldbalanceDest,
                newbalanceDest: newbalanceDest,
                isFraud: jsonPredictions['mode']
              });
            await datum.save();
            // Passage à la page input_fraud_or_not en donnant comme arguments les inputs et l'output JSONifié du script
            res.render('input_fraud_or_not', { inputs, jsonPredictions })
        } catch (error) {
            // En cas d'erreur lors du parse en JSON
            console.error("Error parsing Python output as JSON:", error);
            res.status(code).send("Internal Server Error");
        }
      });
})

// Route POST qui renvoie la prédiction d'un enregistrement en lançant le script input_data.py
app.post('/predict_from_simulation', async (req, res) => {
    predictions = ""
    inputs = req.body
    const dest = await User.findById(inputs.dest);
    const orig = await User.findById(inputs.orig);
    const step = (parseInt(inputs.day, 10) - 1) * 24 + (parseInt(inputs.hour, 10) + 1);
    const amount = parseFloat(inputs.amount)
    const oldbalanceOrg = parseFloat(orig.solde)
    const newbalanceOrg = parseFloat(orig.solde) - amount
    const oldbalanceDest = parseFloat(dest.solde)
    const newbalanceDest = parseFloat(dest.solde) + amount
    let type = 0
    if (inputs.type === "TRANSFER" ){
        type = 1
    } else if (inputs.type === "CASH_OUT" ){
        type = 0
    }
    const data = {
        step: step,
        type: type,
        amount: amount,
        oldbalanceOrg: oldbalanceOrg,
        newbalanceOrg: newbalanceOrg,
        oldbalanceDest: oldbalanceDest,
        newbalanceDest: newbalanceDest
    }
    // Transformation du dictionnaire data en chaine de caractères
    const donneesJSON = JSON.stringify(data);
    // Lancement du script avec comme argument les données précédemment préparées
    const pythonProcess = spawn('python', ['./public/scripts/py/input_simu_data.py', donneesJSON]);
    // Récupération de l'output du script
    pythonProcess.stdout.on('data', (data) => {
        predictions = data.toString();
    });
    // En cas d'erreur d'éxécution du script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
    });
    // A la fin de l'execution du script
    pythonProcess.on('close', (code) => {
        console.log("Finished")
        try {
            // Parse de l'output du script dans un format JSON valide
            const jsonPredictions = JSON.parse(predictions.trim());
            console.log(jsonPredictions)
            // Passage à la page input_fraud_or_not en donnant comme arguments les inputs et l'output JSONifié du script
            // res.send(jsonPredictions)
        } catch (error) {
            // En cas d'erreur lors du parse en JSON
            console.error("Error parsing Python output as JSON:", error);
            res.status(code).send("Internal Server Error");
        }
      });
})

// Route POST qui renvoie les prédictions à partir d'un fichier CSV chargé en lançant le script umpload_data.py
app.post('/predict_from_upload', upload.single('file'), (req, res) => {
    predictions = ""
    // Récupération du fichier
    const uploadedFile = req.file;
    console.log("Started")
    // Lancement du script en donnant comme argument le fichier
    const pythonProcess = spawn('python', ['./public/scripts/py/upload_data.py', uploadedFile.path]);
    pythonProcess.stdout.on('data', (data) => {
        // Récupération du output du script
        predictions += data.toString();
    });
    // En cas d'erreur d'éxécution du script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python: ${data}`);
    });
    // A la fin de l'éxécution du script
    pythonProcess.on('close', (code) => {
        console.log("Finished")
        res.send('OK')
    });
});

// Route GET pour afficher les résultats du script de prediction à partir d'un fichier CSV
app.get('/upload_fon', async (req, res) => {
    // Mise dans un format JSON valide
    const jsonPredictions = JSON.parse(predictions.trim());
    for (let i = 0; i < jsonPredictions.length; i++) {
        const step = ((jsonPredictions[i]['day'] - 1) * 24) + (jsonPredictions[i]['hour'] + 1);
        let type = 0
        if (jsonPredictions[i]['type'] === "TRANSFER" ){
            type = 1
        } else if (jsonPredictions[i]['type'] === "CASH_OUT" ){
            type = 0
        }
        const datum = new Data({ 
            step: step,
            type: type,
            amount: jsonPredictions[i]['amount'],
            oldbalanceOrg: jsonPredictions[i]['oldbalanceOrg'],
            newbalanceOrig: jsonPredictions[i]['newbalanceOrig'],
            oldbalanceDest: jsonPredictions[i]['oldbalanceDest'],
            newbalanceDest: jsonPredictions[i]['newbalanceDest'],
            isFraud: jsonPredictions[i]['mode']
          });
        await datum.save();
    }
    // Pour la pagination
    const page = req.query.page || 1;
    const perPage = 5;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const totalPages = Math.ceil(jsonPredictions.length / perPage);
    const slicedData = jsonPredictions.slice(startIndex, endIndex);
    // Affichage de la page upload_fraud_or_not avec comme argument les données segmentées pour la pagination, le nombre total de pages et la page actuelle
    res.render('upload_fraud_or_not', { data: slicedData, totalPages, currentPage: page });
})

// Initalisation de l'application sur le port 5000
app.listen(5000, () => {
    console.log('Serving on port 5000')
})