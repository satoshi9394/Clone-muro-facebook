import express from 'express';
import socketio from 'socket.io';
//socket del cliente
import socketHandler from './src/server/socketHandler';

//connection with mysql data
import connection from './dataBase/mysql'

//variable global 
const store = [];
const allPostUser = []; 

/*let allPostUser = [
  {
    username: 'angel',
    post: '4'
  },
  {
    username: 'juan',
    post: '3'
  }
]*/

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

connection.query('select id, text, idSokect, userName, likes from post where status = 1',
(err, result) => {
  if(!err){
    result.forEach( item => {
      const data = {
        idDb: item.id,
        text: item.text,
        id: item.idSokect,
        username: item.userName,
        likes: item.likes
      }
      store.push(data);
    })
    connection.query('select userName, post from users where post > 0',
    (err, result)=> {
      if(!err){
        result.forEach(item => {
          const data = {
            username: item.userName,
            post: item.post
          }
          allPostUser.push(data)
        })
        io.on('connection', socketHandler(io, store, allPostUser));
      }else{
        console.log(err)
      }
    })
    //io.on('connection', socketHandler(io, store, allPostUser));
  }else{
    console.log(err)
  }
})
