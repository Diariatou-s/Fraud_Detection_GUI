const mongoose = require("mongoose");
const {
  ids,
  soldes,
  roles
} = require("./infos.js");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/fraud_detection");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await User.deleteMany({});
    for (let i = 0; i < ids.length; i++) {
        const user = new User({ 
            id: ids[i],
            solde: soldes[i],
            role: sample(roles)
        });
      await user.save();
    }
  };

seedDB().then(() => {
  mongoose.connection.close();
});
