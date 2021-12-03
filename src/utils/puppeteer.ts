import { Browser, EvaluateFn, Page, SerializableOrJSHandle } from "puppeteer";
import * as TE from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import * as puppeteer from "puppeteer";

export const launchBrowser = () =>
  TE.tryCatch(
    () =>
      puppeteer.launch({
        headless: true,
        args: ["--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      }),
    toError
  );

export const openNewPage = (browser: Browser) =>
  TE.tryCatch(() => browser.newPage(), toError);

export const setViewPort = (page: Page) =>
  TE.tryCatch(() => page.setViewport({ width: 1200, height: 800 }), toError);

export const goToUrl = (page: Page, url: string) =>
  TE.tryCatch(
    () => page.goto(url, { waitUntil: "networkidle0", timeout: 0 }),
    toError
  );

export const evaluatePage = <T>(
  page: Page,
  fn: (...args: SerializableOrJSHandle[]) => T,
  ...args: SerializableOrJSHandle[]
) => TE.tryCatch(() => page.evaluate(fn, ...args), toError);

export const removeModal = (page: Page, selectorToRemove: string) =>
  evaluatePage(
    page,
    (sel: string) => {
      var elements = document.querySelectorAll(sel);
      for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    },
    selectorToRemove
  );
