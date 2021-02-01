import {Button} from "../components/Button.js";
import {Component} from "../components/Component.js";
import {tmpl as btnTmpl} from "../blocks/btn/btn.tmp.js"
import {tmpl as sidebarTmpl} from "../blocks/sidebar/sidebar.tmpl.js"
import {tmpl as roomListTmpl} from "../blocks/room-list/roomList.tmpl.js"
import {render} from "../common/render.js";

export const chatLayout = new Component('div',{
    props: {},
    classes: ['root','chat']
})

    const sideBar = new Component('aside', {
        props: {},
        classes: ['sidebar'],
    }, sidebarTmpl);
    const roomList = new Component('nav', {
        props: {
            rooms: [
                {
                    id: 'id.html',
                    avatar: 'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
                    title: 'Андрей',
                    time: '10:49',
                    message: 'Изображение',
                    notification: '2'
                }, {
                    id: 'id.html',
                    avatar: 'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
                    title: 'Андрей',
                    time: '10:49',
                    message: 'Изображение',
                    notification: '2'
                }, {
                    id: 'id.html',
                    avatar: 'https://natalyland.ru/wp-content/uploads/e/1/9/e19f5d19fca32c1f6ddc27ad19054a9a.jpg',
                    title: 'Андрей',
                    time: '10:49',
                    message: 'Изображение',
                    notification: '2'
                },
            ]
        },
        classes: ['room-list'],
    }, roomListTmpl);

    const submitBtn = new Button('button', {
        props: {
            text: 'Авторизоваться'
        },
        classes: ['btn', 'btn_blue', 'login__btn'],
        attrs: {}
    }, btnTmpl)

    const loginBtn = new Button('a', {
        props: {
            text: 'Нет аккаунта?'
        },
        classes: ['btn', 'btn_white', 'login__btn'],
        attrs: {
            href: '/'
        },
    }, btnTmpl)

    render(chatLayout, sideBar);
    render(sideBar, roomList)
