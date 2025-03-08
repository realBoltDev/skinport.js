import type { Nullable } from "../common/index.js";

interface PriceStats {
  min: number;
  max: number;
  avg: number;
  median: number;
  volume: number;
}

interface SaleHistory {
  market_hash_name: string;
  version: Nullable<string>;
  currency: string;
  item_page: string;
  market_page: string;
  last_24_hours: PriceStats;
  last_7_days: PriceStats;
  last_30_days: PriceStats;
  last_90_days: PriceStats;
}

export type SalesHistoryResponse = SaleHistory[]