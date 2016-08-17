import io from 'socket.io-client';
import { store } from './index';
import { getAllMessages } from './actions/chat';
import { getPrivateMessages } from './actions/chat';
import { findFriend } from './helpers/friendHelpers';

let options = {
  'force new connection': true
};

// let socket = io('http://localhost:3000/test', options);
let socket = io('https://face-board.herokuapp.com/test', options);

socket.on('userHasJoinedSession', (mes) => {
  global.phone = PHONE({
    number: global.localStorage.username,
    publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
    subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
    media: {
      audio: true,
      video:
      {
        height:200,
        width:280
      }
    },
    ssl: true
  });

  phone.ready(() => {
    let secondName = global.localStorage.roomname.split('*')[1];
    let session = phone.dial(secondName);
  });

  phone.receive((session) => {

    session.connected((session) => {
      document.getElementById('remoteVideo').appendChild(session.video);
    });
  })
});

socket.on('userHasLeftSession', (mes) => {
  console.log(mes);
});

socket.on('user connected', (data) => {
  console.log(data);
  socket.emit('make sesssion', 'User has connected');
});

socket.on('send message', (data) => {
  store.dispatch(getAllMessages());
});

socket.on('send private message', (data) => {
  let userTwo = global.localStorage.seconduserid;
  findFriend();
  store.dispatch(getPrivateMessages(userTwo));
});

socket.on('confirm private chat', (data) => {
  if (data.seconduserid === global.localStorage.userid) {
    global.localStorage.pchat = data.pchat;
    socket.emit('join pchat', data);
  }
});

socket.on('pchat confirmed', (data) => {
  console.log('P CHAT CONFIRMED');
})

export default socket;
