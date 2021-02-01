import {EventBus} from "./EventBus.js";

interface IBlockProps {
    [key: string]: any;
}

interface IBlockAttrs {
    [key: string]: string;
}


export interface IMeta {
    tagName?:string;
    props?: IBlockProps;
    classes?: string[];
    attrs?: IBlockAttrs;
}

export abstract class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    };

    _element:HTMLElement|null = null;
    _meta:IMeta|null = null;
    _eventBus: () => EventBus;
    props: IBlockProps;
    tmpl: string;
    children:HTMLElement[] = [];
    private fragment: DocumentFragment;

    constructor(tagName:string = "div", config:IBlockProps, tmpl: string, children:HTMLElement[]=[]) {
        const eventBus = new EventBus();
        this._meta = {
            tagName,
            props: config.props,
            classes: config.classes,
            attrs: config.attrs
        };
        this.children = children
        this.tmpl = tmpl
        this.props = this._makePropsProxy(config.props);
        this.fragment = document.createDocumentFragment()
        this._eventBus = () => eventBus;
        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    _registerEvents(eventBus):void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    _createResources():void {
        const {tagName,classes,attrs} = this._meta;
        this._element = this._createDocumentElement(tagName);

        if (classes) {
            this._element.classList.add(...classes)
        }
        if(attrs) {
            Object.keys(attrs)?.forEach(attr => this._element.setAttribute(attr, attrs[attr]))
        }
    }

    init():void {
        this._createResources();
        this._eventBus().emit(Block.EVENTS.FLOW_CDM)
    }

    private _componentDidMount():void {
        this.componentDidMount();
        this._eventBus().emit(Block.EVENTS.FLOW_RENDER)
    }

    // Может переопределять пользователь, необязательно трогать
    componentDidMount() {
    }

    private _componentDidUpdate(oldProps, newProps) {
       this._render()
       this.componentDidUpdate(oldProps, newProps);
    }

    componentDidUpdate(oldProps, newProps) {

    }

    setProps = nextProps => {
        if (!nextProps) {
            return;
        }

        this.props = {...this.props,...nextProps};
    };

    get element():HTMLElement {
        return this._element;
    }

    private _render():void {
        const block = this.render()


        this._element.innerHTML = block;

        this.children.forEach(child=>this.fragment.append(child))
        this._element.appendChild(this.fragment)
    }

    render():string {
        return ''
    }

    getContent():HTMLElement {
        return this._element;
    }

    private _makePropsProxy = (props):object => {
        const self = this;
        return new Proxy(props, {
            set(target, prop, value) {
                target[prop] = value
                self._eventBus().emit(Block.EVENTS.FLOW_CDU);

                return value
            },

            deleteProperty(target, prop) {
                throw new Error('нет доступа');
            }
        });
    }

    private _createDocumentElement(tagName):HTMLElement {
        return document.createElement(tagName);
    }

    appendChild(node:HTMLElement):void {
        this.children.push(node)
        this._element.appendChild(node)
    }

    show=():void=> {
        this._element.classList.remove('visually-hidden')
    }

    hide=():void=> {
        this._element.classList.add('visually-hidden')
    }

    toggle=()=> {
        this._element.classList.toggle('visually-hidden')
    }
}
