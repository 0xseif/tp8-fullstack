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



app.put('/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Tâche introuvable" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});
app.put('/tasks/:id/uncomplete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Tâche introuvable" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ error: "Tâche introuvable" });

    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});
app.get('/tasks', async (req, res) => {
  try {
    const filter = {};

    if (req.query.completed === "true") filter.completed = true;
    if (req.query.completed === "false") filter.completed = false;

    const tasks = await Task.find(filter);
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(5000, () => {
  console.log('Serveur backend en cours d\'exécution sur le port 5000');
});
