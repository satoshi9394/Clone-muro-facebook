export default socketClient => {
  const storeText = document.getElementById('store-text');
  const sendStore = document.getElementById('send-store');
  const store = document.getElementById('store');


  const loginForm = document.getElementById('login');
  const userNameLogin = document.getElementById('userName')
  const password = document.getElementById('password')
  const doLogin = document.getElementById('do-login')

  const clientData = {
    token: ''
  }

  function updateClientData(token){
    clientData.token = token
  }

  const wall = document.getElementById('wall');
  wall.style.display = 'none' 

  doLogin.addEventListener('click', () => {
    if (userNameLogin.value.length > 0 && password.value.length > 0){
      socketClient.emit('DoLogin', {userName: userNameLogin.value, password:password.value })
    };
  });

  sendStore.addEventListener('click', () => {
    if (storeText.value.length > 0){
      socketClient.emit('sendStore', storeText.value, clientData.token)
    };
  });

  const sendLike = text => {
    const like = { message: text };
    socketClient.emit('sendLike', like, clientData.token);
  };

  const sendDelete = (id, text) => {
    const msg = { id: id, text: text };
    socketClient.emit('deleteMsg', msg ,clientData.token);
  };

  return {
    sendLike,
    sendDelete,
    store,
    wall,
    loginForm,
    updateClientData
  };
};
