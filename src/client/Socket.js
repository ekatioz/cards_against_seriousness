import store from "./store/store";
import { socketAction, showNotification } from "./store/actions";
import { msgType } from "../commonStrings";

class Socket {
  constructor() {
    if (!Socket.instance) {
      this._listeners = {};
      const protocol = location.protocol.includes("https") ? "wss" : "ws";
      const socketURL = `${protocol}://${window.location.hostname}:${window.location.port}/`;
      this._connection = new WebSocket(socketURL);
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
        if (data.type === msgType.serverMessage) {
          store.dispatch(showNotification(data.msg));
        } else {
          store.dispatch(socketAction(data));
        }
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
