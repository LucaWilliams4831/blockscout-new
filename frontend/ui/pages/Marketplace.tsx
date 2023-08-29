import { Box, Icon, Link, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import PlusIcon from 'icons/plus.svg';
import MarketplaceAppModal from 'ui/marketplace/MarketplaceAppModal';
import MarketplaceCategoriesMenu from 'ui/marketplace/MarketplaceCategoriesMenu';
import MarketplaceList from 'ui/marketplace/MarketplaceList';
import FilterInput from 'ui/shared/filters/FilterInput';

import useMarketplace from '../marketplace/useMarketplace';

const Marketplace = () => {
  const {
    isPlaceholderData,
    isError,
    error,
    selectedCategoryId,
    categories,
    onCategoryChange,
    filterQuery,
    onSearchInputChange,
    showAppInfo,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
  } = useMarketplace();

  if (isError) {
    throw new Error('Unable to get apps list', { cause: error });
  }

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <MarketplaceCategoriesMenu
          categories={ categories }
          selectedCategoryId={ selectedCategoryId }
          onSelect={ onCategoryChange }
          isLoading={ isPlaceholderData }
        />

        <FilterInput
          initialValue={ filterQuery }
          onChange={ onSearchInputChange }
          marginBottom={{ base: '4', lg: '6' }}
          w="100%"
          placeholder="Find app"
          isLoading={ isPlaceholderData }
        />
      </Box>

      <MarketplaceList
        apps={ displayedApps }
        onAppClick={ showAppInfo }
        favoriteApps={ favoriteApps }
        onFavoriteClick={ onFavoriteClick }
        isLoading={ isPlaceholderData }
      />

      { selectedApp && (
        <MarketplaceAppModal
          onClose={ clearSelectedAppId }
          isFavorite={ favoriteApps.includes(selectedApp.id) }
          onFavoriteClick={ onFavoriteClick }
          data={ selectedApp }
        />
      ) }

      { config.features.marketplace.isEnabled && (
        <Skeleton
          isLoaded={ !isPlaceholderData }
          marginTop={{ base: 8, sm: 16 }}
          display="inline-block"
        >
          <Link
            fontWeight="bold"
            display="inline-flex"
            alignItems="baseline"
            href={ config.features.marketplace.submitFormUrl }
            isExternal
          >
            <Icon
              as={ PlusIcon }
              w={ 3 }
              h={ 3 }
              mr={ 2 }
            />

              Submit an app
          </Link>
        </Skeleton>
      ) }
    </>
  );
};

export default Marketplace;
