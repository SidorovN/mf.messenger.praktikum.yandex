export const tmpl = `
  <div class="profile__changes profile__changes_active js-user-changes">
    <div class="profile__change">
      <button type="button" class="profile__link js-edit-user">
        Изменить данные
      </button>
    </div>

    <div class="profile__change js-edit-password">
      <button type="button" class="profile__link">
        Изменить пароль
      </button>
    </div>

    <div class="profile__change">
      <a href="/login" class="profile__link profile__link_red">
        Выйти
      </a>
    </div>
  </div>
`;
