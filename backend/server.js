const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const PORT = 5000;

app.use(cors(
  {
    origins: ["https://emi-mauve.vercel.app"],
    methods: ["POST","GET"],
    credentials: true
  }
));
app.use(express.json());

let counter = 0;  // The counter value

// Create HTTP server and WebSocket server (socket.io)
const server = http.createServer(app);
const io = socketIo(server);  // Attach socket.io to the server

// Route to get the current counter value
app.get('/api/counter', (req, res) => {
  res.json({ counter });
});

// Route to increment the counter (for admin only)
app.post('/api/counter/increment', (req, res) => {
  const { adminKey } = req.body;
  const correctAdminKey = 'my_super_secure_key'; // Your secret admin key

  if (adminKey !== correctAdminKey) {
    return res.status(403).json({ message: 'Invalid admin key!' });
  }

  counter += 1;  // Increment the counter

  // Emit the updated counter to all connected clients
  io.emit('counterUpdate', { counter });
  res.json({ counter });
});

// Route to decrement the counter (for admin only)
app.post('/api/counter/decrement', (req, res) => {
  const { adminKey } = req.body;
  const correctAdminKey = 'my_super_secure_key'; // Your secret admin key

  if (adminKey !== correctAdminKey) {
    return res.status(403).json({ message: 'Invalid admin key!' });
  }

  counter -= 1;  // Decrement the counter

  // Emit the updated counter to all connected clients
  io.emit('counterUpdate', { counter });
  res.json({ counter });
});

// WebSocket event listener for new clients
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the current counter value when a new client connects
  socket.emit('counterUpdate', { counter });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
