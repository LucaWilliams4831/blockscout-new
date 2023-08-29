import type { AddressParam } from './addressParams';
export interface AddressTag {
  address_hash: string;
  address: AddressParam;
  name: string;
  id: string;
}

export type AddressTags = Array<AddressTag>

export interface ApiKey {
  api_key: string;
  name: string;
}

export type ApiKeys = Array<ApiKey>

export interface ModelError {
  message: string;
}

export interface NotificationDirection {
  incoming: boolean;
  outcoming: boolean;
}

export interface NotificationSettings {
  'native': NotificationDirection;
  'ERC-20': NotificationDirection;
  'ERC-721': NotificationDirection;
}

export interface NotificationMethods {
  email: boolean;
}

export interface Transaction {
  fromAddressHash?: string;
  toAddressHash?: string;
  createdContractAddressHash?: string;
}

export interface TransactionTag {
  transaction_hash: string;
  name: string;
  id: string;
}

export type TransactionTags = Array<TransactionTag>

export type Transactions = Array<Transaction>

export interface UserInfo {
  name?: string;
  nickname?: string;
  email: string;
  avatar?: string;
}

export interface WatchlistAddress {
  address_hash: string;
  name: string;
  address_balance: string;
  exchange_rate: string;
  notification_settings: NotificationSettings;
  notification_methods: NotificationMethods;
  id: string;
  address: AddressParam;
  tokens_count: number;
  tokens_fiat_value: string;
  tokens_overflow: boolean;
}

export interface WatchlistAddressNew {
  addressName: string;
  notificationSettings: NotificationSettings;
}

export type WatchlistAddresses = Array<WatchlistAddress>

export interface PublicTag {
  website: string;
  tags: string; // tag_1;tag_2;tag_3 etc.
  is_owner: boolean;
  id: number;
  full_name: string;
  email: string;
  company: string;
  addresses: Array<string>;
  addresses_with_info: Array<AddressParam>;
  additional_comment: string;
}

export type PublicTagNew = Omit<PublicTag, 'id' | 'addresses_with_info'>

export type PublicTags = Array<PublicTag>;

export type CustomAbis = Array<CustomAbi>

export interface CustomAbi {
  name: string;
  id: string;
  contract_address_hash: string;
  contract_address: AddressParam;
  abi: Array<AbiItem>;
}

export interface AbiItem {
  type: 'function';
  stateMutability: 'nonpayable' | 'view';
  payable: boolean;
  outputs: Array<AbiInputOutput>;
  name: string;
  inputs: Array<AbiInputOutput>;
  constant: boolean;
}

interface AbiInputOutput {
  type: 'uint256' | 'address';
  name: string;
}

export type WatchlistErrors = {
  address_hash?: Array<string>;
  name?: Array<string>;
  watchlist_id?: Array<string>;
}

export type CustomAbiErrors = {
  address_hash?: Array<string>;
  name?: Array<string>;
  abi?: Array<string>;
  identity_id?: Array<string>;
}

export type ApiKeyErrors = {
  name?: Array<string>;
  identity_id?: Array<string>;
};

export type AddressTagErrors = {
  address_hash: Array<string>;
  name: Array<string>;
  identity_id?: Array<string>;
}

export type TransactionTagErrors = {
  tx_hash: Array<string>;
  name: Array<string>;
  identity_id?: Array<string>;
}

export type PublicTagErrors = {
  additional_comment: Array<string>;
  addresses: Array<string>;
  email: Array<string>;
  full_name: Array<string>;
  tags: Array<string>;
}

export interface VerifiedAddress {
  userId: string;
  chainId: string;
  contractAddress: string;
  verifiedDate: string;
  metadata: {
    tokenName: string | null;
    tokenSymbol: string | null;
  };
}

export interface VerifiedAddressResponse {
  verifiedAddresses: Array<VerifiedAddress>;
}

export interface TokenInfoApplicationConfig {
  projectSectors: Array<string>;
}

export interface TokenInfoApplication {
  adminComments?: string;
  coinGeckoTicker?: string;
  coinMarketCapTicker?: string;
  comment?: string;
  defiLlamaTicker?: string;
  discord?: string;
  docs?: string;
  facebook?: string;
  github?: string;
  iconUrl: string;
  id: string;
  linkedin?: string;
  medium?: string;
  openSea?: string;
  projectDescription?: string;
  projectEmail: string;
  projectName?: string;
  projectSector?: string;
  projectWebsite: string;
  reddit?: string;
  requesterEmail: string;
  requesterName: string;
  slack?: string;
  status: 'STATUS_UNKNOWN' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'UPDATE_REQUIRED';
  support?: string;
  telegram?: string;
  tokenAddress: string;
  twitter?: string;
  updatedAt: string;
}

export interface TokenInfoApplications {
  submissions: Array<TokenInfoApplication>;
}
