class BaseComponent {
  constructor({ element }) {
    this.element = element;
  }

  setContent(content) {
    this.element.innerHTML = '';
    this.element.insertAdjacentElement(content);
  }

  mountElement(parent) {
    parent?.appendChild(this.element);
  }
}
