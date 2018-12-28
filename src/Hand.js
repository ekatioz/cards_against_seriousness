export class Hand {

    constructor() {
        const element = document.createElement('div');
        element.className = 'hand';
        this.element = element;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
        this.element.appendChild(card.element);
        this.realignCards();
    }

    removeCard(card) {
        this.cards.push(card);
        this.element.removeChild(card);
        this.realignCards();
    }

    realignCards() {
        const size = this.cards.length;
        if (size > 1) {
            const stepAngle = 40 / (size - 1);
            const startAngle = -20;

            this.cards.forEach((card, idx) => {
                card.element.setAttribute("style", `transform:rotate(${startAngle + (stepAngle * idx)}deg)`);
            });
        }
    }
}