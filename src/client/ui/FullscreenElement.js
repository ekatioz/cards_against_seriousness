import { UiElement } from "./UiElement";

export class FullscreenElement extends UiElement{

    constructor() {
        super();
        this.addClass('fullscreen');
    }
}