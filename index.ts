import { ClobClient, type PaginationPayload } from "@polymarket/clob-client";
import { Wallet } from "ethers"; // v5.8.0

import WebSocketOrderBook from "./websocket";

import { GammaSDK } from "./client/gamma-client";
import type { EventType, MarketType } from "./types/http-schemas";
import { Database } from "bun:sqlite";
import { cons } from "effect/List";
import { DBClient } from "./client/db-client";


const HOST = "https://clob.polymarket.com";
const CHAIN_ID = 137; // Polygon mainnet
const signer = new Wallet(process.env.PRIVATE_KEY!);

const tempClient = new ClobClient(HOST, CHAIN_ID, signer);
const userApiCreds = await tempClient.deriveApiKey();

const auth = { apiKey: userApiCreds.key, secret: userApiCreds.secret, passphrase: userApiCreds.passphrase };


// Choose based on your wallet type (see table above)
const SIGNATURE_TYPE = 0; // EOA example
const FUNDER_ADDRESS = signer.address; // For EOA, funder is your wallet

const client = new ClobClient(
  HOST,
  CHAIN_ID,
  signer,
  userApiCreds,
  SIGNATURE_TYPE,
  FUNDER_ADDRESS
);

const MARKET_CHANNEL = "market";
const USER_CHANNEL = "user";

// Example usage
const url = "wss://ws-subscriptions-clob.polymarket.com";

const assetIds = [
  "109681959945973300464568698402968596289258214226684818748321941747028805721376",
];




// const marketConnection = new WebSocketOrderBook(MARKET_CHANNEL, url, assetIds, auth, true);
// const userConnection = new WebSocketOrderBook(USER_CHANNEL, url, [], auth, true);

// // Subscribe to another token after connecting
// setTimeout(() => {
//   marketConnection.subscribeToTokenIds(["123"]);
// }, 1000);

// const ws = new WebSocket("wss://ws-subscriptions-clob.polymarket.com/ws/market");

// ws.onopen = () => {
//   // Subscribe to orderbook updates
//   ws.send(JSON.stringify({
//     type: "market",
//     assets_ids: [tokenId]
//   }));
// };

// ws.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   // Handle orderbook update
// };
// let marketsdata: PaginationPayload[] = [];
// let markets = await client.getMarkets();
// let counter = 0
// while(markets.next_cursor && counter < 5) {
//     marketsdata.push(markets);
//     markets = await client.getMarkets(markets.next_cursor);
//     console.log("Fetched markets batch, next cursor:", markets.next_cursor);
//     counter++;
// }
// Bun.write("./markets.json", JSON.stringify(marketsdata, null, 2));

console.log("Finished fetching markets.");

const gammaClient = new GammaSDK();

// gammaClient.getClosedMarkets({limit: 1000000000}).then((res) => {
//     console.log("Closed markets:", res);
//     console.log("Total closed markets:", res.length);
// });

// gammaClient.getActiveMarkets({limit: 1000000000}).then((res) => {
//     console.log("Active markets:", res);
//     console.log("Total active markets:", res.length);
// });

// gammaClient.getEvents({limit: 1000000000}).then((res) => {
//     console.log("Events:", res);
//     console.log("Total events:", res.length);
// });

console.log("Opening database");
const dbPolymarket = new DBClient("./database/polymarket.db");
console.log("Database ready.");


let events: EventType[] = []
for(let i = 0, fetchedAll = false; !fetchedAll; i++) {
    const eventResponses = await gammaClient.getActiveEvents({limit: 500, closed: false, offset: i * 500, archived: false}); 

    const tx = dbPolymarket.db.transaction((eventsBatch: EventType[]) => {
        for(const event of eventsBatch) {
            dbPolymarket.insertEvent.run(
                event.id,
                event.slug,
                event.ticker ?? null,
                event.title ?? null,
                event.active ? 1 : 0,
                event.closed ? 1 : 0,
                event.startDate ?? null,
                event.endDate ?? null,
                event.createdAt,
                event.updatedAt ?? null,
                event.liquidity ?? null,
                event.volume ?? null,
                event.openInterest ?? null,
                JSON.stringify(event)
            );
        }
    });

    if(eventResponses.length < 500) {
        fetchedAll = true;
    }
    tx(eventResponses);
    console.log(`Fetched ${eventResponses.length} events in batch ${i + 1}`);    
}


// Bun.write("./events_active.json", JSON.stringify(events, null, 2));

console.log("Finished fetching events.");