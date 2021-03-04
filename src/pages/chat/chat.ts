import {Component} from "../../components/Component.js";
import {tmpl as chatRoomTmpl} from "../../blocks/chat-no-room/chatNoRoom.tmpl.js"
import {render} from "../../common/commonFunctions.js";
import {ChatLayout} from "../../layouts/chat.js";

export const noChatPage = new ChatLayout()

export const chatRoom = new Component('main',{
    props: {},
    classes: ['chat-no-room'],
}, chatRoomTmpl);

render(noChatPage, chatRoom)
