import { Alert, Box, Button, Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type {
  AddressVerificationResponseError,
  AddressCheckResponseSuccess,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
} from '../types';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import LinkInternal from 'ui/shared/LinkInternal';
import AdminSupportText from 'ui/shared/texts/AdminSupportText';

import AddressVerificationFieldAddress from '../fields/AddressVerificationFieldAddress';
type Fields = RootFields & AddressVerificationFormFirstStepFields;

interface Props {
  defaultAddress?: string;
  onContinue: (data: AddressVerificationFormFirstStepFields & AddressCheckStatusSuccess) => void;
}

const AddressVerificationStepAddress = ({ defaultAddress, onContinue }: Props) => {
  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      address: defaultAddress,
    },
  });
  const { handleSubmit, formState, control, setError, clearErrors, watch } = formApi;
  const apiFetch = useApiFetch();

  const address = watch('address');

  React.useEffect(() => {
    clearErrors('root');
  }, [ address, clearErrors ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const body = {
        contractAddress: data.address,
      };
      const response = await apiFetch<'address_verification', AddressCheckResponseSuccess, AddressVerificationResponseError>('address_verification', {
        fetchParams: { method: 'POST', body },
        pathParams: { chainId: config.chain.id, type: ':prepare' },
      });

      if (response.status !== 'SUCCESS') {
        const type = typeof response.status === 'number' ? 'UNKNOWN_ERROR' : response.status;
        const message = ('payload' in response ? response.payload?.message : undefined) || 'Oops! Something went wrong';
        return setError('root', { type, message });
      }

      onContinue({ ...response.result, address: data.address });
    } catch (_error) {
      const error = _error as ResourceError<AddressVerificationResponseError>;
      setError('root', { type: 'manual', message: error.payload?.message || 'Oops! Something went wrong' });
    }

  }, [ apiFetch, onContinue, setError ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const rootError = (() => {
    switch (formState.errors.root?.type) {
      case 'INVALID_ADDRESS_ERROR': {
        return <span>Specified address either does not exist or is EOA.</span>;
      }
      case 'IS_OWNER_ERROR': {
        return <span>Ownership of this contract address is already verified by this account.</span>;
      }
      case 'OWNERSHIP_VERIFIED_ERROR': {
        return <span>Ownership of this contract address is already verified by another account.</span>;
      }
      case 'SOURCE_CODE_NOT_VERIFIED_ERROR': {
        const href = route({ pathname: '/address/[hash]/contract-verification', query: { hash: address } });
        return (
          <Box>
            <span>The contract source code you entered is not yet verified. Please follow these steps to </span>
            <LinkInternal href={ href }>verify the contract</LinkInternal>
            <span>.</span>
          </Box>
        );
      }
      case undefined: {
        return null;
      }
      default: {
        return formState.errors.root?.message;
      }
    }
  })();

  return (
    <form noValidate onSubmit={ onSubmit }>
      <Box>Enter the contract address you are verifying ownership for.</Box>
      { rootError && <Alert status="warning" mt={ 3 }>{ rootError }</Alert> }
      <AddressVerificationFieldAddress formState={ formState } control={ control }/>
      <Flex alignItems={{ base: 'flex-start', lg: 'center' }} mt={ 8 } columnGap={ 5 } rowGap={ 2 } flexDir={{ base: 'column', lg: 'row' }}>
        <Button size="lg" type="submit" isDisabled={ formState.isSubmitting } flexShrink={ 0 }>
            Continue
        </Button>
        <AdminSupportText/>
      </Flex>
    </form>
  );
};

export default React.memo(AddressVerificationStepAddress);
