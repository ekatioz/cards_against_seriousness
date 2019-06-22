import store from "./store/store";
import { socketAction } from "./store/actions";

class Socket {
  constructor() {
    if (!Socket.instance) {
      this._listeners = {};
      this._connection = new WebSocket(`ws://${location.hostname}:13700`);
      this._connection.onopen = () => console.log("ws connection open");
      this._connection.onerror = error =>
        console.log("WebSocket Error " + error);
      this._connection.onclose = () => {
        if (this._listeners["close"]) {
          this._listeners["close"].forEach(cb => cb());
        }
      };
      this._connection.onmessage = msg => {
        const data = JSON.parse(msg.data);
        console.log("message from socket", data);
        store.dispatch(socketAction(data));
      };
      Socket.instance = this;
    }
    return Socket.instance;
  }

  send(data) {
    this._connection.send(JSON.stringify(data));
  }
}

const instance = new Socket();
Object.freeze(instance);

export default instance;
