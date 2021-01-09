const loginForm = new Form({
  element: document.querySelector('.js-form'),
  onSubmit(e) {
    console.dir(this.getValues());
  },
});

loginForm.init();
