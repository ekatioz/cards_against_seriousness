export class Card {

    constructor(text, fillingCallback, confirmationCallback) {
        const element = document.createElement('div');
        element.addEventListener('click', (evt) => fillingCallback(this));
        element.addEventListener('dblclick', (evt) => confirmationCallback(this));
        element.className = 'card';
        element.innerText = text;
        this.element = element;
    }

    lock(){
        this.locked = true;
    }

    unlock(){
        this.locked = false;
    }

    get text() {
        return this.element.innerText;
    }
}