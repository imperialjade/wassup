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

// Helper function to send the current count to EVERYONE
// Place this right ABOVE your io.on('connection') block
function broadcastUserCount() {
    const count = io.engine.clientsCount; 
    io.emit('user-count', count);
}

io.on('connection', (socket) => {
    // 1. Pick a unique random name
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    socket.userName = `${randomFirst} ${randomLast}`;
    
    // 2. Grab the visitor's real IP address from Render
    const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    const realIp = clientIp ? clientIp.split(',')[0] : "Unknown IP";

    // Log the event to your Render console
    console.log(`${socket.userName} joined from IP: ${realIp}`);
    
    // 3. Update the online counter for everyone immediately
    broadcastUserCount();
    
    // 4. Handle incoming messages
    socket.on('chat message', (msg) => {
        const data = {
            name: socket.userName,
            text: msg
        };
        io.emit('chat message', data);
    });

    // 5. Handle when someone leaves
    socket.on('disconnect', () => {
        console.log(`${socket.userName} disconnected`);
        // Force the count to drop instantly for everyone remaining
        broadcastUserCount();
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
