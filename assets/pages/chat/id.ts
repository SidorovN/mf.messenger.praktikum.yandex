import {Component} from "../../components/Component.js";
import {Button} from "../../components/Button.js";
import {Form} from "../../components/Form.js";
import {tmpl as chatRoomTmpl} from "../../blocks/chat-room/chatRoom.tmpl.js"
import {tmpl as chatRoomHeaderTmpl} from "../../blocks/chat-room-header/chatRoomHeader.tmpl.js"
import {tmpl as chatFormPopupTmpl} from "../../blocks/chat-room-form/chatRoomFormPopup.tmpl.js"
import {tmpl as chatFormTmpl} from "../../blocks/chat-room-form/chatRoomForm.tmpl.js"
import {tmpl as messagesTmpl} from "../../blocks/messages/messages.tmpl.js"
import {tmpl as popupTmpl} from "../../blocks/popup/popup.tmpl.js"
import {render} from "../../common/render.js";
import {EventBus} from "../../components/EventBus.js";
import {chatLayout} from "../../layouts/chat.js";

const eventBus = new EventBus()

const addUserProps = {
    title: 'Добавить пользователя',
    btnText: 'Добавить'
}

const removeUserProps = {
    title: 'Удалить пользователя',
    btnText: 'Удалить'
}

const chatRoom = new Component('main', {
    props: {},
    classes: ['chat-room'],
}, chatRoomTmpl);


const chatRoomHeader = new Component('header', {
    props: {
        name: 'Андрей',
        avatar: 'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg'
    },
    classes: ['chat-room-header'],
}, chatRoomHeaderTmpl);

const openHeaderPopupBtn = new Button('button', {
    props: {},
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleHeaderPopup')
    }],
    classes: ['chat-room__detail', 'chat-room__detail_active', 'js-open-room-popup'],
}, '')

const addUserBtn = new Button('button', {
    props: {
        text: `
<svg class="chat-room__popup-icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10.25" fill="#3369F3" stroke="#3369F3" stroke-width="1.5"></circle>
        <line x1="10.9999" y1="5.5" x2="10.9999" y2="16.5" stroke="#EAEAEA" stroke-width="1.5"></line>
        <line x1="5.49988" y1="11" x2="16.4999" y2="11" stroke="#EAEAEA" stroke-width="1.5"></line>
        </svg>
    Добавить пользователя
`,
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleUserPopup',addUserProps)
    }],
    classes: ['chat-room__popup-row'],
})

const headerPopup = new Component('div', {
    props: {},
    classes: ['popup', 'chat-room__popup', 'chat-room__popup_room', 'js-room-popup', 'popup_opened']
}, '')

const removeUserBtn = new Button('button', {
    props: {
        text: `
        <svg class="chat-room__popup-icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(45deg)">
            <circle cx="11" cy="11" r="10.25" fill="#3369F3" stroke="#3369F3" stroke-width="1.5"></circle>
                <line x1="10.9999" y1="5.5" x2="10.9999" y2="16.5" stroke="#EAEAEA" stroke-width="1.5"></line>
                <line x1="5.49988" y1="11" x2="16.4999" y2="11" stroke="#EAEAEA" stroke-width="1.5"></line>
                </svg>
        Удалить пользователя
`
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleUserPopup',removeUserProps)
    }],
    classes: ['chat-room__popup-row'],
})

const messages = new Component('ul', {
    props: {
        messages: [
            {
                text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.!',
                time: '4:20',
                author: 'not-my'
            }, {
                text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.!',
                time: '4:20',
                author: 'my'
            },
        ]
    },
    classes: ['messages'],
}, messagesTmpl);

const chatFrom = new Form({
    props: {
        messages: [
            {
                text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.!',
                time: '4:20',
                author: 'not-my'
            }, {
                text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.!',
                time: '4:20',
                author: 'my'
            },
        ]
    },
    classes: ['chat-room__form', 'js-form'],
}, '');

const formPopup = new Component('div', {
    props: {},
    classes: ['popup', 'chat-room__popup', 'chat-room__popup_attach', 'js-attach-popup', 'popup_opened']
}, chatFormPopupTmpl)

const openFormPopupBtn = new Button('button', {
    props: {
        text: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.18662 13.5L14.7628 5.92389L15.7056 6.8667L8.12943 14.4428L7.18662 13.5Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.70067 16.0141L17.2768 8.43793L18.2196 9.38074L10.6435 16.9569L9.70067 16.0141Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M15.0433 21.3567L22.6195 13.7806L23.5623 14.7234L15.9861 22.2995L15.0433 21.3567Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17.5574 23.8708L25.1335 16.2946L26.0763 17.2374L18.5002 24.8136L17.5574 23.8708Z" fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M17.5574 23.8709C14.9423 26.486 10.7118 26.4954 8.10831 23.8919C5.50482 21.2884 5.51424 17.0579 8.12936 14.4428L7.18655 13.5C4.0484 16.6381 4.0371 21.7148 7.16129 24.839C10.2855 27.9632 15.3621 27.9518 18.5003 24.8137L17.5574 23.8709Z"
            fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M22.6195 13.7806L23.5623 14.7234C26.003 12.2826 26.0118 8.3341 23.5819 5.90417C21.152 3.47424 17.2035 3.48303 14.7627 5.92381L15.7055 6.86662C17.6233 4.94887 20.7257 4.94196 22.6349 6.85119C24.5441 8.76042 24.5372 11.8628 22.6195 13.7806Z"
            fill="#999999"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.70092 16.0144C7.95751 17.7578 7.95123 20.5782 9.68689 22.3138C11.4226 24.0495 14.2429 24.0432 15.9863 22.2998L15.0435 21.357C13.8231 22.5774 11.8489 22.5818 10.6339 21.3668C9.41894 20.1518 9.42334 18.1776 10.6437 16.9572L9.70092 16.0144Z"
            fill="#999999"/>
    </svg>`
    },
    attrs: {
        type: 'button'
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleAttachPopup')
    }],
    classes: ['chat-room__form-attach-btn', 'chat-room__form-attach-btn_active', 'js-open-attach'],
})


const formInput = new Component('label', {
    props: {},
    classes: ['chat-room__message-label']
}, chatFormTmpl)

const formSubmitBtn = new Button('button', {
    props: {},
    classes: ['chat-room__submit'],
})

const userPopup = new Component('div', {
    props: {},
    classes: ['popup', 'popup_with_overlay', 'popup_opened'],

    emitter: [{
        event: 'click',
        callback: (e) => {
            if(e.target === e.currentTarget) {
                eventBus.emit('toggleUserPopup')
            }
        }
    }],
}, '')

const userPopupForm = new Form({
    props: addUserProps,
    classes: ['popup__content']
}, popupTmpl)

formPopup.hide()
headerPopup.hide()
userPopup.hide()

eventBus.on('toggleAttachPopup', formPopup.toggle)
eventBus.on('toggleHeaderPopup', headerPopup.toggle)
eventBus.on('toggleUserPopup', (props)=> {
    userPopup.toggle()
    if(props){
        headerPopup.props = props
    }
})



render(chatLayout, chatRoom);

render(chatRoom, chatRoomHeader);
render(chatRoom, messages);
render(chatRoom, chatFrom);
render(chatFrom, formPopup);
render(chatFrom, openFormPopupBtn);
render(chatFrom, formInput);
render(chatFrom, formSubmitBtn);
render(chatRoomHeader, openHeaderPopupBtn);
render(headerPopup, addUserBtn);
render(headerPopup, removeUserBtn);
render(chatRoomHeader, headerPopup);
render(userPopup, userPopupForm);

render(document.querySelector('#page'), userPopup);
render(document.querySelector('#page'), chatLayout);

