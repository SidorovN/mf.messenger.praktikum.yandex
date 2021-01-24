import { EventBus } from './EventBus.js';
export class Block {
  constructor(tagName = 'div', config, tmpl) {
    this._element = null;
    this._meta = null;
    this.children = [];
    this.setProps = nextProps => {
      if (!nextProps) {
        return;
      }
      this.props = Object.assign(Object.assign({}, this.props), nextProps);
    };
    this._makePropsProxy = props => {
      const self = this;
      return new Proxy(props, {
        set(target, prop, value) {
          target[prop] = value;
          self._eventBus().emit(Block.EVENTS.FLOW_CDU);
          return value;
        },
        deleteProperty(target, prop) {
          throw new Error('нет доступа');
        },
      });
    };
    this.show = () => {
      this._element.classList.remove('visually-hidden');
    };
    this.hide = () => {
      this._element.classList.add('visually-hidden');
    };
    this.toggle = () => {
      this._element.classList.toggle('visually-hidden');
    };
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props: config.props,
      classes: config.classes,
      attrs: config.attrs,
    };
    this.tmpl = tmpl;
    this.props = this._makePropsProxy(config.props);
    this.fragment = document.createDocumentFragment();
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
    var _a;
    const { tagName, classes, attrs } = this._meta;
    this._element = this._createDocumentElement(tagName);
    if (classes) {
      this._element.classList.add(...classes);
    }
    if (attrs) {
      (_a = Object.keys(attrs)) === null || _a === void 0
        ? void 0
        : _a.forEach(attr => this._element.setAttribute(attr, attrs[attr]));
    }
  }
  init() {
    this._createResources();
    this._eventBus().emit(Block.EVENTS.FLOW_CDM);
  }
  _componentDidMount() {
    this.componentDidMount();
    this._eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
  // Может переопределять пользователь, необязательно трогать
  componentDidMount() {}
  _componentDidUpdate(oldProps, newProps) {
    this._render();
    this.componentDidUpdate(oldProps, newProps);
  }
  componentDidUpdate(oldProps, newProps) {}
  get element() {
    return this._element;
  }
  _render() {
    const block = this.render();
    this._element.innerHTML = block;
    this.children.forEach(child => this.fragment.append(child));
    this._element.appendChild(this.fragment);
  }
  render() {
    return '';
  }
  getContent() {
    return this._element;
  }
  _createDocumentElement(tagName) {
    return document.createElement(tagName);
  }
  appendChild(node) {
    this.children.push(node);
    this._element.appendChild(node);
  }
}
Block.EVENTS = {
  INIT: 'init',
  FLOW_CDM: 'flow:component-did-mount',
  FLOW_CDU: 'flow:component-did-update',
  FLOW_RENDER: 'flow:render',
};
