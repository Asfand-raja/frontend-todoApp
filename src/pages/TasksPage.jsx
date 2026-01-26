import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToDo from '../components/ToDo';
import { getAllToDo, deleteToDo, toggleComplete } from '../utils/HandleApi';

const TasksPage = ({ toDo, setToDo }) => {
  const navigate = useNavigate();

  // Fetch all tasks on mount
  useEffect(() => {
    getAllToDo(setToDo);
  }, [setToDo]); // ✅ ESLint-compliant: include setToDo

  // Calculate completed tasks progress
  const completedCount = toDo.filter(task => task.completed).length;
  const progress =
    toDo.length > 0 ? Math.round((completedCount / toDo.length) * 100) : 0;

  return (
    <div className="tasks-page">
      {/* Header + Progress */}
      <div className="tasks-header">
        <h2>Daily Tasks</h2>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          >
            <span>{progress}% Completed</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        <h3>To-do Tasks</h3>
        <div className="list">
          {toDo.length > 0 ? (
            toDo.map(task => (
              <ToDo
                key={task._id}
                item={task}
                onEdit={() =>
                  navigate('/add-task', { state: { task } })
                }
                onDelete={() =>
                  deleteToDo(task._id, setToDo)
                }
                onToggle={() =>
                  toggleComplete(
                    { id: task._id, completed: !task.completed },
                    setToDo
                  )
                }
              />
            ))
          ) : (
            <p className="no-tasks">No tasks yet. Time to add some!</p>
          )}
        </div>
      </div>

      {/* Add Task FAB */}
      <button
        className="add-fab"
        onClick={() => navigate('/add-task')}
      >
        +
      </button>
    </div>
  );
};

export default TasksPage;
