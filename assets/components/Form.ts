import {Block} from "./Block.js";
import { compile } from "../common/templator.js";
import {Component} from "./Component.js";

const VALIDATE_CONFIG = {
    name: {
        regexp: /^[А-ЯЁ]([а-яё]{1,29})([-][А-ЯЁ]([а-яё]{1,29}))$/g,
        message: 'Проверьте правильность поля',
    },
    email: {
        regexp: /^[A-Za-z0-9,.,-]{1,}[@]([A-Za-z0-9,.,-]{1,}[.][A-Za-z]{1,}){1,2}$/g,
        message: 'Проверьте правильность номера',
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

export class Form extends Component {
    private inputs: any[];
    private errors: any[];
    private onSubmit: any;
    private emitValidity: any;

    constructor(config: any,tmpl) {
        super("form", config,tmpl);
        this.onSubmit = config.onSubmit
        this.emitValidity = config.emitValidity

        this._element.addEventListener('submit', e => {
            e.preventDefault();
            if (this.checkFormValidity()) {
                if(this.onSubmit){
                    this.onSubmit()
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
        this.inputs = [...this._element.querySelectorAll('input')];
        this.errors = [...this._element.querySelectorAll('.js-error')];
        this._element.setAttribute('novalidate', true);

        this.setListeners();
    };

    setListeners():void {
        this.inputs?.forEach((input) => {
            input.addEventListener('blur', () => {
                this.props.inputs.find(propInput=> propInput.name === input.name).value = input.value
                this.checkInputValidity(input);
            });
        });
    }

    checkFormValidity():boolean {
        return this.inputs.every(input => this.checkInputValidity(input))
    }

    checkInputValidity(input):boolean {

        const regExp = VALIDATE_CONFIG[input.type]?.regexp

        if(input.value.search(regExp) !== -1) {
            this.emitValidity(true,input.name,'')
            return true
        }
        else {
            const errorMessage = this.getErrorMessage(input.type)

            this.emitValidity(false,input.name,errorMessage)
            return false
        }

    }

    getValues() {
        const values = {};

        this.inputs.forEach(input => {
            values[input.name] = input.value;
        });
        return values;
    }

    getErrorMessage(type):void {
        return VALIDATE_CONFIG[type].message
    }

    disableInputs():void {
        this.inputs.forEach(el => {
            el.setAttribute('disabled', true);
        });
    }

    enableInputs():void {
        this.inputs?.forEach(el => {
            el.removeAttribute('disabled');
        });
    }
}

