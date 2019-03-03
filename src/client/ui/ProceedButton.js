import { UiElement } from "./UiElement";

export class ProceedButton extends UiElement{

    constructor(caption, action) {
        super();
        this.addClass('proceed-button');
        this.element.innerText = caption;
        this.element.addEventListener('click',action);
    }
}