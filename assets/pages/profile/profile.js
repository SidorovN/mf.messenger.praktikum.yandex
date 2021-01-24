import { Component } from '../../components/Component.js';
import { Button } from '../../components/Button.js';
import { Form } from '../../components/Form.js';
import { tmpl as profileFormTmpl } from '../../blocks/profile/profileForm.tmpl.js';
import { tmpl as profileAsideTmpl } from '../../blocks/profile/profileAside.tmpl.js';
import { tmpl as profilePopupTmpl } from '../../blocks/profile/profilePopup.tmpl.js';
import { render } from '../../common/render.js';
import { EventBus } from '../../components/EventBus.js';
const eventBus = new EventBus();
class ProfileButton extends Button {
  getContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('profile__change');
    wrapper.appendChild(this._element);
    return wrapper;
  }
}
const userData = {
  display_name: 'Иван',
  email: 'pochta@yandex.ru',
  first_name: 'Иван',
  phone: '+7 (909) 967 30 30',
  profile: 'ivanivanov',
  second_name: 'Иванов',
};
const userInputs = [
  {
    type: 'email',
    name: 'email',
    title: 'Почта',
    value: userData.email,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled="true"',
  },
  {
    type: 'text',
    name: 'profile',
    title: 'Логин',
    value: userData.profile,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled',
  },
  {
    type: 'text',
    name: 'first_name',
    title: 'Имя',
    value: userData.first_name,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled',
  },
  {
    type: 'text',
    name: 'second_name',
    title: 'Фамилия',
    value: userData.second_name,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled',
  },
  {
    type: 'text',
    name: 'display_name',
    title: 'Имя в чате',
    value: userData.display_name,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled',
  },
  {
    type: 'tel',
    name: 'phone',
    title: 'Телефон',
    value: userData.phone,
    errorMessage: '',
    errorClass: '',
    disabled: 'disabled',
  },
];
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
];
const aside = new Component(
  'aside',
  {
    props: {
      link: '/chat.html',
    },
    classes: ['profile__aside'],
  },
  profileAsideTmpl
);
const profile = new Component(
  'main',
  {
    props: userData,
    classes: ['profile__main'],
  },
  ''
);
const avatarBtn = new Component(
  'button',
  {
    props: {},
    emitter: [
      {
        event: 'click',
        callback: () => eventBus.emit('toggleAvatarPopup'),
      },
    ],
    classes: ['profile__avatar'],
  },
  ''
);
const userForm = new Form(
  {
    props: {
      username: userData.display_name,
      inputs: userInputs,
    },
    emitValidity: (state, inputName, message = '') =>
      eventBus.emit('emitValidity', userForm, state, inputName, message),
    classes: ['profile__form'],
  },
  profileFormTmpl
);
const userFormBtn = new Button('button', {
  props: {
    text: 'Сохранить',
  },
  classes: ['btn', 'btn_blue', 'profile__btn'],
});
const changesPanel = new Component(
  'div',
  {
    props: {},
    classes: ['profile__changes'],
  },
  ''
);
const avatarPopup = new Component(
  'div',
  {
    props: {},
    classes: ['popup', 'popup_with_overlay', 'profile__popup', 'popup_opened'],
  },
  profilePopupTmpl
);
const changeUserBtn = new ProfileButton('button', {
  props: {
    text: 'Изменить данные',
  },
  emitter: [
    {
      event: 'click',
      callback: () => eventBus.emit('toggleUserPopup', false),
    },
  ],
  classes: ['profile__link'],
  attrs: { type: 'button' },
});
const changePasswordBtn = new ProfileButton('button', {
  props: {
    text: 'Изменить пароль',
  },
  emitter: [
    {
      event: 'click',
      callback: () => eventBus.emit('openPasswordPopup', passwordInputs),
    },
  ],
  classes: ['profile__link'],
  attrs: { type: 'button' },
});
const logoutBtn = new ProfileButton('a', {
  props: {
    text: 'Выйти',
  },
  emitter: [
    {
      event: 'click',
      callback: () => eventBus.emit('logoutUser'),
    },
  ],
  classes: ['profile__link', 'profile__link_red'],
  attrs: { href: '/login.html' },
});
avatarPopup.hide();
eventBus.on('openPasswordPopup', props => {
  userForm.props.inputs = props;
  userFormBtn.show();
  userForm.enableInputs();
  changesPanel.toggle();
});
eventBus.on('toggleUserPopup', disabled => {
  const inputs = [...userForm.props.inputs];
  inputs.forEach(input => (input.disabled = disabled ? 'disabled' : ''));
  userForm.props.inputs = inputs;
  userFormBtn.toggle();
  changesPanel.toggle();
});
eventBus.on('toggleAvatarPopup', () => {
  avatarPopup.toggle();
});
eventBus.on('emitValidity', (form, state, inputName, message = '') => {
  const inputs = [...form.props.inputs];
  inputs.forEach(input => {
    if (input.name === inputName) {
      input.errorMessage = message;
      input.errorClass = !state ? '_error' : '';
      console.log(input, state);
    }
  });
  form.props.inputs = inputs;
});
userFormBtn.hide();
render(profile, avatarBtn);
render(profile, userForm);
render(profile, userFormBtn);
render(profile, changesPanel);
render(changesPanel, changeUserBtn);
render(changesPanel, changePasswordBtn);
render(changesPanel, logoutBtn);
render(document.querySelector('#page'), aside);
render(document.querySelector('#page'), profile);
render(document.querySelector('#page'), avatarPopup);
