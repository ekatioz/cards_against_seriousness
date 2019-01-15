import { UiElement } from "./UiElement";
import { Card } from "./Card";

export class CoveredCard extends Card {

    constructor(confirmationCallback) {
        super('🙈');
        this._revealCallback = () => this._reveal();
        this.addClickListener(this._revealCallback);
        this.addClass('covered');
        this.addClass('locked');
        this._locked = true;
        this._confirmationCallback = confirmationCallback;
    }

    revealCovered(text){
        this.text = '🐵';
        this._coveredText = text;
        this._locked = false;
    }
    
    _reveal(){
        if(!this._locked){
            this.removeClass('covered');
            this.text = this._coveredText;
            this.removeClickListener(this._revealCallback);
            this.addClickListener(() => this._confirmationCallback(this));
        }
    }
}