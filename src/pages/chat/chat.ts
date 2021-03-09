import {Component} from '../../components/Component';
import {tmpl as chatRoomTmpl} from '../../blocks/chat-no-room/chatNoRoom.tmpl';
import {render} from '../../common/commonFunctions';
import {ChatLayout} from '../../layouts/chat';

export const noChatPage = new ChatLayout();

export const chatRoom = new Component(
    'main',
    {
        props: {},
        classes: ['chat-no-room']
    },
    chatRoomTmpl
);

render(noChatPage, chatRoom);
