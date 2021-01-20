import {Block} from "./Block.js";

class Button extends Block {
  constructor(props) {
    // Создаём враппер дом-элемент button
    super("button", props);
  }

  render() {
    // В проекте должен быть ваш собственный шаблонизатор
    //   const {text} = this.props;
    //   return `<div>${text}</div>`;
  }
}

function render(query, block) {
  const root = document.querySelector(query);
  root.appendChild(block.getContent());
  return root;
}

const button = new Button({
  text: 'Click me',
});
