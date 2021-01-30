export const tmpl = `
<form class="popup__content js-add-form js-form" novalidate="true">
  <h3 class="title title_size_s popup__title">{{title}}</h3>
  <div class="input login__input popup__label">
    <label class="input__label">
      <input type="text" class="input__input js-input" name="login" placeholder="Логин">
      <span class="input__label-text">Логин</span>
    </label>
    <span class="input__error-message js-error">{{errorMessage}}</span>
  </div>
  <button class="btn btn_blue login__btn">{{btnText}}</button>
</form>
`;
