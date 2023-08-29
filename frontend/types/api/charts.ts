export interface ChartTransactionItem {
  date: string;
  tx_count: number;
}

export interface ChartMarketItem {
  date: string;
  closing_price: string;
}

export interface ChartTransactionResponse {
  chart_data: Array<ChartTransactionItem>;
}

export interface ChartMarketResponse {
  available_supply: string;
  chart_data: Array<ChartMarketItem>;
}
