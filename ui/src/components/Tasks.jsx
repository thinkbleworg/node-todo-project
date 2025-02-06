import React, { useEffect, useState } from "react";
import { removeToken } from "../utils/auth";
import { requestAPI } from "../utils/request";
import { TASKS_URL } from "../constants/url-constants";
import "./tasks.css";


const LogoutBtn = ({handleLogout}) => (
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
);

const Tasks = ({ setIsAuthenticated }) => {
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
      const response = await requestAPI("POST", TASKS_URL, newTask);
      console.log("Create response", response);
      if (response) {
        setTasks([...tasks, response.data]);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Update task status
  const handleStatusChange = async (id, status) => {
    try {
      const response = await requestAPI("PUT", `${TASKS_URL}/${id}`, {
        status,
      });
      console.log("Update response", response);
      if (response) {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? response.data : task
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      const response = await requestAPI("DELETE", `${TASKS_URL}/${id}`);
      console.log("Delete response", response);
      if (response) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await requestAPI("GET", TASKS_URL);
      console.log("Fetch response", response);
      if (response) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };


  // Fetch tasks from the API
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasks-container">
      <LogoutBtn handleLogout={handleLogout}/>
      <form onSubmit={handleCreate}>
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

      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>
                  <span className={`task-status ${task.status.replace(" ", "")}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleStatusChange(task._id, "In Progress")}>
                    In Progress
                  </button>
                  <button onClick={() => handleStatusChange(task._id, "Done")}>
                    Done
                  </button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-tasks-message">
                No tasks found, feel free to create one!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
