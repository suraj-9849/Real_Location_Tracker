const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(express.static('public'));  

io.on('connection', (socket) => {
    console.log("Connected!");

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/successful", (req, res) => {
    res.render('successShared');
});

server.listen(3000, () => {
    console.log("listening on port 3000");
});
