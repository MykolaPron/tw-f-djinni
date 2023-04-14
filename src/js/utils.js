export function setVisibilityForCollapseElementControls(
  elementsSelector, callbackGetControlElement
) {
  const collapsedElements = document.querySelectorAll(elementsSelector);

  collapsedElements.forEach(({
    id, offsetHeight, scrollHeight, classList
  }) => {
    const isVisible = classList.contains('show')
      || classList.contains('collapsing')
      || offsetHeight !== scrollHeight;

    const actionButton = callbackGetControlElement(id);

    actionButton.style.visibility = isVisible ? 'visible' : 'hidden';
  });
}

export class BsBreakpoint {
  #breakpointValues = [];
  #breakpointNames = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  #prefix = '--bs-breakpoint-';
  #previousBreakpoint;

  constructor() {
    for (const breakpointName of this.#breakpointNames) {
      const value = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(this.#prefix + breakpointName);
      if (value) {
        this.#breakpointValues[breakpointName] = value;
      }
    }

    this.#previousBreakpoint = this.currentBreakpoint;
  }

  onChange(callback) {
    window.addEventListener('resize', () => {
      const breakpoint = this.currentBreakpoint;

      if (breakpoint.index !== this.#previousBreakpoint.index) {
        this.#previousBreakpoint = breakpoint;

        callback(this.currentBreakpoint);
      }
    });
  }

  get currentBreakpoint() {
    for (let index = 0; index < this.#breakpointNames.length; index++) {
      const name = this.#breakpointNames[index].trim()
      const value = this.#breakpointValues[name].trim()

      if (window.matchMedia(`(min-width: ${value})`).matches) {
        return {index, name, value};
      }
    }
  }

}
