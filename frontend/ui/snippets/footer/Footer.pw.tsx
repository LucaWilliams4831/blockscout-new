import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';
import type { WindowProvider } from 'wagmi';

import { FOOTER_LINKS } from 'mocks/config/footerLinks';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Footer from './Footer';

const FOOTER_LINKS_URL = 'https://localhost:3000/footer-links.json';
const BACKEND_VERSION_API_URL = buildApiUrl('config_backend_version');

base.describe('with custom links, 4 cols', () => {
  const test = base.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_FOOTER_LINKS', value: FOOTER_LINKS_URL },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  test.beforeEach(async({ page, mount }) => {
    await page.route(FOOTER_LINKS_URL, (route) => {
      return route.fulfill({
        body: JSON.stringify(FOOTER_LINKS),
      });
    });

    await mount(
      <TestApp>
        <Footer/>
      </TestApp>,
    );
  });

  test('+@mobile +@dark-mode', async({ page }) => {
    await expect(page).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async({ page }) => {
      await expect(page).toHaveScreenshot();
    });
  });
});

base.describe('with custom links, 2 cols', () => {
  const test = base.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_FOOTER_LINKS', value: FOOTER_LINKS_URL },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  test('base view +@dark-mode +@mobile', async({ mount, page }) => {
    await page.route(FOOTER_LINKS_URL, (route) => {
      return route.fulfill({
        body: JSON.stringify([ FOOTER_LINKS[0] ]),
      });
    });

    await mount(
      <TestApp>
        <Footer/>
      </TestApp>,
    );

    await expect(page).toHaveScreenshot();
  });
});

base.describe('without custom links', () => {
  base('base view +@dark-mode +@mobile', async({ mount, page }) => {
    await page.evaluate(() => {
      window.ethereum = {
        isMetaMask: true,
      } as WindowProvider;
    });
    await page.route(BACKEND_VERSION_API_URL, (route) => {
      return route.fulfill({
        body: JSON.stringify({
          backend_version: 'v5.2.0-beta.+commit.1ce1a355',
        }),
      });
    });

    await mount(
      <TestApp>
        <Footer/>
      </TestApp>,
    );

    await expect(page).toHaveScreenshot();
  });

  base('with indexing alert +@dark-mode +@mobile', async({ mount, page }) => {
    await page.evaluate(() => {
      window.ethereum = {
        providers: [ { isMetaMask: true } ],
      } as WindowProvider;
    });

    const API_URL = buildApiUrl('homepage_indexing_status');

    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ finished_indexing: false, indexed_internal_transactions_ratio: 0.1 }),
    }));

    const component = await mount(
      <TestApp>
        <Footer/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});
