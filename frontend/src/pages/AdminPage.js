// src/pages/AdminPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const correctAdminKey = 'my_super_secure_key'; // Your secret admin key

  // Fetch the counter value
  const fetchCounter = async () => {
    try {
      const response = await axios.get('https://emikhayr.vercel.app/api/counter');
      setCounter(response.data.counter);
    } catch (error) {
      console.error('Error fetching counter:', error);
    }
  };

  // Handle admin authentication
  const handleAdminLogin = () => {
    if (adminKey === correctAdminKey) {
      setIsAuthenticated(true);
      setMessage('Admin authenticated');
      fetchCounter(); // Fetch the counter if authenticated
    } else {
      setIsAuthenticated(false);
      setMessage('Invalid admin key');
    }
  };

  // Increment counter
  const incrementCounter = async () => {
    try {
      const response = await axios.post('https://emikhayr.vercel.app/api/counter/increment', {
        adminKey,
      });
      setCounter(response.data.counter);
      setMessage('Counter incremented successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error incrementing counter');
    }
  };

  // Decrement counter
  const decrementCounter = async () => {
    try {
      const response = await axios.post('https://emikhayr.vercel.app/api/counter/decrement', {
        adminKey,
      });
      setCounter(response.data.counter);
      setMessage('Counter decremented successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error decrementing counter');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Admin Page</h1>
      {!isAuthenticated ? (
        <div>
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <button onClick={handleAdminLogin} style={{ padding: '5px 10px' }}>
            Authenticate as Admin
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h2>Current Counter: {counter}</h2>
          <button onClick={incrementCounter} style={{ padding: '10px 20px' }}>
            Increment Counter
          </button>
          <button onClick={decrementCounter} style={{ padding: '10px 20px', marginLeft: '20px' }}>
            Decrement Counter
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
