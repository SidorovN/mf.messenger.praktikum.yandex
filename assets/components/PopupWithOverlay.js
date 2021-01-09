class PopupWithOverlay extends Popup {
  constructor({ element, overlay }) {
    super({ element });
    this.overlay = overlay || element;
    this.setListeners();
  }
  setListeners() {
    this.overlay.addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        e.stopPropagation();
        e.preventDefault();
        this.close();
      }
    });
  }
  open(content) {
    super.open(content);
    document.body.style.position = 'fixed';
  }
  close(content) {
    super.close(content);
    document.body.style = '';
  }
}
