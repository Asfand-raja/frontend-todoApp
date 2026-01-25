import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToDo, updateToDo } from '../utils/HandleApi';
import { BsArrowLeft } from 'react-icons/bs';

const AddTaskPage = ({ setToDo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If editing, task is passed via route state
  const editingTask = location.state?.task;

  const [formState, setFormState] = useState({
    text: editingTask?.text || '',
    ongoingDate: editingTask?.ongoingDate || '',
    lastDate: editingTask?.lastDate || '',
    priority: editingTask?.priority || 'Medium',
    emoji: editingTask?.emoji || '📅',
  });

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.text) {
      return alert('Task name is required');
    }

    const todoData = editingTask
      ? { ...formState, id: editingTask._id }
      : formState;

    if (editingTask) {
      updateToDo(
        todoData,
        setFormState,
        setToDo,
        null, // setIsUpdating not needed here
        navigate
      );
    } else {
      addToDo(
        todoData,
        setFormState,
        setToDo,
        navigate
      );
    }
  };

  return (
    <div className="add-task-container">
      <header className="add-task-header">
        <BsArrowLeft
          className="back-icon"
          onClick={() => navigate('/dashboard')}
        />
        <h1>{editingTask ? 'Update Task' : 'Create New Task'}</h1>
      </header>

      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-item">
          <label>TASK NAME</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={formState.text}
            onChange={(e) => handleChange('text', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-item">
            <label>ONGOING DATE</label>
            <input
              type="date"
              value={formState.ongoingDate}
              onChange={(e) => handleChange('ongoingDate', e.target.value)}
            />
          </div>

          <div className="form-item">
            <label>LAST DATE</label>
            <input
              type="date"
              value={formState.lastDate}
              onChange={(e) => handleChange('lastDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-item">
          <label>IMPORTANCE (PRIORITY)</label>
          <div className="importance-selector">
            {['Low', 'Medium', 'High'].map(level => (
              <button
                key={level}
                type="button"
                className={`importance-btn ${priorityClass(level, formState.priority)}`}
                onClick={() => handleChange('priority', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-item">
          <label>PICK AN EMOJI</label>
          <div className="emoji-selector">
            {['📅', '💻', '🎨', '🏃', '🍎', '🏠', '📚'].map(e => (
              <span
                key={e}
                className={`emoji-item ${formState.emoji === e ? 'active' : ''}`}
                onClick={() => handleChange('emoji', e)}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-task-btn">
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

// Optional helper for cleaner classNames
const priorityClass = (level, current) =>
  `${level.toLowerCase()} ${current === level ? 'active' : ''}`;

export default AddTaskPage;
