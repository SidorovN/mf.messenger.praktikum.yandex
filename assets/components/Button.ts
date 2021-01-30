import {compile} from "../common/templator.js";
import {Component} from "./Component.js";

export class Button extends Component {

    constructor(tagName = "div", config, tmpl:string='{{text}}') {

        super(tagName, config,tmpl);
    }

    render() {
        return `${compile(this.tmpl,this.props)}`
    }
}
