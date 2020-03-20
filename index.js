import express from 'express';
import socketio from 'socket.io';
//socket del cliente
import socketHandler from './src/server/socketHandler';

//variable global 
const store = [];

const APP = express();

APP.use(express.static('dist'));
APP.set('views', './src/server/views');
APP.set('view engine', 'pug');


APP.get('/', (req, res) => {
  res.render('home');
});

const SERVER = APP.listen(5000);

const io = socketio(SERVER);

io.set('transports', ['websockets', 'polling']);
io.on('connection', socketHandler(io, store));
