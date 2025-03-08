import type { Nullable } from "../common/index.js";

interface OutOfStockItem {
  market_hash_name: string;
  version: Nullable<string>;
  currency: string;
  suggested_price: number;
  avg_sale_price: number;
  sales_last_90d: number;
}

export type OutOfStockResponse = OutOfStockItem[]