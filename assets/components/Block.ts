import {EventBus} from "./EventBus.js";

interface IBlockProps {
    [key: string]: any;
}

export abstract class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    };

    _element = null;
    _meta = null;
    _eventBus: () => EventBus;
    props: IBlockProps;
    tmpl: string;
    children = [];
    private fragment: DocumentFragment;

    constructor(tagName:string = "div", config:IBlockProps, tmpl: string) {
        const eventBus = new EventBus();
        this._meta = {
            tagName,
            props: config.props,
            classes: config.classes,
            attrs: config.attrs
        };

        this.tmpl = tmpl
        this.props = this._makePropsProxy(config.props);
        this.fragment = document.createDocumentFragment()
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
        const {tagName,classes,attrs} = this._meta;
        this._element = this._createDocumentElement(tagName);

        if (classes) {
            this._element.classList.add(...classes)
        }
        if(attrs) {
            Object.keys(attrs)?.forEach(attr => this._element.setAttribute(attr, attrs[attr]))
        }
    }

    init() {
        this._createResources();
        this._eventBus().emit(Block.EVENTS.FLOW_CDM)
    }

    private _componentDidMount() {
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

    get element() {
        return this._element;
    }

    private _render() {
        const block = this.render()


        this._element.innerHTML = block;

        this.children.forEach(child=>this.fragment.append(child))
        this._element.appendChild(this.fragment)
    }

    render():string {
        return ''
    }

    getContent() {
        return this._element;
    }

    private _makePropsProxy = (props) => {
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

    private _createDocumentElement(tagName) {
        return document.createElement(tagName);
    }

    appendChild(node) {
        this.children.push(node)
        this._element.appendChild(node)
    }

    show=()=> {
        this._element.classList.remove('visually-hidden')
    }

    hide=()=> {
        this._element.classList.add('visually-hidden')
    }

    toggle=()=> {
        this._element.classList.toggle('visually-hidden')
    }
}
