import './index.scss';
import './id.scss';

import exports from 'webpack';
import {Component} from '../../components/Component';
import {Button} from '../../components/Button';
import {Form} from '../../components/Form';
import {tmpl as chatRoomTmpl} from '../../blocks/chat-room/chatRoom.tmpl';
import {tmpl as chatRoomHeaderTmpl} from '../../blocks/chat-room-header/chatRoomHeader.tmpl';
import {tmpl as chatFormPopupTmpl} from '../../blocks/chat-room-form/chatRoomFormPopup.tmpl';
import {tmpl as chatFormTmpl} from '../../blocks/chat-room-form/chatRoomForm.tmpl';
import {tmpl as messagesTmpl} from '../../blocks/messages/messages.tmpl';
import {formDataParser, makeImageStyle, render} from '../../common/commonFunctions';
import {EventBus} from '../../components/EventBus';
import {HTTPTransport} from '../../components/HTTPTransport';
import {API_URL, BASE_URL, WS_URL} from '../../common/CONSTS';
import {ChatLayout} from '../../layouts/chat';

interface Imessage {
    time?: string;
    content?: string;
    userId?: number;
    user_id?: number;
}
const eventBus = new EventBus();
let socket: WebSocket;
const myUser = JSON.parse(localStorage.getItem('user'));

const xhr = new HTTPTransport();
export const chatPage = new ChatLayout('div', {
    props: {
        pk: '',
        rooms: [],
        activeRoom: {
            title: '',
            avatar: ''
        }
    },
    on: ['initLayout', initLayout],

    componentDidUpdate() {
        updatePage.call(this);
    },
    componentDidMount() {
        updatePage.call(this);
    }
});

const chatOpened = new Component('main', {
    props: {}
});

const inputs = [
    {
        label: 'Логин',
        value: '',
        type: 'text',
        name: 'login',
        errorMessage: '',
        errorClass: '',
        labelClass: '',
        spanClass: '',
        inputClass: 'input__input'
    }
];

const addUserProps = {
    title: 'Добавить пользователя',
    btnText: 'Добавить',
    inputs
};

const removeUserProps = {
    title: 'Удалить пользователя',
    btnText: 'Удалить',
    inputs
};

export const chatRoom = new Component(
    'main',
    {
        props: {
            pk: chatPage.props,
            room: chatPage.props.activeRoom
        },
        classes: ['chat-room']
    },
    chatRoomTmpl
);

const chatRoomHeader = new Component(
    'header',
    {
        props: {
            room: chatPage.props.activeRoom
        },
        classes: ['chat-room-header']
    },
    chatRoomHeaderTmpl
);

const avatarBtn = new Button(
    'button',
    {
        props: {
            style: ''
        },
        emitter: [
            {
                event: 'click',
                callback: () =>
                    chatPage._eventBus().emit(
                        'toggleUserPopup',
                        {
                            title: 'Сменить аватар',
                            btnText: 'Сменить',
                            inputs: [
                                {
                                    label: 'Выбрать файл на компьютере',
                                    value: '',
                                    type: 'file',
                                    name: 'avatar',
                                    errorMessage: '',
                                    errorClass: '',
                                    labelClass: 'popup__label popup__label_file',
                                    spanClass: 'popup__file-label-text',
                                    inputClass: 'popup__file-input'
                                }
                            ]
                        },
                        function () {
                            const data = this.getValues();
                            data.append('chatId', chatPage.props.pk);
                            xhr.put(`${API_URL}chats/avatar`, {
                                data
                            })
                                .then(res => {
                                    if (res.status >= 400) {
                                        Promise.reject(res);
                                    } else {
                                        return res.response;
                                    }
                                })
                                .then(() => {})
                                .catch(err => {
                                    console.warn(new Error(err));
                                });
                        }
                    )
            }
        ],
        classes: ['chat-room-header__avatar-btn']
    },
    '<div class="chat-room-header__avatar" style="{{style}}"></div>'
);

const openHeaderPopupBtn = new Button(
    'button',
    {
        props: {},
        emitter: [
            {
                event: 'click',
                callback: () => eventBus.emit('toggleHeaderPopup')
            }
        ],
        classes: ['chat-room__detail', 'chat-room__detail_active', 'js-open-room-popup']
    },
    ''
);

const addUserBtn = new Button('button', {
    props: {
        text: `
<svg class="chat-room__popup-icon" width="22" height="22" viewBox="0 0 22 22"
fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10.25"
    fill="#3369F3" stroke="#3369F3" stroke-width="1.5"></circle>
        <line x1="10.9999" y1="5.5"
        x2="10.9999" y2="16.5" stroke="#EAEAEA" stroke-width="1.5"></line>
        <line x1="5.49988" y1="11"
        x2="16.4999" y2="11" stroke="#EAEAEA" stroke-width="1.5"></line>
        </svg>
    Добавить пользователя
`
    },
    emitter: [
        {
            event: 'click',
            callback: () =>
                chatPage._eventBus().emit('toggleUserPopup', addUserProps, function () {
                    xhr.post(`${API_URL}user/search`, {
                        headers: {
                            'content-type': 'application/json'
                        },
                        data: JSON.stringify(formDataParser(this.getValues()))
                    }).then(res => {
                        const users = res.response.map(user => user.id);
                        xhr.put(`${API_URL}chats/users`, {
                            headers: {
                                'content-type': 'application/json'
                            },
                            data: JSON.stringify({
                                users,
                                chatId: chatPage.props.pk
                            })
                        }).then(() => {
                            chatPage._eventBus().emit('toggleUserPopup');
                        });
                    });
                })
        }
    ],
    classes: ['chat-room__popup-row']
});

const headerPopup = new Component(
    'div',
    {
        props: {},
        classes: [
            'popup',
            'chat-room__popup',
            'chat-room__popup_room',
            'js-room-popup',
            'popup_opened'
        ]
    },
    ''
);

const removeUserBtn = new Button('button', {
    props: {
        text: `
        <svg class="chat-room__popup-icon" width="22" height="22"
        viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="transform: rotate(45deg)">
            <circle cx="11" cy="11"
            r="10.25" fill="#3369F3" stroke="#3369F3" stroke-width="1.5"></circle>
                <line x1="10.9999"
                y1="5.5" x2="10.9999" y2="16.5" stroke="#EAEAEA" stroke-width="1.5"></line>
                <line x1="5.49988"
                y1="11" x2="16.4999" y2="11" stroke="#EAEAEA" stroke-width="1.5"></line>
                </svg>
        Удалить пользователя
`
    },
    emitter: [
        {
            event: 'click',
            callback: () => {
                chatPage._eventBus().emit('toggleUserPopup', removeUserProps, function () {
                    xhr.post(`${API_URL}user/search`, {
                        headers: {
                            'content-type': 'application/json'
                        },
                        data: JSON.stringify(formDataParser(this.getValues()))
                    }).then(res => {
                        const users = res.response.map(user => user.id);
                        xhr.delete(`${API_URL}chats/users`, {
                            headers: {
                                'content-type': 'application/json'
                            },
                            data: JSON.stringify({
                                users,
                                chatId: chatPage.props.pk
                            })
                        }).then(() => {
                            // CreateChatForm.emit('toggleUserPopup')
                        });
                    });
                });
            }
        }
    ],
    classes: ['chat-room__popup-row']
});

const messages = new Component(
    'ul',
    {
        props: {
            messages: []
        },
        classes: ['messages']
    },
    messagesTmpl
);

const chatFrom = new Form(
    {
        props: {},
        emitChange() {},
        onSubmit() {
            socket.send(
                JSON.stringify({
                    content: this.getValues().get('message'),
                    type: 'message'
                })
            );
            chatFrom._element.reset();
        },
        classes: ['chat-room__form', 'js-form']
    },
    ''
);

const formPopup = new Component(
    'div',
    {
        props: {},
        classes: [
            'popup',
            'chat-room__popup',
            'chat-room__popup_attach',
            'js-attach-popup',
            'popup_opened'
        ]
    },
    chatFormPopupTmpl
);

const openFormPopupBtn = new Button('button', {
    props: {
        text: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.18662 13.5L14.7628 5.92389L15.7056
            6.8667L8.12943 14.4428L7.18662 13.5Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.70067 16.0141L17.2768 8.43793L18.2196 9.38074L10.6435
            16.9569L9.70067 16.0141Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M15.0433 21.3567L22.6195 13.7806L23.5623 14.7234L15.9861
            22.2995L15.0433 21.3567Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17.5574 23.8708L25.1335 16.2946L26.0763 17.2374L18.5002
            24.8136L17.5574 23.8708Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17.5574 23.8709C14.9423 26.486
            10.7118 26.4954 8.10831 23.8919C5.50482 21.2884 5.51424 17.0579 8.12936
            14.4428L7.18655 13.5C4.0484 16.6381 4.0371 21.7148 7.16129 24.839C10.2855 27.9632
            15.3621 27.9518 18.5003 24.8137L17.5574 23.8709Z"
            fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M22.6195 13.7806L23.5623 14.7234C26.003 12.2826 26.0118 8.3341 23.5819
            5.90417C21.152 3.47424 17.2035 3.48303 14.7627 5.92381L15.7055 6.86662C17.6233 4.94887
            20.7257 4.94196 22.6349 6.85119C24.5441 8.76042 24.5372 11.8628 22.6195 13.7806Z"
            fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.70092 16.0144C7.95751 17.7578 7.95123 20.5782 9.68689 22.3138C11.4226 24.0495
            14.2429 24.0432 15.9863 22.2998L15.0435 21.357C13.8231 22.5774 11.8489 22.5818 10.6339
            21.3668C9.41894 20.1518 9.42334 18.1776 10.6437 16.9572L9.70092 16.0144Z"
            fill="#999999"/>
    </svg>`
    },
    attrs: {
        type: 'button'
    },
    emitter: [
        {
            event: 'click',
            callback: () => eventBus.emit('toggleAttachPopup')
        }
    ],
    classes: ['chat-room__form-attach-btn', 'chat-room__form-attach-btn_active', 'js-open-attach']
});

const formInput = new Component(
    'label',
    {
        props: {},
        classes: ['chat-room__message-label']
    },
    chatFormTmpl
);

const formSubmitBtn = new Button('button', {
    props: {},
    classes: ['chat-room__submit']
});

formPopup.hide();
headerPopup.hide();

eventBus.on('toggleAttachPopup', formPopup.toggle);
eventBus.on('toggleHeaderPopup', headerPopup.toggle);

eventBus.on('emitChange', (form, state, input, message = '') => {
    const inputs = [...form.props.inputs];
    inputs.forEach(elem => {
        if (elem.name === input.name) {
            elem.errorMessage = message;
            elem.errorClass = state ? '' : '_error';
            elem.value = input.value;
        }
    });

    form.props.inputs = inputs;
});

function updatePage() {
    if (this.props.pk) {
        chatRoomHeader.props.room = this.props.rooms.length ?
            this.props.rooms.find(room => room.id == this.props.pk) :
            chatRoomHeader.props.room;
        setAvatar(chatRoomHeader.props.room.avatar);
        xhr.post(`${API_URL}chats/token/${this.props.pk}`, {
            headers: {
                mode: 'cors',
                credentials: 'include'
            }
        })
            .then(response => response.response)
            .then(data => {
                console.log('token', data.token);

                socket = new WebSocket(`${WS_URL}${myUser.id}/${this.props.pk}/${data.token}`);
                socket.addEventListener('open', () => {
                    console.log('Соединение установлено');

                    // Socket.send(JSON.stringify({
                    //     content: 'Моё первое сообщение миру!',
                    //     type: 'message',
                    // }));

                    socket.send(
                        JSON.stringify({
                            content: '0',
                            type: 'get old'
                        })
                    );
                });

                socket.addEventListener('close', event => {
                    if (event.wasClean) {
                        console.log('Соединение закрыто чисто');
                    } else {
                        console.log('Обрыв соединения');
                    }

                    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
                });

                socket.addEventListener('message', event => {
                    if (!(event.data === 'user connected')) {
                        const data = parseMessage([].concat(JSON.parse(event.data)));
                        messages.props.messages = data.concat(messages.props.messages);
                        console.log(messages.props.messages, 'messages.props.messages');
                        if (event.type === 'get old') {
                            console.log('старые сообщения', event.data);
                        } else {
                            console.log('Новые сообщения', event.data);
                        }
                    }
                });

                socket.addEventListener('error', (event: Event) => {
                    console.log('Ошибка', event);
                });
                console.log('socket', socket);
            });

        xhr.get(`${API_URL}chats/${this.props.pk}/users`, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}

function setAvatar(src) {
    avatarBtn.props.style = src ? makeImageStyle(BASE_URL + src) : ' ';
}

function parseMessage(arr: Imessage[]) {
    return arr.map(({time, content, userId, user_id}) => {
        const date = time.replace(/\S+[T]/, '').replace(/[:]\d{2}[+]\S+/, '');
        return {
            time: date,
            content,
            author: user_id === myUser.id || userId === myUser.id ? 'my' : 'not-my'
        };
    });
}

function initLayout() {
    render(chatPage, chatRoom);

    render(chatRoom, chatRoomHeader);
    render(chatRoom, messages);
    render(chatRoom, chatFrom);
    render(chatFrom, formPopup);
    render(chatFrom, openFormPopupBtn);
    render(chatFrom, formInput);
    render(chatFrom, formSubmitBtn);
    render(chatRoomHeader, openHeaderPopupBtn);
    render(chatRoomHeader, avatarBtn);
    render(headerPopup, addUserBtn);
    render(headerPopup, removeUserBtn);
    render(chatRoomHeader, headerPopup);
}
