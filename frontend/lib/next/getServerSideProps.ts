import type { GetServerSideProps } from 'next';

import config from 'configs/app';

export type Props = {
  cookies: string;
  referrer: string;
  id: string;
  height_or_hash: string;
  hash: string;
  q: string;
}

export const base: GetServerSideProps<Props> = async({ req, query }) => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      id: query.id?.toString() || '',
      hash: query.hash?.toString() || '',
      height_or_hash: query.height_or_hash?.toString() || '',
      q: query.q?.toString() || '',
    },
  };
};

export const account: GetServerSideProps<Props> = async(context) => {
  if (!config.features.account.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const verifiedAddresses: GetServerSideProps<Props> = async(context) => {
  if (!config.features.addressVerification.isEnabled) {
    return {
      notFound: true,
    };
  }

  return account(context);
};

export const beaconChain: GetServerSideProps<Props> = async(context) => {
  if (!config.features.beaconChain.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const L2: GetServerSideProps<Props> = async(context) => {
  if (!config.features.rollup.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const marketplace: GetServerSideProps<Props> = async(context) => {
  if (!config.features.marketplace.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const apiDocs: GetServerSideProps<Props> = async(context) => {
  if (!config.features.restApiDocs.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const csvExport: GetServerSideProps<Props> = async(context) => {
  if (!config.features.csvExport.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const stats: GetServerSideProps<Props> = async(context) => {
  if (!config.features.stats.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};
