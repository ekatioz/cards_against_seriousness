import { UiElement } from "./UiElement";

export class ProceedButton extends UiElement{

    constructor(caption, action) {
        super();
        this.addClass('proceed-button');
        this.element.innerHTML = `<div class="button-text">${caption}</div>`;
        this.element.addEventListener('click',action);
    }
}