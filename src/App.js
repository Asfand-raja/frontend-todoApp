import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToDoProvider } from "./context/ToDoContext";

function App() {
  return (
    <ErrorBoundary>
      <ToDoProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage isSignup={true} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add-task" element={<AddTaskPage />} />
            <Route path="/edit-task" element={<AddTaskPage />} />
          </Routes>
        </Router>
      </ToDoProvider>
    </ErrorBoundary>
  );
}

export default App;
