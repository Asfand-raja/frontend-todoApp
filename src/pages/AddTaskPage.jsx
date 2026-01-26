import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToDo, updateToDo } from '../utils/HandleApi';
import { BsArrowLeft } from 'react-icons/bs';
import { useToDo } from '../context/ToDoContext';

const AddTaskPage = () => {
  const { setToDo } = useToDo();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please log in to add tasks');
      navigate('/');
    }
  }, [navigate]);

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
    return '#00aaff';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fcfbf9',
      padding: '20px',
      paddingTop: '60px',
      paddingBottom: '60px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px 20px',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
        border: '1px solid #f0f4f8'
      }}>
        <header style={{
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <BsArrowLeft
            onClick={() => navigate('/dashboard')}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: '#1e272e',
              minWidth: '24px'
            }}
          />
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#4b3621',
            letterSpacing: '-1px',
            margin: 0,
            lineHeight: '1.2'
          }}>
            {editingTask ? 'Edit Task Detail' : 'Create New Project'}
          </h1>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
          <div>
            <label style={{
              fontSize: '0.85rem',
              fontWeight: '800',
              color: '#5d6d7e',
              letterSpacing: '1px',
              marginBottom: '10px',
              display: 'block'
            }}>
              TASK NAME
            </label>
            <input
              type="text"
              placeholder="Type your task here..."
              value={formState.text}
              onChange={(e) => handleChange('text', e.target.value)}
              required
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                border: '2px solid #f0f4f8',
                background: '#fcfcfc',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#5d6d7e',
                letterSpacing: '1px',
                marginBottom: '10px',
                display: 'block'
              }}>
                START DATE
              </label>
              <input
                type="date"
                value={formState.ongoingDate}
                onChange={(e) => handleChange('ongoingDate', e.target.value)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #f0f4f8',
                  background: '#fcfcfc',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#5d6d7e',
                letterSpacing: '1px',
                marginBottom: '10px',
                display: 'block'
              }}>
                DUE DATE
              </label>
              <input
                type="date"
                value={formState.lastDate}
                onChange={(e) => handleChange('lastDate', e.target.value)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '2px solid #f0f4f8',
                  background: '#fcfcfc',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '0.85rem',
              fontWeight: '800',
              color: '#5d6d7e',
              letterSpacing: '1px',
              marginBottom: '10px',
              display: 'block'
            }}>
              PRIORITY LEVEL
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
              gap: '12px'
            }}>
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('priority', level)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: getPriorityColor(level, formState.priority === level),
                    color: formState.priority === level ? '#fff' : '#5d6d7e',
                    fontWeight: '700',
                    fontSize: '0.9rem',
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

          <div>
            <label style={{
              fontSize: '0.85rem',
              fontWeight: '800',
              color: '#5d6d7e',
              letterSpacing: '1px',
              marginBottom: '10px',
              display: 'block'
            }}>
              ICON REF
            </label>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              {['📅', '💻', '🎨', '🏃', '🍎', '🏠', '📚'].map((e) => (
                <span
                  key={e}
                  onClick={() => handleChange('emoji', e)}
                  style={{
                    fontSize: 'clamp(24px, 5vw, 28px)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '12px',
                    background: formState.emoji === e ? '#f0f4f8' : 'transparent',
                    border: formState.emoji === e ? '2px solid #4b3621' : '2px solid transparent',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
              padding: '18px',
              borderRadius: '18px',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
              boxShadow: '0 15px 30px rgba(75, 54, 33, 0.2)',
              transition: 'all 0.3s',
              width: '100%'
            }}
          >
            {editingTask ? 'Save Changes' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;