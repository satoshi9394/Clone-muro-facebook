const tokenUi = ''

export default (socketClient, ui) => {
  socketClient.on('broadcastStore', store => {
    ui.store.innerHTML = '';
    store.forEach(item => {
      ui.store.innerHTML += `
        <div class="col s12">
          <div class="row">
            <div class="col s2">
              <div class="card blue accent-3">
                <p>${item.username}</p>
                <p>likes ${item.likes}</p>
              </div>  
            </div>
            <div class="col s10">
              <div class="card blue accent-3">
                <p>${item.text}</p>
              </div>  
            </div>
            <div classs="col s12">  
              <button class="waves-effect waves-light btn blue" onClick="window.ui.sendLike('${item.text}')">
                <i class="material-icons">thumb_up</i>
              </button>  
              <button class="waves-effect waves-light btn red" onClick="window.ui.sendDelete('${item.id}', '${item.text}')">
                <i class="material-icons">delete_sweep</i>
              </button>
            </div>  
          </div> 
        </div>
      `;
    });
  });

  socketClient.on('successLogi', (token) => {
    ui.updateClientData(token)
    ui.loginForm.style.display = 'none';
    ui.wall.style.display = 'block'
  })

  socketClient.on('expiro', msg => {
    console.log(msg)
    ui.loginForm.style.display = 'block';
    ui.wall.style.display = 'none'
  })

};
