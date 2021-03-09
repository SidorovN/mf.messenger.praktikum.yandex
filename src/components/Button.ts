import {compile} from '../common/templator';
import {Component} from './Component';

export class Button extends Component {
    constructor(tagName, config, tmpl: string = '{{text}}') {
        super(tagName, config, tmpl);
    }

    render() {
        return `${compile(this.tmpl, this.props)}`;
    }
}
