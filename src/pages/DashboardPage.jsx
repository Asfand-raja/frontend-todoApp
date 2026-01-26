import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import { getAllToDo, toggleComplete, deleteToDo, logoutUser } from '../utils/HandleApi';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [toDo, setToDo] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    setUser(storedUser);
    
    // Fetch tasks
    getAllToDo(setToDo)
      .catch((error) => {
        console.error('Failed to load tasks:', error);
        if (error.response?.status === 401) {
          // Session expired, redirect to login
          localStorage.removeItem('user');
          navigate('/');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#ff5252';
    if (priority === 'Medium') return '#ffca28';
    if (priority === 'Low') return '#00aaff';
    return '#5d6d7e';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#5d6d7e'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <h2 className="navbar-title">
            {user ? `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() || 'My Tasks' : 'My Tasks'}
          </h2>
          <button className="logout-btn-red" onClick={handleLogout}>
            <BiLogOut /> Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-container">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="hero-greeting">
              {user?.firstName ? `Hi, ${user.firstName}` : user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Dashboard'}
            </h1>
            <p className="hero-subtext">
              You have {toDo.length} task{toDo.length !== 1 ? 's' : ''} today.
            </p>
          </div>

          <div className="hero-action">
            <button
              className="add-task-hero-btn"
              onClick={() => navigate('/add-task')}
            >
              + Add New Task
            </button>
          </div>
        </section>

        {/* TASKS */}
        <section className="task-section">
          <div className="task-grid">
            {toDo.length > 0 ? (
              toDo.map((item) => (
                <div
                  key={item._id}
                  className={`task-card ${item.completed ? 'completed' : ''}`}
                  onClick={() =>
                    navigate('/edit-task', { state: { task: item } })
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
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
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
                    <label className="task-label">TASK</label>
                    <p className="task-text">{item.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks found. Time to add some!</p>
            )}
          </div>
        </section>
      </main>

      {/* MOBILE FAB */}
      <button
        className="fab-add-btn"
        onClick={() => navigate('/add-task')}
        aria-label="Add Task"
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default DashboardPage;