class Form extends BaseComponent {
  constructor({ errorMessages, element, onSubmit }) {
    super({ element });
    this.form = element;
    this.onSubmit = onSubmit.bind(this);
    this.errorMesages = errorMessages;
  }

  init = () => {
    this.inputs = [...this.form.querySelectorAll('.js-input')];
    this.errors = [...this.form.querySelectorAll('.js-error')];
    this.form.setAttribute('novalidate', true);
    this.setListeners();

    return this;
  };

  setListeners() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this.checkFormValidity()) {
        this.onSubmit();
      }
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

  checkFormValidity() {
    return this.inputs.every(input => input.checkValidity());
  }

  getValues() {
    const values = {};

    [...this.inputs].forEach(input => {
      values[input.name] = input.value;
    });
    return values;
  }

  setValues(values) {
    this.inputs.forEach(input => {
      input.value = values[input.name] || '';
    });
  }

  getErrorMessage(input) {
    return false;
  }

  disableInputs() {
    this.inputs.forEach(el => {
      el.setAttribute('disabled', true);
    });
  }

  enableInputs() {
    this.inputs.forEach(el => {
      el.removeAttribute('disabled', true);
    });
  }
}
