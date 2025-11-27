import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {

const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState('');
useEffect(() => {
// Récupérer les tâches depuis le backend
axios.get('http://localhost:5000/tasks')
.then((response) => {
setTasks(response.data);
});
}, []);
const handleAddTask = () => {
if (newTask) {

11
// Envoyer la nouvelle tâche au backend
axios.post('http://localhost:5000/tasks', { title: newTask })
.then((response) => {
setTasks([...tasks, { title: newTask, completed: false }]);
setNewTask('');
});
}
};
return (
<div>
<h1>Liste des tâches</h1>
<input
type="text"
value={newTask}
onChange={(e) => setNewTask(e.target.value)}
placeholder="Ajouter une tâche"
/>
<button onClick={handleAddTask}>Ajouter</button>
<ul>
{tasks.map((task, index) => (
<li key={index}>{task.title}</li>
))}
</ul>
</div>
);
}
export default App;