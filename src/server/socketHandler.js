import connection from '../../dataBase/mysql'
import {matchHash , createToken, validateToken } from '../../utils/tockets'

export default (io, store) => socket => {
  //console.log('start sockets');
  let username = 'Anonimo';

  socket.on('DoLogin', (data)=> {
    console.log(data)
    connection.query('select * from users where userName = ?',[data.userName], (err, result) => {
      if(!err){
        if(result.length === 1){
          if(matchHash(data.password, result[0].pass)){
            const token = createToken({userName: data.userName});
            io.emit('successLogi', token)
          }else{
            console.log('entre a falla de credencial')
            io.emit('failedLogin', 'invalido usuario')
          }
        }else{
          io.emit('failedLogin', 'user not fout')
        }
      }else{
        io.emit('failedLogin', err.message)
      }
    })
  })

  if (store.length > 0) io.emit('broadcastStore', store);

  socket.on('sendStore', (text,token) => {
    try{
      if(validateToken(token)) {
        console.log('entre a token')
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
    const data = {
      text,
      id: socket.id,
      username,
      likes: 0
    };
    store.push(data);
    io.emit('broadcastStore', store);
  });

  socket.on('change_username', (data,token) => {
    try{
      if(validateToken(token)) {
        console.log('entre a token')
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
    username = data.username;
  });

  socket.on('sendLike', (like,token) => {
    try{
      if(validateToken(token)) {
        console.log('entre a token')
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
    const currentText = store.find(item => item.text === like.message);
    currentText.likes += 1;
    io.emit('broadcastStore', store);
  });

  socket.on('deleteMsg', (msg,token) => {
    try{
      if(validateToken(token)) {
        console.log('entre a token')
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
    const currentText = store.find(item => item.text === msg.text);
    if (socket.id === currentText.id) {
      store = store.filter(item => item.text !== msg.text);
      io.emit('broadcastStore', store);
    }
  });
};
