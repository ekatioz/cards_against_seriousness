const WebSocket = require('ws');

_listeners = {};
_connection = new WebSocket(`ws://localhost:13700`);
_connection.onopen = () => {
    console.log('ws connection open');

    send({ type: 'newUser', name: 'A User' });
    send({ type: 'newUser', name: 'B User' });
    send({ type: 'newUser', name: 'C User' });

    on('whitecard', data => {
        var min = 5,
            max = 10;
        var rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
        console.log('Wait for ' + rand + ' seconds');
        setTimeout(() => send({ type: 'confirmCard', text: data.response[0] }), rand * 1000);
    });
};
_connection.onerror = error => console.log('WebSocket Error ' + error);
_connection.onmessage = msg => {
    const data = JSON.parse(msg.data);
    console.log('message from socket', data);
    if (_listeners[data.type]) {
        _listeners[data.type].forEach(cb => cb(data));
    }
};


function send(data) {
    this._connection.send(JSON.stringify(data));
}

function on(type, callback) {
    this._listeners[type] = this._listeners[type]
        ? this._listeners[type].push(callback)
        : [callback];
}

