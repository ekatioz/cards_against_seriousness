export class UiElement {
    constructor() {
        this.element = document.createElement('div');
    }

    clear() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    addClickListener(cb){
        this.element.addEventListener('click',cb);
    }

    removeClickListener(cb){
        this.element.removeEventListener('click',cb);
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
        this.element.removeChild(domElement);
    }

    removeUiElement(uiElement) {
        this.removeDomElement(uiElement.element);
    }
}