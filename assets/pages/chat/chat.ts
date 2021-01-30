import {Component} from "../../components/Component.js";
import {tmpl as chatRoomTmpl} from "../../blocks/chat-no-room/chatNoRoom.tmpl.js"
import {render} from "../../common/render.js";

import {chatLayout} from "../../layouts/chat.js";

const chatRoom = new Component('main',{
    props: {},
    classes: ['chat-no-room'],
}, chatRoomTmpl);

render(chatLayout, chatRoom);
render(document.querySelector('#page'), chatLayout);
