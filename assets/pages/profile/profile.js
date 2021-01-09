const userData = {
  display_name: 'Иван',
  email: 'pochta@yandex.ru',
  first_name: 'Иван',
  phone: '+7 (909) 967 30 30',
  profile: 'ivanivanov',
  second_name: 'Иванов',
};

const avatarPopupOpen = document.querySelector('.js-open-avatar-popup');
const editUserBtn = document.querySelector('.js-edit-user');
const editPasswordBtn = document.querySelector('.js-edit-password');
const userFormButton = document.querySelector('.js-user-form-btn');
const userChanges = document.querySelector('.js-user-changes');

const avatarPopup = new PopupWithOverlay({
  element: document.querySelector('.js-avatar-popup'),
});

const avatarForm = new Form({
  element: document.querySelector('.js-avatar-form'),
  onSubmit() {
    console.dir(this.getValues());
  },
});

const userForm = new Form({
  element: document.querySelector('.js-user-form'),
  onSubmit() {
    console.dir(this.getValues());
    avatarPopup.close();
    this.disableInputs();
    userFormButton?.classList.add('profile__btn_hidden');
    userChanges?.classList.add('profile__changes_active');
  },
});

const passwordForm = new Form({
  element: document.querySelector('.js-password-form'),
  onSubmit() {
    console.dir(this.getValues());
    passwordForm.element?.classList.add('profile__form_hidden');
    userForm.element?.classList.remove('profile__form_hidden');
  },
});

avatarPopupOpen?.addEventListener('click', () => {
  avatarPopup.open();
});

editUserBtn?.addEventListener('click', () => {
  userForm?.enableInputs();
  userFormButton?.classList.remove('profile__btn_hidden');
  userChanges?.classList.remove('profile__changes_active');
});

editPasswordBtn?.addEventListener('click', () => {
  passwordForm.element?.classList.remove('profile__form_hidden');
  userForm.element?.classList.add('profile__form_hidden');
});

userForm?.init();
userForm?.setValues(userData);
userForm?.disableInputs();

avatarForm?.init();
passwordForm?.init();
