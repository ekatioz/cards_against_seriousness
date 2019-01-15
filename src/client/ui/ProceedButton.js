import { UiElement } from "./UiElement";

export class ProceedButton extends UiElement{

    constructor(caption, action) {
        super();
        this.element = document.createElement('button');
        this.addClass('start-button');
        this.element.innerText = caption;
        this.element.addEventListener('click',action);
    }
}