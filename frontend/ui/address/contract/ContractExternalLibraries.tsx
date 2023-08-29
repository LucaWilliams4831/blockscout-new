import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { SmartContractExternalLibrary } from 'types/api/contract';

import arrowIcon from 'icons/arrows/east-mini.svg';
import iconWarning from 'icons/status/warning.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  className?: string;
  data: Array<SmartContractExternalLibrary>;
}

const Item = (data: SmartContractExternalLibrary) => {
  return (
    <Flex flexDir="column" py={ 2 } w="100%" rowGap={ 1 }>
      <Box>{ data.name }</Box>
      <Address>
        <AddressIcon address={{ hash: data.address_hash, is_contract: true, implementation_name: null }}/>
        <AddressLink hash={ data.address_hash } type="address" ml={ 2 } fontWeight={ 500 } fontSize="sm" target="_blank" query={{ tab: 'contract' }}/>
        <CopyToClipboard text={ data.address_hash }/>
      </Address>
    </Flex>
  );
};

const ContractExternalLibraries = ({ className, data }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return null;
  }

  const button = (
    <Button
      className={ className }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onToggle }
      fontWeight={ 600 }
      px={ 2 }
      aria-label="View external libraries"
    >
      <span>{ data.length } { data.length > 1 ? 'Libraries' : 'Library' } </span>
      <Icon as={ iconWarning } boxSize={ 5 } color="orange.400" ml="2px"/>
      <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 2 }/>
    </Button>
  );

  const content = (
    <>
      <Heading size="sm">External libraries ({ data.length })</Heading>
      <Alert status="warning" mt={ 4 }>
        The linked library{ apos }s source code may not be the real one.
        Check the source code at the library address (if any) if you want to be sure in case if there is any library linked
      </Alert>
      <VStack
        divider={ <StackDivider borderColor="divider"/> }
        spacing={ 2 }
        mt={ 4 }
      >
        { data.map((item) => <Item key={ item.address_hash } { ...item }/>) }
      </VStack>
    </>
  );

  if (isMobile) {
    return (
      <>
        { button }
        <Modal isOpen={ isOpen } onClose={ onClose } size="full">
          <ModalContent paddingTop={ 4 }>
            <ModalCloseButton/>
            { content }
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        { button }
      </PopoverTrigger>
      <PopoverContent w="400px">
        <PopoverBody >
          { content }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ContractExternalLibraries;
