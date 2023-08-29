import type { HomeStats } from 'types/api/stats';
import type { TimeChartData } from 'ui/shared/chart/types';

import type { ResourcePayload } from 'lib/api/resources';

export type ChartsResources = 'homepage_chart_txs' | 'homepage_chart_market';

export type ChainIndicatorId = 'daily_txs' | 'coin_price' | 'market_cap';

export interface TChainIndicator<R extends ChartsResources> {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  icon: React.ReactNode;
  hint?: string;
  api: {
    resourceName: R;
    dataFn: (response: ResourcePayload<R>) => TimeChartData;
  };
}
