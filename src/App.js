import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  // Lifted state to manage todos across pages
  const [toDo, setToDo] = useState([]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage isSignup={true} />} />
          <Route
            path="/dashboard"
            element={<DashboardPage toDo={toDo} setToDo={setToDo} />}
          />
          {/* Routes for AddTaskPage - passing setToDo prop directly */}
          <Route
            path="/add-task"
            element={<AddTaskPage setToDo={setToDo} />}
          />
          <Route
            path="/edit-task"
            element={<AddTaskPage setToDo={setToDo} />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
