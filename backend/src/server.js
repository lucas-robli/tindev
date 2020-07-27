const express = require('express');
const moongose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {}

io.on('connection', socket => {
    const {user} = socket.handshake.query;
    
    console.log(user, socket.id);

    connectedUsers[user] = socket.id;

});

moongose.connect('mongodb+srv://lucas:12345@cluster0.v83ma.mongodb.net/tinder?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    next();
});



app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(3333);