import {Block} from "./Block.js";
import {compile} from "../common/templator.js";

export class Button extends Block {

    constructor(tagName = "div", config, tmpl:string='{{text}}') {

        super(tagName, config,tmpl);

        if(config.emitter) {
            this.setListeners(config.emitter)
        }
    }

    setListeners(listeners: []) {
        listeners.forEach((listener: { event: string,callback:void })=>this._element.addEventListener(listener.event,listener.callback))
    }

    render() {
        return `${compile(this.tmpl,this.props)}`
    }
}
