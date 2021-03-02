import {BASE_URL} from "./CONSTS";

export function render(root, block) {
    root.appendChild(block);
    return root;
}

export function formDataParser(formData) {
    const data = {};
    for (const [name, value] of formData) {
        data[name] = value;
    }
    return data;
}
export function makeImageStyle(src:string):string {
   return `background-image: url(${src})`
}
