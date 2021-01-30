import {Block, IMeta} from "./Block.js";
import {compile} from "../common/templator.js";

interface IListener {
    event: string;
    callback: any;
}

interface IBlockConfig extends IMeta {
    emitter?: IListener[];
    on?: [string,Function]
}


export class Component extends Block {
    constructor(tagName,config:IBlockConfig,tmpl) {
        super(tagName, config,tmpl);
        if(config.on) {
            this.setOn(config.on)
        }
        if(config.emitter) {
            this.setListeners(config.emitter)
        }
    }

    setListeners(listeners: IListener[]) {
        listeners.forEach(({ event,callback})=>this._element.addEventListener(event,callback)
        )
        console.dir(this._element)
    }

    setOn(on) {
        this._eventBus().on(on[0],on[1].bind(this))
    }


    getContent() {
        return this._element;
    }

    render() {
        return `${compile(this.tmpl, this.props)}`;
    }
}
