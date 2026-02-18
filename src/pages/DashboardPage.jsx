import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { getAllToDo, toggleComplete, deleteToDo, logoutUser } from '../utils/HandleApi';
<<<<<<< HEAD
import { useToDo } from '../context/ToDoContext';
=======
import ToDo from '../components/ToDo'; // import your new ToDo component
>>>>>>> ba1e630 (Update Todo App branding: change title to Todo App and add logo to login page)

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toDo, setToDo } = useToDo();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safely parse user data
    try {
      // Check both local and session storage
      const storedUser = JSON.parse(localStorage.getItem('user')) ||
        JSON.parse(sessionStorage.getItem('user'));

      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      navigate('/');
      return;
    }

<<<<<<< HEAD
    // Fetch tasks
    getAllToDo(setToDo)
      .catch((error) => {
        console.error('Failed to load tasks:', error);
        // 401 handling is done in HandleApi interceptor
=======
    setUser(storedUser);

    getAllToDo(setToDo)
      .catch((error) => {
        console.error('Failed to load tasks:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          navigate('/');
        }
>>>>>>> ba1e630 (Update Todo App branding: change title to Todo App and add logo to login page)
      })
      .finally(() => setLoading(false));
  }, [navigate, setToDo]);

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      navigate('/');
    }
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
                <ToDo
                  key={item._id}
                  id={item._id}
                  text={item.text}
                  ongoingDate={item.ongoingDate}
                  lastDate={item.lastDate}
                  emoji={item.emoji || '📅'}
                  completed={item.completed}
                  priority={item.priority}
                  updateMode={() => navigate('/edit-task', { state: { task: item } })}
                  deleteToDo={() => {
                    if (window.confirm('Delete this task?')) deleteToDo(item._id, setToDo);
                  }}
                  toggleComplete={() => toggleComplete({ id: item._id, completed: !item.completed }, setToDo)}
                />
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
