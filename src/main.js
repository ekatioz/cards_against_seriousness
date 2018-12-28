import { Hand } from "./Hand";
import { Card } from "./Card";
import './resources/styles.css';
import { Cloze } from "./Cloze";

const connection = new WebSocket('ws://localhost:13700');

const cloze = new Cloze();
const hand = new Hand();

cloze.setTextParts('Ohne', 'wäre alles besser!');



document.body.appendChild(cloze.element);
document.body.appendChild(hand.element);

connection.onopen = () => connection.send(JSON.stringify({ type: 'get', topic: 'whitecard', count: '5' }));

// Log errors
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.type === 'get' && data.topic === 'whitecard') {
        const texts = data.response;
        texts
            .map(text => new Card(text, (c) => cloze.fillGap(c)))
            .forEach((card, idx) => {
                setTimeout(() => hand.addCard(card), idx * 100);
            });
    }
};