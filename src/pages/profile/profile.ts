import {Component} from "../../components/Component.js";
import {Button} from "../../components/Button.js";
import {Form} from "../../components/Form.js";
import {tmpl as profileFormTmpl} from "../../blocks/profile/profileForm.tmpl.js"
import {tmpl as profileAsideTmpl} from "../../blocks/profile/profileAside.tmpl.js"
import {tmpl as profilePopupTmpl} from "../../blocks/profile/profilePopup.tmpl.js"
import {formDataParser, makeImageStyle, render} from "../../common/commonFunctions.js";
import {EventBus} from "../../components/EventBus.js";
import {HTTPTransport} from "../../components/HTTPTransport.js";
import {API_URL, BASE_URL} from "../../common/CONSTS.js";
import {Router} from "../../components/Router.js";

const eventBus = new EventBus()
const router = new Router('#page');

let userInputs = []

const xhr = new HTTPTransport()
const passwordInputs = [
    {
        type: 'password',
        name: 'oldPassword',
        title: 'Старый пароль',
        value: '',
        errorMessage: '',
        disabled: '',
        errorClass: '',
    },
    {
        type: 'password',
        name: 'newPassword',
        title: 'Новый пароль',
        value: '',
        errorMessage: '',
        disabled: '',
        errorClass: '',
    },
    {
        type: 'password',
        name: 'newPassword',
        title: 'Повторите новый пароль',
        value: '',
        errorMessage: '',
        disabled: '',
        errorClass: '',
    },
]

export const profilePage = new Component('div', {
    props: {},
    classes: ['profile','root'],
    on: ['init',updateUser],
    componentDidMount() {
        updateUser()
    },
})

profilePage.needInit = true

class ProfileButton extends Button {
    getContent(): any {
        const wrapper = document.createElement('div')
        wrapper.classList.add('profile__change')
        wrapper.appendChild(this._element)
        return wrapper;
    }
}

let userData = {
    display_name: 'Иван',
    email: 'pochta@yandex.ru',
    first_name: 'Иван',
    phone: '+7 (909) 967 30 30',
    login: 'ivanivanov',
    second_name: 'Иванов',
};


function updateUserInputs() {
    userInputs = [
        {
            type: 'email',
            name: 'email',
            title: 'Почта',
            value: userData.email,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled="true"'
        },
        {
            type: 'text',
            name: 'login',
            title: 'Логин',
            value: userData.login,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled'
        },
        {
            type: 'text',
            name: 'first_name',
            title: 'Имя',
            value: userData.first_name,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled'
        },
        {
            type: 'text',
            name: 'second_name',
            title: 'Фамилия',
            value: userData.second_name,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled'
        },
        {
            type: 'text',
            name: 'display_name',
            title: 'Имя в чате',
            value: userData.display_name || userData.first_name,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled'
        },
        {
            type: 'tel',
            name: 'phone',
            title: 'Телефон',
            value: userData.phone,
            errorMessage: '',
            errorClass: '',
            disabled: 'disabled'
        },]
}

const aside = new Component('aside', {
    props: {
        link: '/chat'
    },
    classes: ['profile__aside']
}, profileAsideTmpl)

const profile = new Component('main', {
    props: userData,
    classes: ['profile__main'],
}, '')

const avatarBtn = new Component('div', {
    props: {
        style: '',
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleAvatarPopup')
    }],
}, '<button style="{{style}}" class="profile__avatar"></button>')


const userForm = new Form({
    props: {
        username: userData.display_name,
        inputs: userInputs
    },
    emitChange: (state: boolean, input: HTMLInputElement, message: string = "") => {
        eventBus.emit('emitChange', userForm, state, input, message)
    },
    onSubmit: updatePassword,
    classes: ['profile__form']
}, profileFormTmpl)

const userFormBtn = new Button('button', {
    props: {
        text: 'Сохранить'
    },
    classes: ['btn', 'btn_blue', 'profile__btn']
})

const changesPanel = new Component('div', {
    props: {},
    classes: ['profile__changes']
}, '')

const avatarPopup = new Form( {
    props: {},
    classes: ['popup', 'popup_with_overlay', 'profile__popup', 'popup_opened'],
    onSubmit(e) {
        xhr.put(API_URL + 'user/profile/avatar',
            {
            data: this.getValues()
        })
    },
    emitChange(){}
}, profilePopupTmpl)

const changeUserBtn = new ProfileButton('button', {
    props: {
        text: 'Изменить данные'
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('toggleUserPopup', false)
    }],

    classes: ['profile__link'],
    attrs: {type: 'button'}
})
const changePasswordBtn = new ProfileButton('button', {
    props: {
        text: 'Изменить пароль'
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('openPasswordPopup', passwordInputs)
    }],

    classes: ['profile__link'],
    attrs: {type: 'button'}
})

const logoutBtn = new ProfileButton('button', {
    props: {
        text: 'Выйти'
    },
    emitter: [{
        event: 'click',
        callback: (e) => eventBus.emit('logoutUser')
    }],

    classes: ['profile__link', 'profile__link_red'],
})
function updateUserInfo() {
    xhr.put(API_URL + 'user/profile',{
        headers: {
                    'content-type': 'application/json',
                },
        data:JSON.stringify(formDataParser(this.getValues()))
    }).then(res=> {
        eventBus.emit('toggleUserPopup',true)
    })
}
function updatePassword() {

    xhr.put(API_URL + 'user/password',{
        headers: {
            'content-type': 'application/json',
        },
        data:JSON.stringify(formDataParser(this.getValues()))
    }).then(res=> {
        eventBus.emit('toggleUserPopup',true)
    })
}


function updateUser() {
    if (localStorage.getItem('user')) {
        xhr.get(API_URL + 'user/' + JSON.parse(localStorage.getItem('user')).id, {
            headers: {

                'content-type': 'application/json',
            },
        })
            .then(res => {
                if (res.status >= 400) {
                    Promise.reject(res)
                } else return res.response
            }).then(res => {
            userData = res
            updateUserInputs()
            userForm.props.inputs = userInputs
            if(avatarBtn && res.avatar) {
                avatarBtn.props.style = makeImageStyle(BASE_URL + res.avatar)
            }
        })
    }
}
avatarPopup.hide()


eventBus.on('openPasswordPopup', (props) => {
    userForm.props.inputs = props
    userForm.onSubmit = updatePassword.bind(userForm)
    userFormBtn.show()
    userForm.enableInputs()
    changesPanel.toggle()

})

eventBus.on('toggleUserPopup', (disabled: boolean) => {
    const inputs = [...userForm.props.inputs]
    inputs.forEach(input => input.disabled = disabled ? 'disabled' : '')
    userForm.props.inputs = inputs
    userForm.onSubmit = updateUserInfo.bind(userForm)
    userFormBtn.toggle()
    changesPanel.toggle()
})

eventBus.on('toggleAvatarPopup', () => {
    avatarPopup.toggle()
})

eventBus.on('logoutUser', () => {
    const xhr = new HTTPTransport()
    xhr.post(API_URL + 'auth/logout').then(res=> {
        localStorage.removeItem('user')
        router.go('/')
    })
})

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

userFormBtn.hide()

updateUserInputs()

render(profile, avatarBtn)
render(profile, userForm)
render(userForm, userFormBtn)
render(profile, changesPanel)
render(changesPanel, changeUserBtn)
render(changesPanel, changePasswordBtn)
render(changesPanel, logoutBtn)
render(profilePage, aside)
render(profilePage, profile)
render(profilePage, avatarPopup)

