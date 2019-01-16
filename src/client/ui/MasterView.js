import { Cloze } from "./Cloze";
import { FullscreenElement } from "./FullscreenElement";
import { CoveredCard } from "./CoveredCard";

export class MasterView extends FullscreenElement {

    constructor() {
        super();
        this.addClass('master');
        this._cloze = new Cloze();
        this.addUiElement(this._cloze);
        this._cCards = [];
    }

    addCoveredCard(){
        const cCard = new CoveredCard(choosen => {
            this._cCards.forEach(card => {
                this.removeUiElement(card);
            });
            this._cCards.length = 0;
            this._chooseCallback(choosen.text);
        });
        this._cCards.push(cCard);
        this.addUiElement(cCard);
    }

    unlockCards(cards){
        shuffle(cards).forEach((card,i) => this._cCards[i].revealCovered(card));
    }

    set onCardChoosen(cb){
        this._chooseCallback = cb;
    }

    set cloze(parts){
        this._cloze.setTextParts(...parts);
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}