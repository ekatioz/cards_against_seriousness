export class Card {

    constructor(text, fillingCallback) {
        const element = document.createElement('div');
        element.addEventListener('click',(evt) => fillingCallback(this));
        element.className = 'card';
        element.innerText = text;
        this.element = element;
    }

    get text() {
        return this.element.innerText;
    }
}