import type { Nullable } from "../common/index.js";

interface Pagination {
  page: number;
  pages: number;
  limit: number;
  order: "desc" | "asc";
}

interface TransactionItem {
  sale_id: number;
  market_hash_name: string;
  seller_country: string;
  buyer_country: string;
}

interface Transaction {
  id: number;
  type: "credit" | "withdraw" | "purchase";
  sub_type: Nullable<string>;
  status: string; // Did not use pending, completed, failed due to incomplete info in Skinport docs
  amount: number;
  fee: Nullable<number>;
  currency: string;
  items: Nullable<TransactionItem[]>;
  created_at: string;
  updated_at: string;
}

export interface TransactionsResponse {
  pagination: Pagination;
  data: Transaction[];
}