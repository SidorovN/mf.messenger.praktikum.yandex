export const tmpl = `
<form class="popup__content js-add-form js-form" novalidate="true">
  <h3 class="title title_size_s popup__title">{{title}}</h3>
  {{ #FOR input in inputs }}
  <div class="input login__input popup__label">
    <label class="input__label {{input.labelClass}}">
      <input type="{{ input.type }}" 
      class="{{input.inputClass}}" 
      name="{{input.name}}" 
      value="{{input.value}}" 
      placeholder="{{input.label}}"
      >
      <span class="input__label-text {{input.spanClass}}">{{input.label}}</span>
    </label>
    <span class="input__error-message js-error">{{errorMessage}}</span>
  </div>
  
{{ #ENDFOR }}
  <button class="btn btn_blue login__btn">{{btnText}}</button>
</form>
`;
