import {Button} from '../components/Button';
import {Component} from '../components/Component';
import {tmpl as sidebarTmpl} from '../blocks/sidebar/sidebar.tmpl';
import {tmpl as roomListTmpl} from '../blocks/room-list/roomList.tmpl';
import {formDataParser, makeImageStyle, render} from '../common/commonFunctions';
import {HTTPTransport} from '../components/HTTPTransport';
import {API_URL, BASE_URL} from '../common/CONSTS';
import {Form} from '../components/Form';
import {tmpl as popupTmpl} from '../blocks/popup/popup.tmpl';
import {Router} from '../components/Router';

export class ChatLayout extends Component {
    constructor(tagName = 'div', config = {}, tmpl = '') {
        super(tagName, {classes: ['root', 'chat'], props: {}, ...config}, tmpl);
        this.setOn(['initLayout', initLayout.bind(this)]);
        this.needInit = true;
    }

    init = () => {
        this._eventBus().emit('initLayout');
        this.needInit = false;
        super.init();
    };
}

const router = new Router('#page');
const xhr = new HTTPTransport();
const createChatProps = {
    title: 'Создать новый чат',
    btnText: 'Создать',
    inputs: [
        {
            label: 'Название чата',
            value: '',
            type: 'text',
            name: 'title',
            errorMessage: '',
            errorClass: '',
            labelClass: '',
            spanClass: '',
            inputClass: 'input__input'
        }
    ]
};

const chatForm = new Form(
    {
        props: createChatProps,
        classes: ['popup__content'],

        emitChange: () => {}
        // OnSubmit: (e) => {
        //
        // }
    },
    popupTmpl
);

function initLayout() {
    const self = this;
    const popup = new Component(
        'div',
        {
            props: {},
            classes: ['popup', 'popup_with_overlay', 'popup_opened'],

            emitter: [
                {
                    event: 'click',
                    callback(e) {
                        if (e.target === e.currentTarget) {
                            self._eventBus().emit('toggleUserPopup');
                        }
                    }
                }
            ]
        },
        ''
    );

    const popupForm = new Form(
        {
            props: createChatProps,
            classes: ['popup__content'],

            emitChange: () => {},
            onSubmit: e => {}
        },
        popupTmpl
    );

    const xhr = new HTTPTransport();
    xhr.get(`${API_URL}chats`, {
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(res => {
            if (res.status >= 400) {
                Promise.reject(res);
            } else {
                return res.response;
            }
        })
        .then(res => {
            const rooms = res.map(el => {
                return {...el,
                    style: makeImageStyle(BASE_URL + el.avatar)
                };
            });

            console.log(res, rooms);
            roomList.props.rooms = rooms;
            this.props.rooms = rooms;
        })
        .catch(err => {
            console.warn(new Error(err));
        });

    const sideBar = new Component(
        'aside',
        {
            props: {},
            classes: ['sidebar']
        },
        sidebarTmpl
    );
    const roomList = new Component(
        'nav',
        {
            props: {
                rooms: []
            },
            classes: ['room-list']
        },
        roomListTmpl
    );
    const createChatBtn = new Button(
        'button',
        {
            props: {},
            emitter: [
                {
                    event: 'click',
                    callback(e) {
                        self._eventBus().emit('toggleUserPopup', createChatProps, () => {
                            xhr.post(`${API_URL}chats`, {
                                headers: {
                                    'content-type': 'application/json'
                                },
                                data: JSON.stringify(formDataParser(popupForm.getValues()))
                            })
                                .then(res => {
                                    if (res.status >= 400) {
                                        Promise.reject(res);
                                    } else {
                                        return res.response;
                                    }
                                })
                                .then(res => {
                                    router.go(`/chat/${res.id}`);
                                })
                                .catch(err => {
                                    throw new Error(err);
                                });
                        });
                    }
                }
            ],

            classes: ['button']
        },
        'Создать чат'
    );

    const createChatPopup = new Component(
        'div',
        {
            props: {},
            classes: ['popup', 'popup_with_overlay', 'popup_opened'],
            emitter: [
                {
                    event: 'click',
                    callback: e => {
                        if (e.target === e.currentTarget) {
                            self._eventBus().emit('toggleUserPopup', {});
                        }
                    }
                }
            ]
        },
        ''
    );

    this._eventBus().on('toggleUserPopup', (props, onSubmit) => {
        if (props) {
            popupForm.props.title = props.title;
            popupForm.props.btnText = props.btnText;
            popupForm.props.inputs = props.inputs;
        }

        if (onSubmit) {
            popupForm.onSubmit = onSubmit.bind(popupForm);
        }

        popup.toggle();
    });

    popup.hide();

    render(popup, popupForm);
    render(this, popup);
    render(this, sideBar);
    render(sideBar, roomList);
    render(sideBar, createChatBtn);
}
