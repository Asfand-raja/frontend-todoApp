import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToDo, updateToDo } from '../utils/HandleApi';
import { BsArrowLeft } from 'react-icons/bs';

const AddTaskPage = ({ setToDo }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    if (!formState.text.trim()) return alert('Task name is required');

    const todoData = editingTask
      ? { ...formState, id: editingTask._id }
      : formState;

    editingTask
      ? updateToDo(todoData, null, setToDo, null, navigate)
      : addToDo(todoData, null, setToDo, navigate);
  };

  return (
    <div className="add-task-page">
      <div className="add-task-container">
        {/* Header */}
        <header className="add-task-header">
          <BsArrowLeft
            className="back-icon"
            onClick={() => navigate('/dashboard')}
          />
          <h1>{editingTask ? 'Edit Task Detail' : 'Create New Project'}</h1>
        </header>

        {/* Form */}
        <form className="add-task-form" onSubmit={handleSubmit}>
          {/* Task name */}
          <div className="form-item">
            <label>TASK NAME</label>
            <input
              type="text"
              placeholder="Type your task here..."
              value={formState.text}
              onChange={(e) => handleChange('text', e.target.value)}
              required
            />
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-item">
              <label>START DATE</label>
              <input
                type="date"
                value={formState.ongoingDate}
                onChange={(e) => handleChange('ongoingDate', e.target.value)}
              />
            </div>

            <div className="form-item">
              <label>DUE DATE</label>
              <input
                type="date"
                value={formState.lastDate}
                onChange={(e) => handleChange('lastDate', e.target.value)}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="form-item">
            <label>PRIORITY LEVEL</label>
            <div className="importance-selector">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`importance-btn ${
                    formState.priority === level ? 'active' : ''
                  }`}
                  onClick={() => handleChange('priority', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div className="form-item">
            <label>ICON</label>
            <div className="emoji-selector">
              {['📅', '💻', '🎨', '🏃', '🍎', '🏠', '📚'].map((e) => (
                <span
                  key={e}
                  className={`emoji-item ${
                    formState.emoji === e ? 'active' : ''
                  }`}
                  onClick={() => handleChange('emoji', e)}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button className="submit-task-btn" type="submit">
            {editingTask ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
