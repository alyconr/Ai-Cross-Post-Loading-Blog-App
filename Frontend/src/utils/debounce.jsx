// debounce.js or debounce.jsx

class Debounce {
  constructor() {
    this.timeout = null;
  }

  debounced(func, wait) {
    return (...args) => {
      const later = () => {
        this.timeout = null;
        func(...args);
      };
      clearTimeout(this.timeout);
      this.timeout = setTimeout(later, wait);
    };
  }

  cancel() {
    clearTimeout(this.timeout);
  }
}

export const debounced = new Debounce();
