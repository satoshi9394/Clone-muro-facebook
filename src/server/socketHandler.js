export default (io, store) => socket => {
  //console.log('start sockets');
  let username = 'Anonimo';

  if (store.length > 0) io.emit('broadcastStore', store);

  socket.on('sendStore', text => {
    const data = {
      text,
      id: socket.id,
      username,
      likes: 0
    };
    store.push(data);
    io.emit('broadcastStore', store);
  });

  socket.on('change_username', data => {
    username = data.username;
  });

  socket.on('sendLike', like => {
    const currentText = store.find(item => item.text === like.message);
    currentText.likes += 1;
    io.emit('broadcastStore', store);
  });

  socket.on('deleteMsg', msg => {
    const currentText = store.find(item => item.text === msg.text);
    if (socket.id === currentText.id) {
      store = store.filter(item => item.text !== msg.text);
      io.emit('broadcastStore', store);
    }
  });
};
