import { Hand } from "./Hand";
import { Card } from "./Card";
import 'reset-css';
import './resources/styles.css';
import { Cloze } from "./Cloze";
import { Lobby } from "./Lobby";
import Socket from "./Socket";


const cloze = new Cloze();
const hand = new Hand();
const lobby = new Lobby(
    () => {
        Socket.send({ type: 'newUser', name: lobby.username });
    },
    () => {
        Socket.send({ type: 'startGame' });
        startGame();
    }
);

Socket.on('whitecard', data =>
    data.response.map(text =>
        new Card(
            text,
            (c) => cloze.fillGap(c),
            (c) => confirmCard(c)))
        .forEach((card, idx) =>
            setTimeout(() => hand.addCard(card), idx * 100)
        ));

Socket.on('blackcard', data => cloze.setTextParts(...data.response));

Socket.on('userlist', data => lobby.users = data.users);

Socket.on('startGame', () => startGame());

Socket.on('cardConfirmed', () => addCoveredCard());

Socket.on('lock', () => lockUI());

Socket.on('reveal', data => revealCards(data.cards));

function lockUI() {
    hand.lock();
    cloze.center();
}

function startGame() {
    document.body.removeChild(lobby.element);
    document.body.appendChild(cloze.element);
    document.body.appendChild(hand.element);
}

function revealCards(cards) {
    const cardElements = document.getElementsByClassName('covered');
    for (let i = 0; i < cardElements.length; i++) {
        const element = cardElements[i];
        element.addEventListener('click', function (e) {
            element.classList.remove('covered');
            element.classList.add('revealed');
            element.innerText = cards[i];
            element.removeEventListener('click', this);
        });
        element.classList.remove('locked');
    };
}

function addCoveredCard() {
    var cards = document.getElementById('cards');
    if (!cards) {
        cards = document.createElement('div');
        cards.id = 'cards';
        document.body.appendChild(cards);
    }
    const newCard = document.createElement("div");
    newCard.classList.add('card');
    newCard.classList.add('covered');
    newCard.classList.add('locked');
    newCard.innerHTML = "&nbsp;";

    cards.appendChild(newCard);
}

function confirmCard(card) {
    hand.removeCard(card);
    lockUI();
    Socket.send({ type: 'confirmCard', text: card.text });
}


// Start Userinterface
document.body.appendChild(lobby.element);