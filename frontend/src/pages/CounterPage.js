import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useSpring, animated } from 'react-spring';

// Connect to WebSocket server (ensure correct URL)
const socket = io('https://emikhayr.vercel.app', {
  transports: ['websocket', 'polling'],  // Ensuring the connection method is compatible
  withCredentials: true,  // Ensure credentials are included if needed
});


const CounterPage = () => {
  const [counter, setCounter] = useState(0);

  // Create the spring animation for the counter number
  const props = useSpring({
    from: { number: counter },
    to: { number: counter },
    config: { tension: 200, friction: 20 }, // Adjust the animation speed
  });

  // Fetch the counter value when the page loads
  useEffect(() => {
    fetchCounter();

    // Listen for real-time updates to the counter
    socket.on('counterUpdate', (data) => {
      setCounter(data.counter); // Update the counter when a new update is emitted from the server
    });

    // Clean up socket listener when the component unmounts
    return () => {
      socket.off('counterUpdate');
    };
  }, []);

  const fetchCounter = async () => {
    try {
      const response = await axios.get('https://emikhayr.vercel.app/api/counter');
      setCounter(response.data.counter); // Set the new counter value
    } catch (error) {
      console.error('Error fetching counter:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter</h1>

      {/* Animated number display */}
      <animated.h2>{props.number.to(n => n.toFixed(0))}</animated.h2> 

      <p>This page is visible to all users. Only the admin can increment or decrement the counter.</p>

      {/* Link to the Admin Page for authenticated users */}
      <Link to="/admin">
        <button style={{ padding: '10px 20px' }}>Go to Admin Page</button>
      </Link>
    </div>
  );
};

export default CounterPage;
