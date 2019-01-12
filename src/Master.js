export class Master {

    constructor() {
        const element = document.createElement('div');
        element.className = 'hand';
        this.element = element;
        this.cards = [];
    }

    lock(){
        this.element.classList.add('locked');
        this.cards.forEach(c => c.lock());
        this.locked = true;
    }

    unlock(){
        this.element.classList.remove('locked');
        this.cards.forEach(c => c.unlock());
        this.locked = false;
    }

    addCard(card) {
        this.cards.push(card);
        this.element.appendChild(card.element);
        this.realignCards();
    }

    removeCard(card) {
        this.cards.splice(this.cards.indexOf(card), 1);
        this.element.removeChild(card.element);
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