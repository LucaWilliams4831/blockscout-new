import { Box, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import useIsMobile from 'lib/hooks/useIsMobile';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import type { ApiCategory, ItemsCategoriesMap } from 'ui/shared/search/utils';
import { getItemCategory, searchCategories } from 'ui/shared/search/utils';

import SearchBarSuggestApp from './SearchBarSuggestApp';
import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: QueryWithPagesResult<'search'>;
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  containerId: string;
}

const SearchBarSuggest = ({ query, searchTerm, onItemClick, containerId }: Props) => {
  const isMobile = useIsMobile();

  const marketplaceApps = useMarketplaceApps(searchTerm);

  const categoriesRefs = React.useRef<Array<HTMLParagraphElement>>([]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const [ tabIndex, setTabIndex ] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container || !query.data?.items.length) {
      return;
    }
    const topLimit = container.getBoundingClientRect().y + (tabsRef.current?.clientHeight || 0) + 24;
    if (categoriesRefs.current[categoriesRefs.current.length - 1].getBoundingClientRect().y <= topLimit) {
      setTabIndex(categoriesRefs.current.length - 1);
      return;
    }
    for (let i = 0; i < categoriesRefs.current.length - 1; i++) {
      if (categoriesRefs.current[i].getBoundingClientRect().y <= topLimit && categoriesRefs.current[i + 1].getBoundingClientRect().y > topLimit) {
        setTabIndex(i);
        break;
      }
    }
  }, [ containerId, query.data?.items ]);

  React.useEffect(() => {
    const container = document.getElementById(containerId);
    const throttledHandleScroll = throttle(handleScroll, 300);
    if (container) {
      container.addEventListener('scroll', throttledHandleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', throttledHandleScroll);
      }
    };
  }, [ containerId, handleScroll ]);

  const itemsGroups = React.useMemo(() => {
    if (!query.data?.items && !marketplaceApps.displayedApps) {
      return {};
    }
    const map: Partial<ItemsCategoriesMap> = {};
    query.data?.items.forEach(item => {
      const cat = getItemCategory(item) as ApiCategory;
      if (cat) {
        if (cat in map) {
          map[cat]?.push(item);
        } else {
          map[cat] = [ item ];
        }
      }
    });
    if (marketplaceApps.displayedApps.length) {
      map.app = marketplaceApps.displayedApps;
    }
    return map;
  }, [ query.data?.items, marketplaceApps.displayedApps ]);

  const scrollToCategory = React.useCallback((index: number) => () => {
    setTabIndex(index);
    scroller.scrollTo(`cat_${ index }`, {
      duration: 250,
      smooth: true,
      offset: -(tabsRef.current?.clientHeight || 0),
      containerId: containerId,
    });
  }, [ containerId ]);

  const bgColor = useColorModeValue('white', 'gray.900');

  const content = (() => {
    if (query.isLoading || marketplaceApps.isPlaceholderData) {
      return <ContentLoader text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    if (!query.data.items || query.data.items.length === 0) {
      return <Text>No results found.</Text>;
    }

    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id]);

    return (
      <>
        { resultCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } my={ -5 } ref={ tabsRef }>
            <Tabs variant="outline" colorScheme="gray" size="sm" index={ tabIndex }>
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map((cat, index) => <Tab key={ cat.id } onClick={ scrollToCategory(index) }>{ cat.title }</Tab>) }
              </TabList>
            </Tabs>
          </Box>
        ) }
        { resultCategories.map((cat, indx) => {
          return (
            <Element name={ `cat_${ indx }` } key={ cat.id }>
              <Text
                fontSize="sm"
                fontWeight={ 600 }
                variant="secondary"
                mt={ 6 }
                mb={ 3 }
                ref={ (el: HTMLParagraphElement) => categoriesRefs.current[indx] = el }
              >
                { cat.title }
              </Text>
              { cat.id !== 'app' && itemsGroups[cat.id]?.map((item, index) =>
                <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>,
              ) }
              { cat.id === 'app' && itemsGroups[cat.id]?.map((item, index) =>
                <SearchBarSuggestApp key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>,
              ) }
            </Element>
          );
        }) }
      </>
    );
  })();

  return (
    <Box mt={ 5 } mb={ 5 }>
      { !isMobile && (
        <Box pb={ 4 } mb={ 5 } borderColor="divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      { content }
    </Box>
  );
};

export default SearchBarSuggest;
