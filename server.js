const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// A list of fun random names
const firstNames = ["Aggressive", "Fancy", "Sleepy", "Hyper", "Golden", "Swift", "Neon", "mighty", "Silly", "brave"];
const lastNames = ["Panda", "Cucumber", "Wizard", "Eagle", "Cat", "Dragon", "Hippo", "Fox", "Whale", "Potato"];

io.on('connection', (socket) => {
    // Pick one from the first list
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    // Pick one from the second list
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Combine them
    socket.userName = `${randomFirst} ${randomLast}`;
    
    console.log(socket.userName + " joined");
    
    // ... rest of your code
});

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
