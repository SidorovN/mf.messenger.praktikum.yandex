class FormValidator {
  constructor({ errorMessages, form, onSubmit }) {
    this.form = form;
    this.onSubmit = onSubmit;
    this.errorMesages = errorMessages;
  }

  init() {
    this.inputs = this.form.querySelectorAll('.js-input');
    this.errors = this.form.querySelectorAll('.js-error');
    this.form.setAttribute('novalidate', true);
    this.setListeners();
  }

  setListeners() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();

      this.values = {};

      [...this.inputs].forEach(input => {
        this.values[input.name] = input.value;
      });

      this.onSubmit(e, this.values);
    });

    this.inputs.forEach((input, index) => {
      input.addEventListener('blur', e => {
        const errorMessage = this.getErrorMessage(input);
        if (!errorMessage) {
          input.classList.remove('error');
          this.errors[index].textContent = '';
        } else {
          input.classList.add('error');
          this.errors[index].textContent = errorMessage;
        }
      });
    });
  }

  getErrorMessage(input) {
    if (!input.checkValidity()) {
      return false;
    }
  }
}
