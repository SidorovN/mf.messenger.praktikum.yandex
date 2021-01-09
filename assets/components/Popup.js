class Popup extends BaseComponent {
  constructor({ close, element, open }) {
    super({ element });
    this.element = element;
  }

  open(content) {
    this.element.classList.add('popup_opened');
  }

  close(content) {
    this.element.classList.remove('popup_opened');
  }
}
