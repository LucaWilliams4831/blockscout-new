import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import { default as Thead } from 'ui/shared/TheadSticky';

import WithdrawalsTableItem from './WithdrawalsTableItem';

 type Props = {
   top: number;
   isLoading?: boolean;
 } & ({
   items: Array<WithdrawalsItem>;
   view: 'list';
 } | {
   items: Array<AddressWithdrawalsItem>;
   view: 'address';
 } | {
   items: Array<BlockWithdrawalsItem>;
   view: 'block';
 });

const WithdrawalsTable = ({ items, isLoading, top, view = 'list' }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th minW="140px">Index</Th>
          <Th minW="200px">Validator index</Th>
          { view !== 'block' && <Th w="25%">Block</Th> }
          { view !== 'address' && <Th w="25%">To</Th> }
          { view !== 'block' && <Th w="25%">Age</Th> }
          <Th w="25%">{ `Value ${ config.features.beaconChain.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { view === 'list' && (items as Array<WithdrawalsItem>).map((item, index) => (
          <WithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="list" isLoading={ isLoading }/>
        )) }
        { view === 'address' && (items as Array<AddressWithdrawalsItem>).map((item, index) => (
          <WithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="address" isLoading={ isLoading }/>
        )) }
        { view === 'block' && (items as Array<BlockWithdrawalsItem>).map((item, index) => (
          <WithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="block" isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default WithdrawalsTable;
