const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const Task = require('./model'); // <-- IMPORT MODEL

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));


app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      completed: false
    });

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
});


app.listen(5000, () => {
  console.log('Serveur backend en cours d\'exécution sur le port 5000');
});
