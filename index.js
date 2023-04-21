// Import the necessary modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); 

const conferenceRoute = require('./routes/conference');

// Create the server
const app = express();
const corsOptions = {
    origin: '*',
};
  
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/conference', conferenceRoute);
  
const server = http.createServer(app);

// Create the Socket.io instance
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

// Set up the connection event listener
io.on('connection', (socket) => {
    console.log('A client has connected');

    socket.on('join-lecture', (data) => {
        console.log('Joined', data);
    });
    
    // Handle the disconnect event
    socket.on('disconnect', () => {
        console.log('A client has disconnected');
    });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
