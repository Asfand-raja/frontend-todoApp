import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import { toggleComplete, deleteToDo } from '../utils/HandleApi';

const DashboardPage = ({ toDo, setToDo }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // clear session
    navigate('/');
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ff5252';
    if (priority === 'Medium') return '#ffca28';
    if (priority === 'Low') return '#00aaff'; // Blue for Low
    return '#5d6d7e';
  };

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <h2 className="navbar-title">
            {user ? user.name : 'My Tasks'}
          </h2>
          <button className="logout-btn-red" onClick={handleLogout}>
            <BiLogOut /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="hero-greeting">
              {user?.name ? user.name.split(' ')[0] : 'Dashboard'}
            </h1>
            <p className="hero-subtext">
              You have {toDo?.length || 0} task{toDo?.length !== 1 && 's'} today.
            </p>
          </div>

          <button
            className="add-task-hero-btn"
            onClick={() => navigate('/add')}
            style={{
              backgroundColor: '#8B4513', // brown
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            + New Task
          </button>
        </section>

        {/* Tasks Section */}
        <section className="task-section">
          <div className="task-grid">
            {Array.isArray(toDo) && toDo.length > 0 ? (
              toDo.map((item) => (
                <div
                  key={item._id}
                  className={`task-card ${item.completed ? 'completed' : ''}`}
                  onClick={() =>
                    navigate('/add', { state: { task: item } }) // edit task
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
                          backgroundColor: getPriorityColor(item.priority || 'Medium'),
                        }}
                      >
                        {item.priority || 'Medium'}
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
                    <label className="task-label">TASK</label>
                    <p className="task-text">{item.text}</p>
                  </div>

                  <div className="task-dates-row">
                    <div className="date-item">
                      <label>ONGOING DATE</label>
                      <span>{item.ongoingDate || '---'}</span>
                    </div>
                    <div className="date-item">
                      <label>LAST DATE</label>
                      <span>{item.lastDate || '---'}</span>
                    </div>
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
