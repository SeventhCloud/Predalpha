const MARKET_CHANNEL = "market";
const USER_CHANNEL = "user";

import {} from "@polymarket/clob-client"
import type { BunMessageEvent, WebSocket, CloseEventInit } from "bun";


export default class WebSocketOrderBook {
private channelType: 'market' | 'user';
private url: string;
private data: string[];
private auth: { apiKey?: string; secret?: string; passphrase?: string } | null;
private verbose: boolean;
private ws: WebSocket;
private pingInterval?: NodeJS.Timeout;
private orderbooks: Record<string, any>;

constructor(
    channelType: 'market' | 'user',
    url: string,
    data: string[],
    auth: { apiKey?: string; secret?: string; passphrase?: string } | null,
    verbose: boolean
) {
    this.channelType = channelType;
    this.url = url;
    this.data = data;
    this.auth = auth;
    this.verbose = verbose;

    const fullUrl = `${url}/ws/${channelType}`;
    this.ws = new WebSocket(fullUrl);
    
    this.ws.onopen = (ev: Event) => this.onOpen(); 
    this.ws.onmessage = (msg: BunMessageEvent) => this.onMessage(msg);
    this.ws.onerror = (err: Event) => this.onError(err);
    this.ws.onclose = (event: CloseEventInit) => this.onClose(event);

    this.orderbooks = {};
}

  onMessage(message: MessageEvent ) {
    console.log("Received message on", this.channelType, "channel");
    console.log("Message type:", message);
    if (this.verbose) console.log("Message:", message.toString());
  }

  onError(error: any) {
    console.error("Error:", error);
    process.exit(1);
  }

  onClose(event: CloseEventInit) {
    console.log("Connection closed:", event.code, event.reason);
    process.exit(0);
  }

  onOpen() {
    if (this.channelType === MARKET_CHANNEL) {
      this.ws.send(JSON.stringify({ assets_ids: this.data, type: MARKET_CHANNEL }));
    } else if (this.channelType === USER_CHANNEL && this.auth) {
      this.ws.send(JSON.stringify({ markets: this.data, type: USER_CHANNEL, auth: this.auth }));
    } else {
      process.exit(1);
    }

    // start pinging every 10 seconds
    this.pingInterval = setInterval(() => this.ws.send("PING"), 10000);
  }

  subscribeToTokenIds(assetIds: string[]) {
      console.log("Subscribing to token IDs:", assetIds);
    if (this.channelType === MARKET_CHANNEL) {
      this.ws.send(JSON.stringify({ assets_ids: assetIds, operation: "subscribe" }));
    }
  }

  unsubscribeFromTokenIds(assetIds: string[]) {
    if (this.channelType === MARKET_CHANNEL) {
      this.ws.send(JSON.stringify({ assets_ids: assetIds, operation: "unsubscribe" }));
    }
  }
}

