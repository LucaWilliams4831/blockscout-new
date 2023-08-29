import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import CurrencyValue from 'ui/shared/CurrencyValue';
import LinkInternal from 'ui/shared/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';

const TxAdditionalInfoContent = ({ tx }: { tx: Transaction }) => {
  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'divider',
    paddingBottom: 4,
  };

  const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
    marginBottom: 3,
    fontSize: 'sm',
  };

  return (
    <>
      <Heading as="h4" size="sm" mb={ 6 }>Additional info </Heading>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Transaction fee</Text>
        <Flex>
          <CurrencyValue
            value={ tx.fee.value }
            currency={ config.chain.currency.symbol }
            exchangeRate={ tx.exchange_rate }
            accuracyUsd={ 2 }
          />
        </Flex>
      </Box>
      { tx.gas_used !== null && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>Gas limit & usage by transaction</Text>
          <Flex>
            <Text>{ BigNumber(tx.gas_used).toFormat() }</Text>
            <TextSeparator/>
            <Text>{ BigNumber(tx.gas_limit).toFormat() }</Text>
            <Utilization ml={ 4 } value={ Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2)) }/>
          </Flex>
        </Box>
      ) }
      { (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>Gas fees (Gwei)</Text>
          { tx.base_fee_per_gas !== null && (
            <Box>
              <Text as="span" fontWeight="500">Base: </Text>
              <Text fontWeight="600" as="span">{ getValueWithUnit(tx.base_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">Max: </Text>
              <Text fontWeight="600" as="span">{ getValueWithUnit(tx.max_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_priority_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">Max priority: </Text>
              <Text fontWeight="600" as="span">{ getValueWithUnit(tx.max_priority_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
        </Box>
      ) }
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Others</Text>
        <Box>
          <Text as="span" fontWeight="500">Txn type: </Text>
          <Text fontWeight="600" as="span">{ tx.type }</Text>
          { tx.type === 2 && <Text fontWeight="400" as="span" ml={ 1 } color="gray.500">(EIP-1559)</Text> }
        </Box>
        <Box mt={ 1 }>
          <Text as="span" fontWeight="500">Nonce: </Text>
          <Text fontWeight="600" as="span">{ tx.nonce }</Text>
        </Box>
        <Box mt={ 1 }>
          <Text as="span" fontWeight="500">Position: </Text>
          <Text fontWeight="600" as="span">{ tx.position }</Text>
        </Box>
      </Box>
      <LinkInternal fontSize="sm" href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }) }>More details</LinkInternal>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
