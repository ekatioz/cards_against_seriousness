import { Client } from "colyseus.js";

export declare global {
  interface Window {
    client: Client
  }
}
