const openRoomPopupBtn = document.querySelector('.js-open-room-popup');
const openAttachPopupBtn = document.querySelector('.js-open-attach');
const openAddUserPopupBtn = document.querySelector('.js-open-add-user');
const openRemoveUserPopupBtn = document.querySelector('.js-open-remove-user');

const roomPopup = new Popup({
  element: document.querySelector('.js-room-popup'),
});

const attachPopup = new Popup({
  element: document.querySelector('.js-attach-popup'),
});

const AddUserPopup = new PopupWithOverlay({
  element: document.querySelector('.js-add-popup'),
});

const removeUserPopup = new PopupWithOverlay({
  element: document.querySelector('.js-remove-popup'),
});

const forms = [...document.querySelectorAll('.js-form')].map(form =>
  new Form({
    element: form,
    onSubmit() {
      console.dir(this.getValues());
    },
  }).init()
);

openRoomPopupBtn.addEventListener('click', () => {
  roomPopup.open();
});

openAttachPopupBtn.addEventListener('click', () => {
  attachPopup.open();
});

openAddUserPopupBtn.addEventListener('click', () => {
  AddUserPopup.open();
});

openRemoveUserPopupBtn.addEventListener('click', () => {
  removeUserPopup.open();
});
