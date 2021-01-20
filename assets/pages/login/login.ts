import {Block} from "../../components/Block.js";
import {compile} from "../../common/templator.js"
import {tmpl} from "./login.tmpl.js"

const props = {
    title: 'Войти',
    inputs: [{
        label: 'Логин',
        value: '',
        type: 'text',
        name:'login'
    },{
        label: 'Пароль',
        value: '',
        type: 'password',
        name: 'password',
    }
    ]
}

class Form extends Block {
    constructor(props) {
        // Создаём враппер дом-элемент button
        super("div", props);
    }

    render() {
        // В проекте должен быть ваш собственный шаблонизатор
        //   const {text} = this.props;
        return `${compile(tmpl, this.props)}`;
    }
}

function render(query, block) {
    const root = document.querySelector(query);
    root.appendChild(block.getContent());
    return root;
}

const form = new Form(props);

render('body', form);

