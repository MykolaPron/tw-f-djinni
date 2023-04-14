export default class Gallery {
  #templateElementClassName = 'gallery-template';
  #galleryElementId;
  #templateKeys;
  #templateKeyPattern;
  #insertAdjacentElement; // [className, position]

  constructor({ galleryElementId, templateKeys, templateKeyPattern, insertAdjacentElement }) {
    this.#galleryElementId = galleryElementId;
    this.#templateKeys = templateKeys;
    this.#templateKeyPattern = templateKeyPattern;
    this.#insertAdjacentElement = insertAdjacentElement;
  }

  hasAvalibelSpace() {
    const galleryHeight = this.#galleryListElement.offsetHeight + this.#galleryListElement.offsetTop;
    // this.#templateElement.offsetHeight
    return galleryHeight < window.innerHeight;
  }

  // data is object {key1:'', key2:'', ... , keyN:''}
  addElementToList(data) {
    if(typeof data !== 'object') throw new Error('Data must be object type!')
    const newElement = this.#templateElement.cloneNode(true);
    newElement.classList.remove(this.#templateElementClassName);

    this.#templateKeys.forEach(key => {
      newElement.innerHTML = newElement.innerHTML.replaceAll(
        this.#templateKeyPattern[0] + key + this.#templateKeyPattern[1],
        data[key],
      );
    });

    if (this.#insertAdjacentElement) {
      const [className, position] = this.#insertAdjacentElement;
      this.#galleryListElement
        .querySelector(`.${className}`)
        .insertAdjacentElement(position, newElement);
    } else {
      this.#galleryListElement.insertAdjacentElement('beforeend', newElement);
    }
  }

  get #galleryListElement() {
    return document.getElementById(this.#galleryElementId);
  }

  get #templateElement() {
    return document.querySelector(`#${this.#galleryElementId} .${this.#templateElementClassName}`);
  }
}
