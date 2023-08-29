import { Flex, Button, Icon, chakra, Popover, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { NetworkExplorer as TNetworkExplorer } from 'types/networks';

import config from 'configs/app';
import arrowIcon from 'icons/arrows/east-mini.svg';
import explorerIcon from 'icons/explorer.svg';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  className?: string;
  type: keyof TNetworkExplorer['paths'];
  pathParam: string;
  hideText?: boolean;
}

const NetworkExplorers = ({ className, type, pathParam, hideText }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const explorersLinks = config.UI.explorers.items
    .filter((explorer) => explorer.paths[type])
    .map((explorer) => {
      const url = new URL(explorer.paths[type] + '/' + pathParam, explorer.baseUrl);
      return <LinkExternal key={ explorer.baseUrl } href={ url.toString() }>{ explorer.title }</LinkExternal>;
    });

  if (explorersLinks.length === 0) {
    return null;
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          className={ className }
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={ onToggle }
          aria-label="Verify in other explorers"
          fontWeight={ 500 }
          px={ 2 }
          h="30px"
        >
          <Icon as={ explorerIcon } boxSize={ 5 } mr={ hideText ? 0 : 1 }/>
          { !hideText && <span>Explorers</span> }
          <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 1 }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody >
          <chakra.span color="text_secondary" fontSize="xs">Verify with other explorers</chakra.span>
          <Flex
            alignItems="center"
            flexWrap="wrap"
            columnGap={ 6 }
            rowGap={ 3 }
            mt={ 3 }
          >
            { explorersLinks }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(chakra(NetworkExplorers));
