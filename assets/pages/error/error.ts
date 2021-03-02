import {tmpl} from "../../blocks/error/404.tmpl.js"
import {Component} from "../../components/Component.js";

export const errorPage = new Component('div',{
    classes: ['root', 'error'],
    props: {
        title: 'Не туда попали',
        errorStatus: 404,
    },
},tmpl)

