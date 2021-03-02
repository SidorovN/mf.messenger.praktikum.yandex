import {expect} from 'chai';

import {compile} from '../assets/common/templator';

describe("Шаблонизатор", () => {
  it("Шаблонизатор возвращает строку с пропсом", () => {
    expect(
        compile(`
<form class="popup__content" novalidate="true">
<h3 class="title title_size_s popup__title">{{title}}</h3>
{{ #FOR input in inputs }}
<div class="input login__input popup__label">
<label class="input__label {{input.labelClass}}">
<input type="{{ input.type }}" class="{{input.inputClass}}" name="{{input.name}}" value="{{input.value}}" placeholder="{{input.label}}">
<span class="input__label-text {{input.spanClass}}">{{input.label}}</span>
</label>
<span class="input__error-message js-error">{{errorMessage}}</span>
</div>
{{ #ENDFOR }}
<button class="btn btn_blue login__btn">{{btnText}}</button>
</form>
`, {
        title: 'Создать новый чат',
        btnText: 'Создать',
        inputs: [{
            label: 'Название чата',
            value: '',
            type: 'text',
            name: 'title',
            errorMessage: '',
            errorClass: '',
            labelClass: '',
            spanClass: '',
            inputClass: 'input__input'
        },]
    })).to.be.equal(
        `
<form class="popup__content" novalidate="true">
<h3 class="title title_size_s popup__title">Создать новый чат</h3>
<div class="input login__input popup__label">
<label class="input__label ">
<input type="text" class="input__input" name="title" value="" placeholder="Название чата">
<span class="input__label-text ">Название чата</span>
</label>
<span class="input__error-message js-error"></span>
</div>
<button class="btn btn_blue login__btn">Создать</button>
</form>
`);
  });
});
