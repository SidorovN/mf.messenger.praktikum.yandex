export const tmpl = `
  <form class="popup__content js-avatar-form" novalidate="true">
    <h3 class="title title_size_s popup__title">Загрузите файл</h3>
    <label class="popup__label popup__label_file">
      <input type="file" class="popup__file-input js-input" required="" name="avatar">
      <span class="popup__file-label-text">Выбрать файл на компьютере</span>
    </label>
    <button class="btn btn_blue">Поменять</button>
    <span class="js-error-message"></span>
  </form>
`;
