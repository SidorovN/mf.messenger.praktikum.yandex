export const tmpl = `
<form class="login__form js-form">
    <h1 class="title login__title">{{title}}</h1>
    
    {{ #FOR input in inputs }}
    <div class="input login__input">
    <label class="input__label">
        <input type="{{ input.type }}" class="input__input js-input" name="{{ input.name }}" placeholder="{{ input.label }}">
        <span class="input__label-text">{{ input.label }}</span>
    </label>
    <span class="input__error-message js-error"></span>
    </div>
    {{ #ENDFOR }}

    <button class="btn btn_blue login__btn">Авторизоваться</button>
    <a href="/signup" class="btn btn_white login__btn">Нет аккаунта?</a>
</form>`;
