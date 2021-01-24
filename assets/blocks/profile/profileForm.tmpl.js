export const tmpl = `
  <h1 class="title title_size_m profile__title">{{username}}</h1>
  
{{ #FOR input in inputs }}
  <div class="profile-input profile__input">
    <label class="profile-input__label">
      <input type="{{input.type}}" class="profile-input__input {{input.errorClass}}"
      name="{{input.name}}"
      placeholder="{{input.title}}"
      value="{{input.value}}"
      {{input.disabled}}>
      <span class="profile-input__label-text">{{input.title}}</span>
    </label>
    <span class="profile-input__error-message js-error">{{input.errorMessage}}</span>
  </div>
{{ #ENDFOR }}
`;
