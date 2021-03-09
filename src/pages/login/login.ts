import './login.scss';
import {Form} from '../../components/Form';
import {formDataParser, render, translateError} from '../../common/commonFunctions';
import {tmpl as formTmpl} from '../../blocks/login/login.tmpl';
import {Button} from '../../components/Button';
import {tmpl as btnTmpl} from '../../blocks/btn/btn.tmp';
import {EventBus} from '../../components/EventBus';
import {Component} from '../../components/Component';
import {HTTPTransport} from '../../components/HTTPTransport';
import {API_URL} from '../../common/CONSTS';
import {Router} from '../../components/Router';

const router = new Router('#page');
const xhr = new HTTPTransport();

export const loginPage = new Component('div', {
    classes: ['root', 'login'],
    props: {},
    componentDidMount() {
        authUser();
    }
});

const eventBus = new EventBus();

const formProps = {
    title: 'Войти',
    inputs: [
        {
            label: 'Логин',
            value: '',
            type: 'text',
            name: 'login',
            errorMessage: '',
            errorClass: ''
        },
        {
            label: 'Пароль',
            value: '',
            type: 'password',
            name: 'password',
            errorMessage: '',
            errorClass: ''
        }
    ]
};

const form = new Form(
    {
        props: formProps,
        classes: ['login__form', 'js-form'],
        attrs: {},
        emitChange: (state: boolean, input: HTMLInputElement, message: string = '') => {
            eventBus.emit('emitChange', form, state, input, message);
        },
        onSubmit() {
            xhr.post(`${API_URL}auth/signin`, {
                headers: {
                    'content-type': 'application/json' // Данные отправляем в формате JSON
                },
                data: JSON.stringify(formDataParser(this.getValues()))
            })

                .then(res => {
                    if (res.status >= 400) {
                        return Promise.reject(res);
                    }

                    return res.response;
                })
                .then(authUser)
                .catch(err => {
                    if (err.response.reason === 'user already in system') {
                        router.go('/chat/');
                    } else {
                        this.props.inputs[0].errorMessage = translateError(err.response.reason);
                        this.props.inputs[1].value = '';
                        this._eventBus().emit(Form.EVENTS.FLOW_CDU);
                    }
                });
        }
    },
    formTmpl
);

const submitBtn = new Button(
    'button',
    {
        props: {
            text: 'Авторизоваться'
        },
        classes: ['btn', 'btn_blue', 'login__btn']
    },
    btnTmpl
);

const loginBtn = new Button(
    'a',
    {
        props: {
            text: 'Нет аккаунта?'
        },
        classes: ['btn', 'btn_white', 'login__btn'],
        attrs: {
            href: '/signup'
        }
    },
    btnTmpl
);

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

function authUser() {
    xhr
        .get(`${API_URL}auth/user`, {
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            if (res.status >= 400) {
                return Promise.reject(res);
            }

            return res.response;
        })
        .then(data => {
            console.log(data);
            if (data && window.location.pathname === '/') {
                localStorage.setItem('user', JSON.stringify(data));
                router.go('/chat');
            }
        });
}

render(form, submitBtn);
render(form, loginBtn);
render(loginPage, form);
