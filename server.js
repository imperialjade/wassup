const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// A list of fun random names
const names = ["Blue Panda", "Golden Tiger", "Swift Eagle", "Neon Cat", "Cool Dragon", "Happy Hippo", "Silver Fox", "Space Whale"];

io.on('connection', (socket) => {
    // Assign a random name to this specific user
    const randomName = names[Math.floor(Math.random() * names.length)] + " #" + Math.floor(Math.random() * 999);
    socket.userName = randomName;
    
    console.log(`${socket.userName} connected`);

    socket.on('chat message', (msg) => {
        // Send the message PLUS the username to everyone
        const data = {
            name: socket.userName,
            text: msg
        };
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
