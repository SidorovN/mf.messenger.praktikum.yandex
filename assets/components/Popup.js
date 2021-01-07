class Popup {
  constructor({ close, element, open }) {
    this.element = element;
  }

  open(content) {
    this.element.classList.add('popup_opened');
  }

  close(content) {
    this.element.classList.remove('popup_opened');
  }
}
