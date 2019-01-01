import { Hand } from "./Hand";
import { Card } from "./Card";
import 'reset-css';
import './resources/styles.css';
import { Cloze } from "./Cloze";
import { Lobby } from "./Lobby";

const connection = new WebSocket(`ws://${location.hostname}:13700`);
const cloze = new Cloze();
const hand = new Hand();

connection.onopen = () => console.log('ws connection open');

const lobby = new Lobby(
    () => {
        sendToSocket({ type: 'newUser', name: lobby.username });
    },
    () => {
        sendToSocket({ type: 'startGame' });
        startGame();
    }
);
document.body.appendChild(lobby.element);


function startGame() {
    document.body.removeChild(lobby.element);
    document.body.appendChild(cloze.element);
    document.body.appendChild(hand.element);
}

// Log errors
connection.onerror = error => {
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = e => {
    const data = JSON.parse(e.data);
    console.log('message', data);
    if (data.type === 'get') {
        handleResponse(data.topic, data.response);
    } else if (data.type === 'userlist') {
        lobby.users = data.users;
        console.log(data.users);
    }else if (data.type === 'startGame') {
        console.log('startgame')
        startGame();
    }
};

function sendToSocket(data) {
    connection.send(JSON.stringify(data));
}

function handleResponse(topic, response) {
    switch (topic) {
        case 'whitecard':
            response
                .map(text => new Card(
                    text,
                    (c) => cloze.fillGap(c),
                    (c) => publishConfirmation(c.text)))
                .forEach((card, idx) => {
                    setTimeout(() => hand.addCard(card), idx * 100);
                });
            break;
        case 'blackcard':
            cloze.setTextParts(...response);
            break;
        default:
            break;
    }
}

function publishConfirmation(text) {
    sendToSocket({ type: 'confirmCard', text: text });
}