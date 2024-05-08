// Server-side

const express = require('express');
const socket = require("socket.io");

const app = express();
const port = 3000;

const server = app.listen(port, function () {
    console.log(`App listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});

app.use(express.static("client"));

const io = socket(server);

const users = new Set();

io.on("connection", function (socket) {
    console.log("Client connected to Server");

    socket.on("user connect", function (data) {
        console.log(`Hello ${data} from Server`);
        users.add(data);
        socket.user = data;
        io.emit("new user", [...users]);
    });

    socket.on("chat message", function (data) {
        console.log(`Server chat message: user ${data.user} says ${data.msg}`);
        io.emit("chat message", data);
    });
    
    socket.on("disconnect", function () {
        console.log(`Client ${socket.user} disconnected from Server`);
        users.delete(socket.user);
        io.emit("user disconnect", socket.user);
    });

});