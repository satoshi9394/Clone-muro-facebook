export default socketClient => {
  const storeText = document.getElementById('store-text');
  const sendStore = document.getElementById('send-store');
  const store = document.getElementById('store');
  const userName = document.getElementById('username');
  const changeUserName = document.getElementById('change-username');

  sendStore.addEventListener('click', () => {
    if (storeText.value.length > 0){
      socketClient.emit('sendStore', storeText.value)
    };
  });

  changeUserName.addEventListener('click', () => {
    socketClient.emit('change_username', { username: userName.value });
  });

  const sendLike = text => {
    const like = { message: text };
    socketClient.emit('sendLike', like);
  };

  const sendDelete = (id, text) => {
    const msg = { id: id, text: text };
    socketClient.emit('deleteMsg', msg);
  };

  return {
    sendLike,
    sendDelete,
    store
  };
};
