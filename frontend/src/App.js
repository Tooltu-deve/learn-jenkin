import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Use relative path in production (nginx proxy), or explicit URL in development
const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title: title.trim(),
        description: description.trim() || null,
      });
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Todo List</h1>

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="todo-input"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="todo-textarea"
            rows="2"
          />
          <button type="submit" className="add-button">
            Add Todo
          </button>
        </form>

        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                <p>No todos yet. Add one above to get started!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id, todo.completed)}
                      className="todo-checkbox"
                    />
                    <div className="todo-text">
                      <h3 className="todo-title">{todo.title}</h3>
                      {todo.description && (
                        <p className="todo-description">{todo.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
