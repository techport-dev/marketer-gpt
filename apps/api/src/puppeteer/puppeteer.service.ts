import { Injectable } from '@nestjs/common';
import { type Browser, type Page } from 'puppeteer';
import puppeteer, { type VanillaPuppeteer } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

type GetDataParamsType = {
  selector: {
    text: string;
    type: string;
  };
};

@Injectable()
export class PuppeteerService {
  private browser: Browser;
  private page: Page;

  async timer(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async launch(options?: Parameters<VanillaPuppeteer['launch']>[0]) {
    const browser = await puppeteer.launch({
      ...options,
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ...(options?.args ?? []),
      ],
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });
    this.browser = browser;

    const page = await browser.newPage();
    this.page = page;
    page.setDefaultTimeout(40000);

    return { browser, page };
  }

  async getData({ selector }: GetDataParamsType) {
    return await this.page.evaluate((selector) => {
      if (selector.type === 'image') {
        const data = document
          .querySelector<HTMLImageElement>(selector.text)
          ?.src?.trim();
        return data;
      }

      const data = document
        .querySelector<HTMLElement>(selector.text)
        ?.innerText?.trim();
      return data;
    }, selector);
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }
}
