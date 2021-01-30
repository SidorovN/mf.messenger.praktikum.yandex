import {Form} from "../../components/Form.js";
import {render} from "../../common/render.js";
import {tmpl as formTmpl} from "../../blocks/login/login.tmpl.js"
import {Button} from "../../components/Button.js";
import {tmpl as btnTmpl} from "../../blocks/btn/btn.tmp.js"
import {EventBus} from "../../components/EventBus.js";

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
    emitValidity: (state:boolean,inputName:string,message:string="")=>eventBus.emit('emitValidity',form,state,inputName,message),
}, formTmpl);

const submitBtn = new Button('button',{
    props: {
        text: 'Авторизоваться'
    },
    classes: ['btn','btn_blue','login__btn'],
    }
,btnTmpl)

const loginBtn = new Button('a',{
    props: {
        text: 'Нет аккаунта?'
    },
    classes: ['btn','btn_white','login__btn'],
    attrs: {
        href:'/'
    },
},btnTmpl)


eventBus.on('emitValidity',(form,state,inputName,message = '') => {
    const inputs = [...form.props.inputs]
    inputs.forEach(input=> {
        if(input.name === inputName) {
            input.errorMessage = message
            input.errorClass = !state ? '_error' : ''
            console.log(input,state)
        }
    })

    form.props.inputs = inputs

})

render(form, submitBtn);
render(form, loginBtn);
render(document.querySelector('#page'), form);

