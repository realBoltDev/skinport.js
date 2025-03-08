import type { Socket } from "socket.io-client";

interface SaleFeedData {
    eventType: "listed" | "sold";
    sales: any[];
}

interface SaleFeedJoinData {
    appid: number;
    currency: string;
    locale: string;
}

interface ServerToClientEvents {
    saleFeed: (data: SaleFeedData) => void;
}

interface ClientToServerEvents {
    saleFeedJoin: (data: SaleFeedJoinData) => void;
}

export interface ExtendedSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}

// Re-exports
export type * from "./requests/history.js";
export type * from "./requests/items.js";
export type * from "./requests/outOfStock.js";
export type * from "./requests/transactions.js";