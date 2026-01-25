import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToDo, updateToDo } from '../utils/HandleApi';
import { BsArrowLeft } from 'react-icons/bs';

const AddTaskPage = ({ setToDo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if editing task
  const editingTask = location.state?.task;

  const [formState, setFormState] = useState({
    text: editingTask?.text || '',
    ongoingDate: editingTask?.ongoingDate || '',
    lastDate: editingTask?.lastDate || '',
    priority: editingTask?.priority || 'Medium',
    emoji: editingTask?.emoji || '📅',
  });

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.text.trim()) {
      return alert('Task name is required');
    }

    const todoData = editingTask
      ? { ...formState, id: editingTask._id }
      : formState;

    if (editingTask) {
      // Update task
      updateToDo(todoData, setFormState, setToDo, null, navigate);
    } else {
      // Add new task
      addToDo(todoData, setFormState, setToDo, navigate);
    }
  };

  return (
    <div className="add-task-container">
      {/* Header */}
      <header className="add-task-header">
        <BsArrowLeft
          className="back-icon"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer', fontSize: '24px' }}
        />
        <h1>{editingTask ? 'Update Task' : 'Create New Task'}</h1>
      </header>

      {/* Task Form */}
      <form className="add-task-form" onSubmit={handleSubmit}>
        {/* Task Name */}
        <div className="form-item">
          <label>TASK NAME</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={formState.text}
            onChange={(e) => handleChange('text', e.target.value)}
            required
          />
        </div>

        {/* Dates */}
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

        {/* Priority */}
        <div className="form-item">
          <label>IMPORTANCE (PRIORITY)</label>
          <div className="importance-selector">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                className={`importance-btn ${priorityClass(level, formState.priority)}`}
                onClick={() => handleChange('priority', level)}
                style={{
                  backgroundColor:
                    formState.priority === level
                      ? level === 'High'
                        ? '#ff5252'
                        : level === 'Medium'
                        ? '#ffca28'
                        : '#8B4513'
                      : '#e0e0e0',
                  color: formState.priority === level ? '#fff' : '#000',
                  border: 'none',
                  padding: '6px 12px',
                  marginRight: '8px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji */}
        <div className="form-item">
          <label>PICK AN EMOJI</label>
          <div className="emoji-selector">
            {['📅', '💻', '🎨', '🏃', '🍎', '🏠', '📚'].map((e) => (
              <span
                key={e}
                className={`emoji-item ${formState.emoji === e ? 'active' : ''}`}
                onClick={() => handleChange('emoji', e)}
                style={{
                  fontSize: '24px',
                  marginRight: '8px',
                  cursor: 'pointer',
                  border: formState.emoji === e ? '2px solid #8B4513' : 'none',
                  borderRadius: '5px',
                  padding: '2px',
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-task-btn"
          style={{
            backgroundColor: '#8B4513', // brown
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            marginTop: '12px',
          }}
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

// Helper for priority button class
const priorityClass = (level, current) =>
  `${level.toLowerCase()} ${current === level ? 'active' : ''}`;

export default AddTaskPage;
