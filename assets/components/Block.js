import { EventBus } from './EventBus.js';
export class Block {
  constructor(tagName = 'div', props = {}) {
    this._element = null;
    this._meta = null;
    this.setProps = nextProps => {
      if (!nextProps) {
        return;
      }
      this.props = Object.assign(Object.assign({}, this.props), nextProps);
    };
    this._makePropsProxy = props => {
      // Можно и так передать this
      // Такой способ больше не применяется с приходом ES6+
      const self = this;
      return new Proxy(props, {
        set(target, prop, value) {
          target[prop] = value;
          self._eventBus().emit(Block.EVENTS.FLOW_CDU);
          console.log(target, prop, value);
          return value;
        },
        deleteProperty(target, prop) {
          throw new Error('нет доступа');
        },
      });
    };
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props,
    };
    this.props = this._makePropsProxy(props);
    this._eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }
  _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }
  _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }
  init() {
    this._createResources();
    this._eventBus().emit(Block.EVENTS.FLOW_CDM);
  }
  _componentDidMount() {
    // this.componentDidMount();
    this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
  // Может переопределять пользователь, необязательно трогать
  componentDidMount(oldProps) {}
  _componentDidUpdate(oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (response) this._render();
  }
  // Может переопределять пользователь, необязательно трогать
  componentDidUpdate(oldProps, newProps) {
    return true;
  }
  get element() {
    return this._element;
  }
  _render() {
    const block = this.render();
    console.log(block);
    // Этот небезопасный метод для упрощения логики
    // Используйте шаблонизатор из npm или напишите свой безопасный
    // Нужно не в строку компилировать (или делать это правильно),
    // либо сразу в DOM-элементы возвращать из compile DOM-ноду
    this._element.innerHTML = block;
  }
  // Может переопределять пользователь, необязательно трогать
  render() {}
  getContent() {
    return this._element;
  }
  _createDocumentElement(tagName) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }
  show() {
    this._element.style.display = 'block';
  }
  hide() {
    this._element.style.display = 'none';
  }
}
Block.EVENTS = {
  INIT: 'init',
  FLOW_CDM: 'flow:component-did-mount',
  FLOW_CDU: 'flow:component-did-update',
  FLOW_RENDER: 'flow:render',
};
