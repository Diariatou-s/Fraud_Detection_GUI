const mongoose = require("mongoose");
const {
  customers,
  soldes_customers,
  agents,
  soldes_agents
} = require("./infos.js");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/fraud_detection");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
    await User.deleteMany({});
    for (let i = 0; i < customers.length; i++) {
        const user = new User({ 
            id: customers[i],
            solde: soldes_customers[i],
            role: 'client'
        });
        const agent = new User({ 
          id: agents[i],
          solde: soldes_agents[i],
          role: 'agent'
        });
      try {
        await user.save();
        await agent.save();
      } catch (e) {
        console.log(e)
      }
      
    }
  };

seedDB().then(() => {
  mongoose.connection.close();
});
