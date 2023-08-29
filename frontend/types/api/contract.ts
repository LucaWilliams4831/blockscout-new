import type { Abi } from 'abitype';

export type SmartContractMethodArgType = 'address' | 'uint256' | 'bool' | 'string' | 'bytes' | 'bytes32';
export type SmartContractMethodStateMutability = 'view' | 'nonpayable' | 'payable';

export interface SmartContract {
  deployed_bytecode: string | null;
  creation_bytecode: string | null;
  is_self_destructed: boolean;
  abi: Abi | null;
  compiler_version: string | null;
  evm_version: string | null;
  optimization_enabled: boolean | null;
  optimization_runs: number | null;
  name: string | null;
  verified_at: string | null;
  is_verified: boolean | null;
  is_verified_via_eth_bytecode_db: boolean | null;
  is_changed_bytecode: boolean | null;
  // sourcify info >>>
  is_verified_via_sourcify: boolean | null;
  is_fully_verified: boolean | null;
  is_partially_verified: boolean | null;
  sourcify_repo_url: string | null;
  // <<<<
  source_code: string | null;
  constructor_args: string | null;
  decoded_constructor_args: Array<SmartContractDecodedConstructorArg> | null;
  can_be_visualized_via_sol2uml: boolean | null;
  file_path: string;
  additional_sources: Array<{ file_path: string; source_code: string }>;
  external_libraries: Array<SmartContractExternalLibrary> | null;
  compiler_settings?: {
    evmVersion?: string;
    remappings?: Array<string>;
  };
  verified_twin_address_hash: string | null;
  minimal_proxy_address_hash: string | null;
  language: string | null;
}

export type SmartContractDecodedConstructorArg = [
  string,
  {
    internalType: SmartContractMethodArgType;
    name: string;
    type: SmartContractMethodArgType;
  }
]

export interface SmartContractExternalLibrary {
  address_hash: string;
  name: string;
}

export interface SmartContractMethodBase {
  inputs: Array<SmartContractMethodInput>;
  outputs: Array<SmartContractMethodOutput>;
  constant: boolean;
  name: string;
  stateMutability: SmartContractMethodStateMutability;
  type: 'function';
  payable: boolean;
  error?: string;
}

export interface SmartContractReadMethod extends SmartContractMethodBase {
  method_id: string;
}

export interface SmartContractWriteFallback {
  payable?: true;
  stateMutability: 'payable';
  type: 'fallback';
}

export interface SmartContractWriteReceive {
  payable?: true;
  stateMutability: 'payable';
  type: 'receive';
}

export type SmartContractWriteMethod = SmartContractMethodBase | SmartContractWriteFallback | SmartContractWriteReceive;

export type SmartContractMethod = SmartContractReadMethod | SmartContractWriteMethod;

export interface SmartContractMethodInput {
  internalType?: SmartContractMethodArgType;
  name: string;
  type: SmartContractMethodArgType;
}

export interface SmartContractMethodOutput extends SmartContractMethodInput {
  value?: string | boolean;
}

export interface SmartContractQueryMethodReadSuccess {
  is_error: false;
  result: {
    names: Array<string>;
    output: Array<{
      type: string;
      value: string;
    }>;
  };
}

export interface SmartContractQueryMethodReadError {
  is_error: true;
  result: {
    code: number;
    message: string;
    raw?: string;
  } | {
    error: string;
  };
}

export type SmartContractQueryMethodRead = SmartContractQueryMethodReadSuccess | SmartContractQueryMethodReadError;

// VERIFICATION

export type SmartContractVerificationMethod = 'flattened-code' | 'standard-input' | 'sourcify' | 'multi-part'
| 'vyper-code' | 'vyper-multi-part' | 'vyper-standard-input';

export interface SmartContractVerificationConfigRaw {
  solidity_compiler_versions: Array<string>;
  solidity_evm_versions: Array<string>;
  verification_options: Array<string>;
  vyper_compiler_versions: Array<string>;
  vyper_evm_versions: Array<string>;
  is_rust_verifier_microservice_enabled: boolean;
}

export interface SmartContractVerificationConfig extends SmartContractVerificationConfigRaw {
  verification_options: Array<SmartContractVerificationMethod>;
}

export type SmartContractVerificationResponse = {
  status: 'error';
  errors: SmartContractVerificationError;
} | {
  status: 'success';
}

export interface SmartContractVerificationError {
  contract_source_code?: Array<string>;
  files?: Array<string>;
  interfaces?: Array<string>;
  compiler_version?: Array<string>;
  constructor_arguments?: Array<string>;
  name?: Array<string>;
}
