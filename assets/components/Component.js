import { Block } from './Block.js';
import { compile } from '../common/templator.js';
export class Component extends Block {
  constructor(tagName, config, tmpl) {
    super(tagName, config, tmpl);
    if (config.on) {
      this.setOn(config.on);
    }
    if (config.emitter) {
      this.setListeners(config.emitter);
    }
  }
  setListeners(listeners) {
    listeners.forEach(listener =>
      this._element.addEventListener(listener.event, listener.callback)
    );
  }
  setOn(on) {
    this._eventBus().on(on[0], on[1].bind(this));
  }
  getContent() {
    return this._element;
  }
  render() {
    return `${compile(this.tmpl, this.props)}`;
  }
}
