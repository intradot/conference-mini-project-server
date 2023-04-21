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

    socket.on('join-lecture', (lectureId, userId) => {
        console.log('Joined', lectureId, userId);
        socket.join(lectureId);
        //socket.to(lectureId).emit('user-connected', userId);
        socket.broadcast.to(lectureId).emit("user-connected", userId);
        socket.on('disconnect', () => {
            socket.broadcast.to(lectureId).emit("user-disconnected", userId);
        });
    });

    // Handle the disconnect event
    socket.on('disconnect', () => {
        console.log('A client has disconnected');
        socket.broadcast.emit('clear-grid');
    });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
