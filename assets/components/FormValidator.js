class FormValidator {
  constructor(options) {
    this.form = options.form
    this.onSubmit = options.onSubmit
    this.errorMesages = options.errorMesages
  }

  init() {
    this.inputs = this.form.querySelectorAll('.js-input')
    this.errors = this.form.querySelectorAll('.js-errors')
    this.form.setAttribute('novalidate')
    this.setListeners()
  }

  setListeners() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.onSubmit(e)
    })

    this.inputs.forEach((input,index) => {

      input.addEventListener('blur', e => {
        const errorMessage = this.getErrorMessage(input)
        if (!errorMessage) {
          input.classList.remove('error')
          this.errors[index].textContent = ''
        } else {
          input.classList.add('error')
          this.errors[index].textContent = errorMessage
        }
      })

    })
  }

  getErrorMessage() {
    // if()
  }
}
