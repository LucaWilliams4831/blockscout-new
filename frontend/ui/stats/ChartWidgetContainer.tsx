import React, { useEffect, useMemo } from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';

import ChartWidget from '../shared/chart/ChartWidget';
import { STATS_INTERVALS } from './constants';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
}

function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

const ChartWidgetContainer = ({ id, title, description, interval, onLoadingError, units, isPlaceholderData }: Props) => {
  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const { data, isLoading, isError } = useApiQuery('stats_line', {
    pathParams: { id },
    queryParams: {
      from: startDate,
      to: endDate,
    },
    queryOptions: {
      enabled: !isPlaceholderData,
      refetchOnMount: false,
    },
  });

  const items = useMemo(() => data?.chart?.map((item) => {
    return { date: new Date(item.date), value: Number(item.value) };
  }), [ data ]);

  useEffect(() => {
    if (isError) {
      onLoadingError();
    }
  }, [ isError, onLoadingError ]);

  return (
    <ChartWidget
      isError={ isError }
      items={ items }
      title={ title }
      units={ units }
      description={ description }
      isLoading={ isLoading }
      minH="230px"
    />
  );
};

export default ChartWidgetContainer;
