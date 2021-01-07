const loginForm = new FormValidator({
  form: document.querySelector('.js-form'),
  onSubmit: (e, values) => {
    console.dir(values);
  },
});

loginForm.init();
