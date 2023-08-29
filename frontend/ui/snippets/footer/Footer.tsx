import { Box, Grid, Flex, Text, Link, VStack, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import discussionsIcon from 'icons/discussions.svg';
import editIcon from 'icons/edit.svg';
import discordIcon from 'icons/social/discord.svg';
import gitIcon from 'icons/social/git.svg';
import twitterIcon from 'icons/social/tweet.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import IndexingAlertIntTxs from 'ui/home/IndexingAlertIntTxs';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 3;

// const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;

const Footer = () => {

  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: editIcon,
      iconSize: '16px',
      text: 'Submit an issue',
      url: issueUrl,
    },
    {
      icon: gitIcon,
      iconSize: '18px',
      text: 'Contribute',
      url: 'https://github.com/blockscout/blockscout',
    },
    {
      icon: twitterIcon,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://www.twitter.com/blockscoutcom',
    },
    {
      icon: discordIcon,
      iconSize: '18px',
      text: 'Discord',
      url: 'https://discord.gg/blockscout',
    },
    {
      icon: discussionsIcon,
      iconSize: '20px',
      text: 'Discussions',
      url: 'https://github.com/orgs/blockscout/discussions',
    },
  ];

  const fetch = useFetch();

  const { isLoading, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>(
    [ 'footer-links' ],
    async() => fetch(config.UI.footer.links || ''),
    {
      enabled: Boolean(config.UI.footer.links),
      staleTime: Infinity,
    });

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} p={{ base: 4, lg: 9 }} borderTop="1px solid" borderColor="divider">
      <Box flexGrow="1" mb={{ base: 8, lg: 0 }}>
        <Flex>
          <ColorModeToggler/>
          { !config.UI.indexingAlert.isHidden && <IndexingAlertIntTxs ml={ 6 }/> }
          <NetworkAddToWallet ml={ 8 }/>
        </Flex>
        <Box mt={{ base: 5, lg: '44px' }}>
          <Link fontSize="xs" href="https://www.blockscout.com">blockscout.com</Link>
        </Box>
        <Text mt={ 3 } mr={{ base: 0, lg: '114px' }} maxW={{ base: 'unset', lg: '470px' }} fontSize="xs">
            Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
        </Text>
        <VStack spacing={ 1 } mt={ 6 } alignItems="start">
          { apiVersionUrl && (
            <Text fontSize="xs">
                Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { (config.UI.footer.frontendVersion || config.UI.footer.frontendCommit) && (
            <Text fontSize="xs">
              { /* Frontend: <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link> */ }
                Frontend: { [ config.UI.footer.frontendVersion, config.UI.footer.frontendCommit ].filter(Boolean).join('+') }
            </Text>
          ) }
        </VStack>
      </Box>
      <Grid
        gap={{ base: 6, lg: 12 }}
        gridTemplateColumns={ config.UI.footer.links ?
          { base: 'repeat(auto-fill, 160px)', lg: `repeat(${ (linksData?.length || MAX_LINKS_COLUMNS) + 1 }, 160px)` } :
          'auto'
        }
      >
        <Box minW="160px" w={ config.UI.footer.links ? '160px' : '100%' }>
          { config.UI.footer.links && <Text fontWeight={ 500 } mb={ 3 }>Blockscout</Text> }
          <Grid
            gap={ 1 }
            gridTemplateColumns={ config.UI.footer.links ? '160px' : { base: 'repeat(auto-fill, 160px)', lg: 'repeat(3, 160px)' } }
            gridTemplateRows={{ base: 'auto', lg: config.UI.footer.links ? 'auto' : 'repeat(2, auto)' }}
            gridAutoFlow={{ base: 'row', lg: config.UI.footer.links ? 'row' : 'column' }}
            mt={{ base: 0, lg: config.UI.footer.links ? 0 : '100px' }}
          >
            { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
          </Grid>
        </Box>
        { config.UI.footer.links && isLoading && (
          Array.from(Array(3)).map((i, index) => (
            <Box minW="160px" key={ index }>
              <Skeleton w="120px" h="20px" mb={ 6 }/>
              <VStack spacing={ 5 } alignItems="start" mb={ 2 }>
                { Array.from(Array(5)).map((i, index) => <Skeleton w="160px" h="14px" key={ index }/>) }
              </VStack>
            </Box>
          ))
        ) }
        { config.UI.footer.links && linksData && (
          linksData.slice(0, MAX_LINKS_COLUMNS).map(linkGroup => (
            <Box minW="160px" key={ linkGroup.title }>
              <Text fontWeight={ 500 } mb={ 3 }>{ linkGroup.title }</Text>
              <VStack spacing={ 1 } alignItems="start">
                { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
              </VStack>
            </Box>
          ))
        ) }
      </Grid>
    </Flex>
  );
};

export default Footer;
