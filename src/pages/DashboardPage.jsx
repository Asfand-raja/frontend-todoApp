import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import { getAllToDo, toggleComplete, deleteToDo } from '../utils/HandleApi';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [toDo, setToDo] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    // Fetch tasks AFTER login
    getAllToDo(setToDo);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ff5252';
    if (priority === 'Medium') return '#ffca28';
    if (priority === 'Low') return '#00aaff';
    return '#5d6d7e';
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <h2 className="navbar-title">
            {user ? `${user.firstName} ${user.lastName}` : 'My Tasks'}
          </h2>
          <button className="logout-btn-red" onClick={handleLogout}>
            <BiLogOut /> Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="dashboard-container">
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="hero-greeting">
              {user?.firstName ? `Hi, ${user.firstName}` : 'Dashboard'}
            </h1>
            <p className="hero-subtext">
              You have {toDo.length} task{toDo.length !== 1 && 's'} today.
            </p>
          </div>

          <button
            className="add-task-hero-btn"
            onClick={() => navigate('/add')}
          >
            + Add New Task
          </button>
        </section>

        <section className="task-section">
          <div className="task-grid">
            {toDo.length > 0 ? (
              toDo.map((item) => (
                <div
                  key={item._id}
                  className={`task-card ${item.completed ? 'completed' : ''}`}
                  onClick={() =>
                    navigate('/add', { state: { task: item } })
                  }
                >
                  <div className="task-header">
                    <div className="task-header-left">
                      <div
                        className={`todo-check ${item.completed ? 'checked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(
                            { id: item._id, completed: !item.completed },
                            setToDo
                          );
                        }}
                      >
                        {item.completed && <MdDone color="#fff" />}
                      </div>
                      <span className="task-emoji">{item.emoji || '📅'}</span>
                    </div>

                    <div
                      className="task-header-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="priority-badge"
                        style={{
                          backgroundColor: getPriorityColor(item.priority),
                        }}
                      >
                        {item.priority}
                      </span>

                      <AiFillDelete
                        className="delete-task-icon"
                        onClick={() => {
                          if (window.confirm('Delete this task?')) {
                            deleteToDo(item._id, setToDo);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="task-main">
                    <label>TASK</label>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks found. Time to add some!</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
