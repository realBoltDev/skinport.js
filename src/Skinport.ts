import axios, { type AxiosInstance } from "axios";

import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser"

import type {
  ExtendedSocket,
  SalesHistoryResponse,
  ItemsResponse,
  OutOfStockResponse,
  TransactionsResponse
} from "./types/index.js";

export class Skinport {
  private api: AxiosInstance;
  private _socket?: ExtendedSocket;

  constructor(clientId?: string, clientSecret?: string) {
    this.api = axios.create({
      baseURL: "https://api.skinport.com/v1",
      headers: {
        "Authorization": (clientId && clientSecret) ? `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` : "",
        "Accept-Encoding": "br",
        "Content-Type": "application/json"
      }
    });
  }

  /**
   * Initializes a WebSocket connection to Skinport.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is successful.
   * @throws {Error} If the connection fails.
   *
   * @example
   * try {
   *   await skinport.initSocket();
   *   console.log("WebSocket initialized successfully.");
   * } catch (error) {
   *   console.error("Failed to initialize WebSocket:", error);
   * }
   */
  public async initSocket(): Promise<void> {
    // Debounce if exists
    if (this._socket) return;

    return new Promise((resolve, reject) => {
      this._socket = io("wss://skinport.com", {
        transports: ["websocket"],
        parser,
        secure: true,
        rejectUnauthorized: false,
        reconnection: true,
      }) as ExtendedSocket;

      this._socket.on("connect", () => {
        console.log("Connected to Skinport WebSocket")
        resolve();
      })

      this._socket.on("connect_error", (err) => {
        console.error("Connection Error:", err);
        reject(err);
      });
    });
  }

  /**
   * Getter for the WebSocket connection.
   * 
   * @throws {Error} If the socket is not initialized, instructs the user to call `initSocket()` first.
   * 
   * @returns {ExtendedSocket} The initialized WebSocket connection.
   * 
   * @event saleFeed - Listens for sale feed events.
   * @description Supported event types:
   * - `listed`: A new item has been listed.
   * - `sold`: An item has been sold.
   * 
   * @example
   * socket.on("saleFeed", (data) => {
   *   console.log(data);
   * });
   * 
   * @emit saleFeedJoin - Joins the sale feed.
   * @param {Object} data - The parameters for joining the sale feed.
   * @param {number} data.appid - The app ID for the inventory's game.
   * @param {string} data.currency - The currency for pricing (Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD).
   * @param {string} data.locale - The locale of the result (Supported: en, de, ru, fr, zh, nl, fi, es, tr).
   * 
   * @example
   * socket.emit("saleFeedJoin", { appid: 730, currency: "EUR", locale: "en" });
   */
  public get socket(): ExtendedSocket {
    if (!this._socket) {
      throw new Error("Socket not initialized. Call `initSocket()` first.");
    }
    return this._socket;
  }


  /**
   * Provides a list of items available on the marketplace, along with their associated metadata.
   * @param {object} [options] - Optional query parameters.
   * @param {number} [options.app_id=730] - The app ID for the inventory's game (default: 730).
   * @param {string} [options.currency="EUR"] - The currency for pricing. Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD (default: EUR).
   * @param {boolean} [options.tradable=false] - If true, returns only tradable items (default: false).
   *
   * @returns {Promise<ItemsResponse>} A promise that resolves to the items data.
   * @throws {AxiosError} If the request fails.
   *
   * @authorization No authorization required.
   * @rateLimit 8 requests per 5 minutes.
   * @cache Cached for 5 minutes.
   *
   * @example
   * try {
   *   const items = await skinport.getItems({ app_id: 730, currency: "EUR", tradable: true });
   *   console.log(items);
   * } catch (error) {
   *   console.error("Failed to fetch items:", error);
   * }
   */
  public async getItems(options: { app_id?: number; currency?: string; tradable?: boolean } = {}): Promise<ItemsResponse> {
    return (
      await this.api.get<ItemsResponse>("/items", { params: options })
    ).data;
  }

  /**
   * Provides aggregated data for specific in-game items that have been sold on Skinport.
   * @param {object} [options] - Optional query parameters.
   * @param {string} [options.market_hash_name] - The item's names, comma-delimited.
   * @param {number} [options.app_id=730] - The app_id for the inventory's game (default 730).
   * @param {string} [options.currency="EUR"] - The currency for pricing (default EUR - Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD).
   * 
   * @returns {Promise<SalesHistoryResponse>} A promise that resolves to the sales history data.
   * @throws {AxiosError} If the request fails.
   * 
   * @authorization No authorization required.
   * @rateLimit 8 requests per 5 minutes.
   * @cache Cached for 5 minutes.
   */
  public async getSalesHistory(options: { market_hash_name?: string; app_id?: number; currency?: string }): Promise<SalesHistoryResponse> {
    return (
      await this.api.get<SalesHistoryResponse>("/sales/history", { params: options })
    ).data;
  }

  /**
   * Provides information about in-game items that are currently out of stock on Skinport.
   * @param {object} [options] - Optional query parameters.
   * @param {number} [options.app_id=730] - The app_id for the inventory's game (default 730).
   * @param {string} [options.currency="EUR"] - The currency for pricing (default EUR - Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD).
   * 
   * @returns {Promise<OutOfStockResponse>} A promise that resolves to the out of stock data.
   * @throws {AxiosError} If the request fails.
   * 
   * @authorization No authorization required.
   * @cache Cached for 1 hour.
   */
  public async getOutOfStock(options: { app_id: number; currency: string }): Promise<OutOfStockResponse> {
    return (
      await this.api.get<OutOfStockResponse>("/sales/out-of-stock", { params: options })
    ).data;
  }

  /**
   * Retrieves a paginated list of user account transactions, including details.
   * @param {object} [options] - Optional query parameters.
   * @param {number} [options.page] - Pagination Page (default 1).
   * @param {number} [options.limit] - Limit results between 1 and 100 (default 100).
   * @param {string} [options.order] - Order results by asc or desc (default desc).
   * 
   * @returns {Promise<TransactionsResponse>} A promise that resolves to the transactions data.
   * @throws {AxiosError} If the request fails.
   * 
   * @authorization Authorization required.
   */
  public async getTransactions(options: { page: number; limit: number; order: string }): Promise<TransactionsResponse> {
    return (
      await this.api.get<TransactionsResponse>("/account/transactions", { params: options })
    ).data;
  }
}