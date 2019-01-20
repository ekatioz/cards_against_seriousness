import { UiElement } from "./UiElement";

export class Card extends UiElement {

    constructor(text, confirmationCallback) {
        super('span');
        if (confirmationCallback) this.addClickListener(e => confirmationCallback(this));

        this.addClass('card');
        this.text = text;
    }

    get text() {
        return this.element.innerText;
    }

    set text(text) {
        this.element.innerText = text;
    }
}