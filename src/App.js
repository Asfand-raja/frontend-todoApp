import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage isSignup={true} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/edit-task" element={<AddTaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
