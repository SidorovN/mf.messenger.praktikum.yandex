import { Component } from '../../components/Component.js';
import { tmpl as sidebarTmpl } from '../../blocks/sidebar/sidebar.tmpl.js';
import { tmpl as roomListTmpl } from '../../blocks/room-list/roomList.tmpl.js';
import { tmpl as chatRoomTmpl } from '../../blocks/chat-no-room/chatNoRoom.tmpl.js';
import { render } from '../../common/render.js';
const sideBar = new Component(
  'aside',
  {
    props: {},
    classes: ['sidebar'],
  },
  sidebarTmpl
);
const roomList = new Component(
  'nav',
  {
    props: {
      rooms: [
        {
          id: 'id.html',
          avatar:
            'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
          title: 'Андрей',
          time: '10:49',
          message: 'Изображение',
          notification: '2',
        },
        {
          id: 'id.html',
          avatar:
            'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
          title: 'Андрей',
          time: '10:49',
          message: 'Изображение',
          notification: '2',
        },
        {
          id: 'id.html',
          avatar:
            'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
          title: 'Андрей',
          time: '10:49',
          message: 'Изображение',
          notification: '2',
        },
      ],
    },
    classes: ['room-list'],
  },
  roomListTmpl
);
const chatRoom = new Component(
  'main',
  {
    props: {},
    classes: ['chat-no-room'],
  },
  chatRoomTmpl
);
render(sideBar, roomList);
render(document.querySelector('#page'), sideBar);
render(document.querySelector('#page'), chatRoom);
