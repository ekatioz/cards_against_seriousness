import { UiElement } from "./UiElement";
import { CoveredCard } from "./CoveredCard";

export class CoveredHand extends UiElement{



    constructor(chooseCallback) {
        super();
        this.addClass('coveredHand');
        this._chooseCallback = chooseCallback;
        this._cCards = [];
    }

    addCoveredCard() {
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

    unlockCards(cards) {
        shuffle(cards).forEach((card, i) => this._cCards[i].revealCovered(card));
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}