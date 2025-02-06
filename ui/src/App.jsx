import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import { getToken } from "./utils/auth";
import { PAGES } from "./constants/constants";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = !!getToken();
    console.log("isAuth", isAuth);
    setIsAuthenticated(isAuth);
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={`/${PAGES.TASKS}`} /> : <Navigate to={`/${PAGES.LOGIN}`} />} />
        <Route path={`/${PAGES.LOGIN}`} element={isAuthenticated ? <Navigate to={`/${PAGES.TASKS}`} /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route
          path={`/${PAGES.TASKS}`}
          element={
            isAuthenticated ? <Tasks setIsAuthenticated={setIsAuthenticated} /> : <Navigate to={`/${PAGES.LOGIN}`} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
