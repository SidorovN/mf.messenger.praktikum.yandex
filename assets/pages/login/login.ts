import {Form} from "../../components/Form.js";
import {formDataParser, render} from "../../common/commonFunctions.js";
import {tmpl as formTmpl} from "../../blocks/login/login.tmpl.js"
import {Button} from "../../components/Button.js";
import {tmpl as btnTmpl} from "../../blocks/btn/btn.tmp.js"
import {EventBus} from "../../components/EventBus.js";
import {Component} from "../../components/Component.js";
import {HTTPTransport} from "../../components/HTTPTransport.js";
import {API_URL} from "../../common/CONSTS.js";
import {Router} from "../../components/Router.js";

const router = new Router('#page')

export const loginPage = new Component('div', {
    classes: ['root', 'login'],
    props: {},
})

const eventBus = new EventBus()

const formProps = {
    title: 'Войти',
    inputs: [{
        label: 'Логин',
        value: '',
        type: 'text',
        name: 'login',
        errorMessage: '',
        errorClass: ''
    }, {
        label: 'Пароль',
        value: '',
        type: 'password',
        name: 'password',
        errorMessage: '',
        errorClass: ''
    }]
}


const form = new Form({
    props: formProps,
    classes: ['login__form', 'js-form'],
    attrs: {},
    emitChange: (state: boolean, input: HTMLInputElement, message: string = "") => {
        eventBus.emit('emitChange', form, state, input, message)
    },
    onSubmit(e) {
        const xhr = new HTTPTransport()
        xhr.post(API_URL + 'auth/signin',
            {
                headers: {
                    'content-type': 'application/json', // Данные отправляем в формате JSON
                },
                data: JSON.stringify(formDataParser(this.getValues())),
            },
            )

            .then(data => {
                return data;
            })
            .then(data => {
                return xhr.get(`${API_URL}auth/user`, { // Получаем подробную информацию о пользователе и проверяем, что куки проставились

                    headers: {
                        'content-type': 'application/json', // Данные отправляем в формате JSON
                    },
                })

                    .then(data => {
                        localStorage.setItem('id', JSON.stringify(data.response))
                        router.go('/chat/')
                    });
            })}
    }, formTmpl);

const submitBtn = new Button('button', {
        props: {
            text: 'Авторизоваться'
        },
        classes: ['btn', 'btn_blue', 'login__btn'],
    }
    , btnTmpl)

const loginBtn = new Button('a', {
    props: {
        text: 'Нет аккаунта?'
    },
    classes: ['btn', 'btn_white', 'login__btn'],
    attrs: {
        href: '/signup'
    },
}, btnTmpl)


eventBus.on('emitChange', (form, state, input, message = '') => {
    const inputs = [...form.props.inputs]
    inputs.forEach(elem => {
        if (elem.name === input.name) {
            elem.errorMessage = message;
            elem.errorClass = !state ? '_error' : '';
            elem.value = input.value;
        }
    })

    form.props.inputs = inputs

})

render(form, submitBtn);
render(form, loginBtn);
render(loginPage, form);

