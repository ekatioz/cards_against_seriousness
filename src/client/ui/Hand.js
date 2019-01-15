import { UiElement } from "./UiElement";
import { Card } from "./Card";

export class Hand extends UiElement{

    constructor(confirmationCallback) {
        super();
        this.addClass('hand');
        this.confirmationCallback = confirmationCallback;
    }

    addCard(cardText) {
        this.addUiElement(new Card(cardText,this.confirmationCallback));
    }

    removeCard(uiElement){
        this.removeUiElement(uiElement);
    }
}