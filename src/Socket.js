class Socket {

    constructor() {
        if (!Socket.instance) {
            this._listeners = {};
            this._connection = new WebSocket(`ws://${location.hostname}:13700`);
            this._connection.onopen = () => console.log('ws connection open');
            this._connection.onerror = error => console.log('WebSocket Error ' + error);
            this._connection.onmessage = msg =>  {
                const data = JSON.parse(msg.data);
                console.log('message from socket', data);
                if (this._listeners[data.type]) {
                    this._listeners[data.type].forEach(cb => cb(data));
                }
            };
            Socket.instance = this;
        }
        return Socket.instance;
    }

    send(data) {
        this._connection.send(JSON.stringify(data));
    }

    on(type, callback) {
        this._listeners[type] = this._listeners[type]
            ? this._listeners[type].push(callback)
            : [callback];
    }


}

const instance = new Socket();
Object.freeze(instance);

export default instance;