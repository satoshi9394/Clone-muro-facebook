import connection from '../../dataBase/mysql'
import {matchHash , createToken, validateToken } from '../../utils/tockets'

export default (io, store) => socket => {
  let username = 'Anonimo';

  socket.on('DoLogin', (data)=> {
    console.log(data)
    connection.query('select * from users where userName = ?',[data.userName], (err, result) => {
      if(!err){
        if(result.length === 1){
          if(matchHash(data.password, result[0].pass)){
            username = data.userName
            const token = createToken({userName: data.userName});
            io.emit('successLogi', token)
          }else{
            console.log('entre a falla de credencial')
            io.emit('failedLogin', 'password not fout')
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
        const data = {
          text,
          id: socket.id,
          username,
          likes: 0
        };
        connection.query('insert into post (text, idSokect, userName, likes,status) values(?,?,?,?,?)'
        ,[ text , socket.id , username , 0 , 1 ], (err, result)=>{
          if(!err){
            console.log(result)
            store.push(data);
            io.emit('broadcastStore', store);
          }else{
            console.log(err)
          }
        })
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
  });

  socket.on('sendLike', ( like, token ) => {
    console.log(like)
    console.log(token)
    try{
      if(validateToken(token)) {
        console.log('entre a token')
        const currentText = store.find(item => item.text === like.message);
        currentText.likes += 1;
        io.emit('broadcastStore', store);
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
  });

  socket.on('deleteMsg', ( msg ,token ) => {
    try{
      if(validateToken(token)) {
        console.log('entre a token')
        const currentText = store.find(item => item.text === msg.text);
        if (socket.id === currentText.id) {
          store = store.filter(item => item.text !== msg.text);
          io.emit('broadcastStore', store);
        }
      }else{
        console.log('fallo validar token')
      }
    }catch (err) {
      console.log('fallo',err.message)
      io.emit('expiro', 'Expiro el token')
    }  
  });
};
