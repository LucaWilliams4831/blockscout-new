import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
import type { NextApiRequest, NextApiResponse } from 'next';

import config from 'configs/app';
import fetchFactory from 'lib/api/nodeFetch';

const handler = async(nextReq: NextApiRequest, nextRes: NextApiResponse) => {
  if (!nextReq.url) {
    nextRes.status(500).json({ error: 'no url provided' });
    return;
  }

  const url = new URL(
    nextReq.url.replace(/^\/node-api\/proxy/, ''),
    nextReq.headers['x-endpoint']?.toString() || config.api.endpoint,
  );
  const apiRes = await fetchFactory(nextReq)(
    url.toString(),
    _pickBy(_pick(nextReq, [ 'body', 'method' ]), Boolean),
  );

  // proxy some headers from API
  nextRes.setHeader('x-request-id', apiRes.headers.get('x-request-id') || '');
  nextRes.setHeader('set-cookie', apiRes.headers.get('set-cookie') || '');

  nextRes.status(apiRes.status).send(apiRes.body);
};

export default handler;
