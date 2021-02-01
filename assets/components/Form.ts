import {IMeta} from "./Block.js";
import {Component} from "./Component.js";


const VALIDATE_CONFIG = {
    name: {
        regexp: /^[А-ЯЁ]([а-яё]{1,29})([-][А-ЯЁ]([а-яё]{1,29}))$/g,
        message: 'Проверьте правильность поля',
    },
    email: {
        regexp: /^[A-Za-z0-9,.,-]{1,}[@]([A-Za-z0-9,.,-]{1,}[.][A-Za-z]{1,}){1,2}$/g,
        message: 'Проверьте правильность email',
    },
    tel: {
        regexp: /^(\+7|8)(([(]9\d{2}[)])|(\s?9\d{2}))(\s|[-])?(\d{3})[-]?(\d{2})[-]?(\d{2})$/g,
        message: 'Недопустимый формат номера'
    },
    password: {
        regexp: /^[\S]{8,30}$/g,
        message: 'Пароль должен быть от 8 до 30 символов'
    }
}
interface IFormConfig extends IMeta {
    onSubmit?: (event: Event) => void;
    emitChange?: (state:boolean,input:HTMLInputElement,message:string) => void;
}

export class Form extends Component {
    _element: HTMLFormElement;
    private inputs: HTMLInputElement[];
    private errors: HTMLElement[];
    private onSubmit: (event: Event) => void;
    private emitChange: (state:boolean,input:HTMLInputElement,message:string) => void;

    constructor(config: IFormConfig,tmpl:string) {
        super("form", config,tmpl);
        if(config.onSubmit) {
            this.onSubmit = config.onSubmit
        }
        this.emitChange = config.emitChange

        this._element.addEventListener('submit', e => {
            e.preventDefault();
            if (this.checkFormValidity()) {
                if(this.onSubmit){
                    this.onSubmit(e)
                } else {
                    console.log(this.getValues.call(this))
                }
            }
        });

        this.initForm()
    }


    componentDidUpdate = (oldProps, newProps) => {
        this.initForm()
    };

    initForm():void {
        this.inputs = Array.from(this._element.querySelectorAll('input'));
        this.errors = Array.from(this._element.querySelectorAll('.js-error'));
        this._element.setAttribute('novalidate', 'true');

        this.setListeners();
    };

    setListeners():void {
        this.inputs?.forEach((input) => {
            input.addEventListener('blur', () => {
                this.checkInputValidity(input);
            });
        });
    }

    checkFormValidity():boolean {
        return this.inputs.every(input => this.checkInputValidity(input))
    }

    checkInputValidity(input:HTMLInputElement):boolean {

        const regExp = VALIDATE_CONFIG[input.type]?.regexp

        if(input.value.search(regExp) !== -1) {
            this.emitChange(true,input,'')
            return true
        }

        const errorMessage = this.getErrorMessage(input.type)

        this.emitChange(false,input,errorMessage)
        return false

    }

    getValues() {
        return new FormData(this._element);
    }

    getErrorMessage(type:string):string {
        return VALIDATE_CONFIG[type]?.message ?? ''
    }

    disableInputs():void {
        this.inputs.forEach(el => {
            el.setAttribute('disabled', 'true');
        });
    }

    enableInputs():void {
        this.inputs?.forEach(el => {
            el.removeAttribute('disabled');
        });
    }
}

