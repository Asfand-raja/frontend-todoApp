import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import { getAllToDo } from "./utils/HandleApi";

function App() {
  const [toDo, setToDo] = useState([]);

  useEffect(() => {
    // Initial fetch of tasks
    getAllToDo(setToDo);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage isSignup={true} />} />
        <Route path="/dashboard" element={<DashboardPage toDo={toDo} setToDo={setToDo} />} />
        <Route path="/add" element={<AddTaskPage setToDo={setToDo} />} />
        <Route path="/edit" element={<AddTaskPage setToDo={setToDo} />} />
      </Routes>
    </Router>
  );
}

export default App;
