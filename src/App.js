import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
import { AuthProvider } from "./context/AuthContext";
>>>>>>> ba1e630 (Update Todo App branding: change title to Todo App and add logo to login page)
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToDoProvider } from "./context/ToDoContext";

function App() {
  return (
<<<<<<< HEAD
    <ErrorBoundary>
      <ToDoProvider>
        <Router>
          <ToastContainer position="top-center" autoClose={3000} />
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
=======
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage isSignup={true} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/edit-task" element={<AddTaskPage />} />
        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> ba1e630 (Update Todo App branding: change title to Todo App and add logo to login page)
  );
}

export default App;
