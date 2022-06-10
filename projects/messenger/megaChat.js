import loginWindow from './ui/loginWindow.js';
import mainWindow from './ui/mainWindow.js';
import userName from './ui/userName.js';
import userList from './ui/userList.js';
import userPhoto from './ui/userPhoto.js';
import messageList from './ui/messageList.js';
import messageSender from './ui/messageSender.js';
import WSClient from './wsClient.js';

export default class megaChat {
  constructor() {
    this.wsClient = new WSClient(
      `ws://${location.host}/messenger/ws`,
      this.onMessage.bind(this)
    );

    this.ui = {
      loginWindow: new loginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      mainWindow: new mainWindow(document.querySelector('#main')),
      userName: new userName(document.querySelector('[data-role=user-name]')),
      userList: new userList(document.querySelector('[data-role=user-list]')),
      messageList: new messageList(document.querySelector('[data-role=messages-list]')),
      messageSender: new messageSender(
        document.querySelector('[data-role=message-sender]'),
        this.onSend.bind(this)
      ),
      userPhoto: new userPhoto(
        document.querySelector('[data-role=user-photo]'),
        this.onUpload.bind(this)
      ),
    };

    this.ui.loginWindow.show();
  }

  onUpload(data) {
    this.ui.userPhoto.set(data);

    fetch('/messenger/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.ui.userName.get(),
        image: data,
      }),
    });
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.ui.messageSender.clear();
  }

  async onLogin(name) {
    await this.wsClient.connect();
    this.wsClient.sendHello(name);
    this.ui.loginWindow.hide();
    this.ui.mainWindow.show();
    this.ui.userName.set(name);
    this.ui.userPhoto.set(`/messenger/photos/${name}.png?t=${Date.now()}`);
  }

  onMessage({ type, from, data }) {
    console.log(type, from, data);

    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageList.addSystemMessage(`${from} онлайн`);
    } else if (type === 'user-list') {
      for (const item of data) {
        this.ui.userList.add(item);
      }
    } else if (type === 'bye-bye') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} офлайн`);
    } else if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    } else if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(
        `[data-role=user-avatar][data-user=${data.name}]`
      );

      for (const avatar of avatars) {
        avatar.style.backgroundImage = `url(./messenger/photos/${
          data.name
        }.png?t=${Date.now()})`;
      }
    }
  }
}
