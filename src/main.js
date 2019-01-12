import { Hand } from './Hand';
import { Card } from './Card';
import 'reset-css';
import './resources/styles.css';
import { Cloze } from './Cloze';
import { Lobby } from './Lobby';
import Socket from './Socket';
import CAS from "./commonStrings";


const cloze = new Cloze();
const hand = new Hand();
var role = '';
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
        new Card( // TODO
            text,
            (c) => cloze.fillGap(c),
            (c) => confirmCard(c)))
        .forEach((card, idx) =>
            setTimeout(() => hand.addCard(card), idx * 100)
        ));

Socket.on('blackcard', data => cloze.setTextParts(...data.response));

Socket.on('userlist', data => lobby.users = data.users);

Socket.on('startGame', () => startGame());

Socket.on('nextRound', () => nextRound());

Socket.on('cardConfirmed', () => addCoveredCard());

Socket.on('lock', () => lockUI());

Socket.on('reveal', data => revealCards(data.cards));

Socket.on('winner', data => showWinner(data.player));

Socket.on('role', _role => role = _role.role);

function showWinner(player) {
    const winner = document.createElement('div');
    winner.className = 'winner';
    winner.innerText = `${player} gewinnt diese Runde!`;
    if(role === CAS.role_master){
        const start = document.createElement('button');
        start.innerText = 'Weiter';
        start.className = 'start-button';
        start.addEventListener('click', (evt) => {
            Socket.send({ type: 'nextRound' });
            document.body.removeChild(start);
            nextRound();
        });
        document.body.appendChild(start);
    }
    document.body.appendChild(winner);
}

function lockUI() {
    hand.lock();
    cloze.center();
}

function startGame() {
    document.body.removeChild(lobby.element);
    document.body.appendChild(cloze.element);
    document.body.appendChild(hand.element);
}

function nextRound() {
    document.body.removeChild(document.getElementsByClassName('winner')[0]);
    cloze.top();
    hand.unlock();
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
            element.addEventListener('click', function (e) {
                Socket.send({ type: 'chooseCard', card: cards[i] });
                element.removeEventListener('click', this);
                cloze.fillGap({ text: cards[i] }); // TODO
                cloze.center();
                document.body.removeChild(document.getElementById('cards'));
            });
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
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.classList.add('covered');
    newCard.classList.add('locked');
    newCard.innerHTML = '&nbsp;';

    cards.appendChild(newCard);
}

function confirmCard(card) {
    hand.removeCard(card);
    lockUI();
    Socket.send({ type: 'confirmCard', text: card.text });
}


// Start Userinterface
document.body.appendChild(lobby.element);