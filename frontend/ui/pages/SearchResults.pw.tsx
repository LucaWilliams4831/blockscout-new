import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import * as searchMock from 'mocks/search/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import SearchResults from './SearchResults';

test('search by name +@mobile +@dark-mode', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { q: 'o' },
    },
  };
  await page.route(buildApiUrl('search') + '?q=o', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.token1,
        searchMock.token2,
        searchMock.contract1,
        searchMock.label1,
      ],
    }),
  }));
  await page.route(searchMock.token1.icon_url as string, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <SearchResults/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by address hash +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.address1.address },
    },
  };
  await page.route(buildApiUrl('search') + `?q=${ searchMock.address1.address }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.address1,
      ],
    }),
  }));

  const component = await mount(
    <TestApp>
      <SearchResults/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by block number +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { q: String(searchMock.block1.block_number) },
    },
  };
  await page.route(buildApiUrl('search') + `?q=${ searchMock.block1.block_number }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.block1,
      ],
    }),
  }));

  const component = await mount(
    <TestApp>
      <SearchResults/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by block hash +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.block1.block_hash },
    },
  };
  await page.route(buildApiUrl('search') + `?q=${ searchMock.block1.block_hash }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.block1,
      ],
    }),
  }));

  const component = await mount(
    <TestApp>
      <SearchResults/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by tx hash +@mobile', async({ mount, page }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.tx1.tx_hash },
    },
  };
  await page.route(buildApiUrl('search') + `?q=${ searchMock.tx1.tx_hash }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.tx1,
      ],
    }),
  }));

  const component = await mount(
    <TestApp>
      <SearchResults/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.locator('main')).toHaveScreenshot();
});

test.describe('with apps', () => {
  const MARKETPLACE_CONFIG_URL = 'https://marketplace-config.url';
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('default view +@mobile', async({ mount, page }) => {
    const hooksConfig = {
      router: {
        query: { q: 'o' },
      },
    };
    const API_URL = buildApiUrl('search') + '?q=o';
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({
        items: [
          searchMock.token1,
        ],
        next_page_params: { foo: 'bar' },
      }),
    }));

    await page.route(MARKETPLACE_CONFIG_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(appsMock),
    }));

    await page.route(appsMock[0].logo, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });
    await page.route(appsMock[1].logo as string, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <SearchResults/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component.locator('main')).toHaveScreenshot();
  });
});
