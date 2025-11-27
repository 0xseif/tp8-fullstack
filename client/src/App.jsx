import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, uncompleted

  const fetchTasks = async () => {
    try {
      let url = 'http://localhost:5000/tasks';
      if (filter === 'completed') url += '?completed=true';
      if (filter === 'uncompleted') url += '?completed=false';

      const response = await axios.get(url);
      setTasks(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des tâches:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const toggleCompletion = async (task) => {
    try {
      const url = `http://localhost:5000/tasks/${task._id}/${task.completed ? 'uncomplete' : 'complete'}`;
      const response = await axios.put(url);
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };

  const handleEditTask = async (task, newTitle) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${task._id}`, {
        title: newTitle,
        completed: task.completed
      });
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
    }
  };

  return (
    <div className="app-container">
      <h1>Liste des tâches</h1>

      {/* Input new task */}
      <input
        type="text"
        className="todo-input"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Ajouter une tâche"
      />
      <button className="btn add-button" onClick={handleAddTask}>Ajouter</button>

      {/* Filter */}
      <div className="filters">
        <button
          className={`btn filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >Toutes</button>
        <button
          className={`btn filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >Terminées</button>
        <button
          className={`btn filter-button ${filter === 'uncompleted' ? 'active' : ''}`}
          onClick={() => setFilter('uncompleted')}
        >Non terminées</button>
      </div>

      {/* Task list */}
      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task._id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task)}
            />
            <EditableTaskTitle task={task} onSave={handleEditTask} />
            <button className="btn delete-button" onClick={() => handleDeleteTask(task._id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component to edit task title inline
function EditableTaskTitle({ task, onSave }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    if (title.trim() && title !== task.title) onSave(task, title);
    setEditing(false);
  };

  return editing ? (
    <>
      <input
        type="text"
        className="editable-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn save-button" onClick={handleSave}>Save</button>
    </>
  ) : (
    <span
      className={`task-title ${task.completed ? 'completed' : ''}`}
      onDoubleClick={() => setEditing(true)}
    >
      {task.title}
    </span>
  );
}

export default App;
    