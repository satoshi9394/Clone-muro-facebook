import express from 'express';
import socketio from 'socket.io';
//socket del cliente
import socketHandler from './src/server/socketHandler';

//connection with mysql data
import connection from './dataBase/mysql'

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

connection.query('select text, idSokect, userName, likes from post where status = 1',
(err, result) => {
  if(!err){
    //console.log(result)
    result.forEach( item => {
      const data = {
        text: item.text,
        id: item.idSokect,
        username: item.userName,
        likes: item.likes
      }
      //console.log(data);
      store.push(data);
      console.log(store)
    })
    io.on('connection', socketHandler(io, store));
  }else{
    console.log(err)
  }
})
//io.on('connection', socketHandler(io, store));
