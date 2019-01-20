export class UiElement {
    constructor() {
        this.element = document.createElement('div');
    }

    clear() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    isAttached() {
        return !!this.element.parentNode;
    }

    addClickListener(cb) {
        this.element.addEventListener('click', cb);
    }

    removeClickListener(cb) {
        this.element.removeEventListener('click', cb);
    }

    addClass(name) {
        this.element.classList.add(name);
    }

    removeClass(name) {
        this.element.classList.remove(name);
    }

    addDomElement(domElement) {
        this.element.appendChild(domElement);
    }

    addUiElement(uiElement) {
        this.addDomElement(uiElement.element);
    }

    removeDomElement(domElement) {
        if (!!domElement.parentNode) this.element.removeChild(domElement);
    }

    removeUiElement(uiElement) {
        if (uiElement.isAttached()) this.removeDomElement(uiElement.element);
    }
}