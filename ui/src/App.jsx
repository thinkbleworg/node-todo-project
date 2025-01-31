import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { TASKS_BASE_URL } from "./constants/url-constants";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
  });

  // Create a new task
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(TASKS_BASE_URL, newTask);
      console.log("Create response", response);
      if (response) {
        setTasks([...tasks, response.data]);
      }
    } catch(error) {
      console.error("Error creating task:", error);
    }
  };

  // Update task status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`${TASKS_BASE_URL}/${id}`, { status });
      console.log("Update response", response);
      if (response) {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? response.data : task
        );
        setTasks(updatedTasks);
      }
    } catch(error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${TASKS_BASE_URL}/${id}`);
      console.log("Delete response", response);
      if (response) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch(error) {
      console.error("Error deleting task:", error)
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(TASKS_BASE_URL);
      console.log("Fetch response", response);
      if (response) {
        setTasks(response.data);
      }
    } catch(error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Fetch tasks from the API
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <form onSubmit={handleCreate} style={{
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "15px"
        }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button type="submit">Create Task</button>
      </form>

      <ul>
        {tasks ? tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.status}
            <button onClick={() => handleStatusChange(task._id, "In Progress")}>
              In Progress
            </button>
            <button onClick={() => handleStatusChange(task._id, "Done")}>
              Done
            </button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        )) : (
          <div>No tasks found, feel free to create one</div>
        )}
      </ul>
    </div>
  );
}

export default App;
