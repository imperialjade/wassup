const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// A list of fun random names
const firstNames = [
  "Ben",
  "Phil",
  "Anita",
  "Moe",
  "Dixie",
  "Al",
  "Patty",
  "Hugh",
  "Mike",
  "Sal",
  "Barry",
  "Willie",
  "Oliver",
  "Lou",
  "Tess"
];

const lastNames = [
  "Dover",
  "McCracken",
  "Butts",
  "Hugenkiss",
  "Wiener",
  "Cox",
  "Johnson",
  "Booty",
  "Balls",
  "Cheeks",
  "Sniffer",
  "Nuts",
  "Dump",
  "Rider",
  "Gobbler"
];

io.on('connection', (socket) => {
    // Pick one from the first list
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    // Pick one from the second list
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Combine them
    socket.userName = `${randomFirst} ${randomLast}`;
    
    console.log(socket.userName + " joined");
    
    // ... rest of your code
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
