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
      updateToDo(todoData, setFormState, setToDo, null, navigate);
    } else {
      addToDo(todoData, setFormState, setToDo, navigate);
    }
  };

  const getPriorityColor = (level, active) => {
    if (!active) return '#f0f4f8';
    if (level === 'High') return '#ff5252';
    if (level === 'Medium') return '#ffca28';
    return '#00aaff'; // Blue for Low
  };

  return (
    <div className="add-task-container" style={{
      maxWidth: '800px',
      margin: '60px auto',
      padding: '50px',
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
      border: '1px solid #f0f4f8'
    }}>
      <header className="add-task-header" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <BsArrowLeft
          className="back-icon"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer', fontSize: '28px', color: '#1e272e' }}
        />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4b3621', letterSpacing: '-1px' }}>
          {editingTask ? 'Edit Task Detail' : 'Create New Project'}
        </h1>
      </header>

      <form className="add-task-form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '30px' }}>
        <div className="form-item">
          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#5d6d7e', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>TASK NAME</label>
          <input
            type="text"
            placeholder="Type your task here..."
            value={formState.text}
            onChange={(e) => handleChange('text', e.target.value)}
            required
            style={{
              padding: '18px 24px',
              borderRadius: '16px',
              border: '2px solid #f0f4f8',
              background: '#fcfcfc',
              fontSize: '1.1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              width: '100%'
            }}
          />
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div className="form-item">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#5d6d7e', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>START DATE</label>
            <input
              type="date"
              value={formState.ongoingDate}
              onChange={(e) => handleChange('ongoingDate', e.target.value)}
              style={{
                padding: '16px 20px',
                borderRadius: '14px',
                border: '2px solid #f0f4f8',
                background: '#fcfcfc',
                fontSize: '1rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          <div className="form-item">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#5d6d7e', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>DUE DATE</label>
            <input
              type="date"
              value={formState.lastDate}
              onChange={(e) => handleChange('lastDate', e.target.value)}
              style={{
                padding: '16px 20px',
                borderRadius: '14px',
                border: '2px solid #f0f4f8',
                background: '#fcfcfc',
                fontSize: '1rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div className="form-item">
          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#5d6d7e', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>PRIORITY LEVEL</label>
          <div className="importance-selector" style={{ display: 'flex', gap: '15px' }}>
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleChange('priority', level)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: getPriorityColor(level, formState.priority === level),
                  color: formState.priority === level ? '#fff' : '#5d6d7e',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: formState.priority === level ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-item">
          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#5d6d7e', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>ICON REF</label>
          <div className="emoji-selector" style={{ display: 'flex', gap: '15px' }}>
            {['📅', '💻', '🎨', '🏃', '🍎', '🏠', '📚'].map((e) => (
              <span
                key={e}
                onClick={() => handleChange('emoji', e)}
                style={{
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '12px',
                  background: formState.emoji === e ? '#f0f4f8' : 'transparent',
                  border: formState.emoji === e ? '2px solid #4b3621' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: '#4b3621',
            color: '#fff',
            padding: '20px',
            borderRadius: '18px',
            fontSize: '1.2rem',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 15px 30px rgba(75, 54, 33, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {editingTask ? 'Save Changes' : 'Launch Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
