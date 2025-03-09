
# Skinport API Wrapper
[![npm version](https://img.shields.io/npm/v/skinport.js.svg)](https://npmjs.com/package/skinport.js)
[![license](https://img.shields.io/npm/l/skinport.js.svg)](https://github.com/realBoltDev/skinport.js/blob/main/LICENSE)

Easy to use, fully typed wrapper for interacting with Skinport API.

- [Official Skinport API documentation](https://docs.skinport.com/)
- You can get your Skinport API key [here](https://skinport.com/account)

## Installation

Install it from [npm](https://www.npmjs.com/package/skinport.js):

    $ npm install skinport.js

## Usage
#### ESM (ECMAScript Modules)

If you're using ESM (`"type": "module" in package.json`), you can directly import `Skinport` using `import`.
```javascript
import Skinport from "skinport.js";

const skinport = new Skinport('clientId', 'clientSecret');

skinport.getItems();
skinport.getTransactions();
...
```

#### CommonJS (CJS)

If you're using CommonJS (`require()` based system), use `await import()`.
```javascript
(async () => {
  const { default: Skinport } = await import("skinport.js"); 

  const skinport = new Skinport('clientId', 'clientSecret');

  skinport.getItems();
  skinport.getTransactions();
  ...
})();
```

You don't need to pass `clientId` and `clientSecret` for methods which don't require authentication.

#### Initializing Websocket:
```javascript
import Skinport from "skinport.js";

const skinport = new Skinport('clientId', 'clientSecret');

await skinport.initSocket();

const socket = skinport.socket;
```
Note: Trying to access `.socket` property before calling `initSocket()` will throw an error.

## Documentation

### API
```javascript
const skinport = new Skinport('clientId', 'clientSecret');
```
- clientId: string (optional) (required for secured methods)
- clientSecret: string (optional) (required for secured methods)

---

### Socket
Extends [socket.io-client](https://github.com/socketio/socket.io)'s `Socket` class. Will throw an error if accessed before calling `initSocket()`.

```javascript
await skinport.initSocket();
const socket = skinport.socket;
```

### on(event, listener)
`socket.on` is `io().on` wrapper that includes typings support for Skinport websocket events.

```javascript
socket.on(event, listener);
```

- event: string (required)
  - "saleFeed"
- listener: Function (required)

Event callback function has typings support.

```javascript
socket.on("saleFeed", (data) => {
  /*
   * data extends SaleFeedData interface
   * 
   * Available properties: 
   * { 
   *      eventType: listed | sold,
   *      sales: any[],
   * }
   */
  const { eventType, sales } = data;
})
```

### emit(event, data)
`socket.emit` is `io().emit` wrapper that includes typings support for Skinport websocket emitters.

```javascript
socket.emit(event, data);
```

- event: string (required)
  - "saleFeedJoin"
- data: object (required)

Event emitter data has typings support.

```javascript
socket.emit("saleFeedJoin", data);
/*
 * data extends SaleFeedJoinData interface
 * 
 * Available properties: 
 * { 
 *     appid: number,
 *     currency: string,
 *     locale: string
 * }
 */
```

---

### initSocket()
Initializes the websocket

---

### getItems(options)
Provides a list of items available on the marketplace, along with their associated metadata.
- options: object (optional)

Authorization: Not required

| Property | Type | Required | Description |
| :----: | :--: | :------: | :---------: |
| app_id | number | Optional | The app_id for the inventory's game (default 730). |
| currency | string | Optional | The currency for pricing (default EUR - Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD). |
| tradable | boolean | Optional | If true, it shows only tradable items on the market (default false). |

```javascript
const items = skinport.getItems({ app_id: 730, currency: "EUR", tradable: true });
console.log(items);
```

---

### getSalesHistory(options)
Provides aggregated data for specific in-game items that have been sold on Skinport.
- options: object (optional)

Authorization: Not required

| Property | Type | Required | Description |
| :----: | :--: | :------: | :---------: |
| market_hash_name | string | Optional | The item's names, comma-delimited. |
| app_id | number | Optional | The app_id for the inventory's game (default 730). |
| currency | string | Optional | The currency for pricing (default EUR - Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD). |

```javascript
const salesHistory = skinport.getSalesHistory({ market_hash_name: "Glove Case,★ Karambit | Slaughter (Minimal Wear)", app_id: 730, currency: "EUR" });
console.log(salesHistory);
```

---

### getOutOfStock(options)
Provides information about in-game items that are currently out of stock on Skinport.
- options: object (optional)

Authorization: Not required

| Property | Type | Required | Description |
| :----: | :--: | :------: | :---------: |
| app_id | number | Optional | The app_id for the inventory's game (default 730). |
| currency | string | Optional | The currency for pricing (default EUR - Supported: AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HRK, NOK, PLN, RUB, SEK, TRY, USD). |

```javascript
const outOfStock = skinport.getOutOfStock({ app_id: 730, currency: "EUR" });
console.log(outOfStock);
```

---

### getTransactions(options)
Retrieves a paginated list of user account transactions, including details.
- options: object (optional)

Authorization: Required

| Property | Type | Required | Description |
| :----: | :--: | :------: | :---------: |
| page | number | Optional | Pagination Page (default 1). |
| limit | number | Optional | Limit results between 1 and 100 (default 100). |
| order | string | Optional | Order results by asc or desc (default desc). |

```javascript
const salesHistory = skinport.getSalesHistory({ market_hash_name: "Glove Case,★ Karambit | Slaughter (Minimal Wear)", app_id: 730, currency: "EUR" });
console.log(salesHistory);
```