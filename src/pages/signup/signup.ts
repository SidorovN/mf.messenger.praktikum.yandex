import {Form} from '../../components/Form';
import {formDataParser, render} from '../../common/commonFunctions';
import {tmpl as formTmpl} from '../../blocks/login/login.tmpl';
import {Button} from '../../components/Button';
import {tmpl as btnTmpl} from '../../blocks/btn/btn.tmp';
import {EventBus} from '../../components/EventBus';
import {Component} from '../../components/Component';
import {HTTPTransport} from '../../components/HTTPTransport';
import {API_URL} from '../../common/CONSTS';

export const signupPage = new Component('div', {
    classes: ['root', 'login'],
    props: {}
});

const eventBus = new EventBus();

const formProps = {
    title: 'Регистрация',
    inputs: [
        {
            label: 'Почта',
            value: '',
            type: 'email',
            name: 'email',
            errorMessage: '',
            errorClass: ''
        },
        {
            label: 'Логин',
            value: '',
            type: 'text',
            name: 'login',
            errorMessage: '',
            errorClass: ''
        },
        {
            label: 'Имя',
            value: '',
            type: 'text',
            name: 'first_name',
            errorMessage: '',
            errorClass: ''
        },
        {
            label: 'Фамилия',
            value: '',
            type: 'text',
            name: 'second_name',
            errorMessage: '',
            errorClass: ''
        },
        {
            label: 'Телефон',
            value: '',
            type: 'tel',
            name: 'phone',
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
        },
        {
            label: 'Пароль (ещё раз)',
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
            const xhr = new HTTPTransport();
            xhr.post(
                `${API_URL}auth/signup`,

                {
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify(formDataParser(this.getValues()))
                }
            ).then(res => console.log(res));
        }
    },
    formTmpl
);

const submitBtn = new Button(
    'button',
    {
        props: {
            text: 'Зарегистрироваться'
        },
        classes: ['btn', 'btn_blue', 'login__btn'],
        attrs: {}
    },
    btnTmpl
);

const loginBtn = new Button(
    'a',
    {
        props: {
            text: 'Войти'
        },
        classes: ['btn', 'btn_white', 'login__btn'],
        attrs: {
            href: '/login'
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

render(form, submitBtn);
render(form, loginBtn);
render(signupPage, form);
