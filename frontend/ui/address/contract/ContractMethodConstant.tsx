import { Checkbox, Flex, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { SmartContractMethodOutput } from 'types/api/contract';

import config from 'configs/app';
import { WEI } from 'lib/consts';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

function castValueToString(value: number | string | boolean | bigint | undefined): string {
  switch (typeof value) {
    case 'string':
      return value;
    case 'boolean':
      return String(value);
    case 'undefined':
      return '';
    case 'number':
      return value.toLocaleString(undefined, { useGrouping: false });
    case 'bigint':
      return value.toString();
  }
}

interface Props {
  data: SmartContractMethodOutput;
}

const ContractMethodStatic = ({ data }: Props) => {
  const [ value, setValue ] = React.useState<string>(castValueToString(data.value));
  const [ label, setLabel ] = React.useState('WEI');

  const handleCheckboxChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const initialValue = castValueToString(data.value);

    if (event.target.checked) {
      setValue(BigNumber(initialValue).div(WEI).toFixed());
      setLabel(config.chain.currency.symbol || 'ETH');
    } else {
      setValue(BigNumber(initialValue).toFixed());
      setLabel('WEI');
    }
  }, [ data.value ]);

  const content = (() => {
    if (typeof data.value === 'string' && data.type === 'address' && data.value) {
      return (
        <Address>
          <AddressLink type="address" hash={ data.value }/>
          <CopyToClipboard text={ data.value }/>
        </Address>
      );
    }

    return <chakra.span wordBreak="break-all">({ data.type }): { String(value) }</chakra.span>;
  })();

  return (
    <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 2 }>
      { content }
      { (data.type.includes('int256') || data.type.includes('int128')) && <Checkbox onChange={ handleCheckboxChange }>{ label }</Checkbox> }
    </Flex>
  );
};

export default ContractMethodStatic;
