import { Browser, Page } from "puppeteer";
import { MatchRecord } from "./utils/types";
import {
  evaluatePage,
  goToUrl,
  openNewPage,
  removeModal,
  setViewPort,
} from "./utils/puppeteer";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

export const scrape = (browser: Browser, url: string, day?: number) => {
  console.log(`scraping url ${url} for day ${day}`);
  return pipe(
    loadPage(browser, url),
    TE.chain((page) =>
      pipe(
        removeModal(page, "#_cpmt-iframe"),
        TE.chain(() =>
          evaluatePage(
            page,
            (dayNum: number) => {
              const results: MatchRecord[] = [];
              const matches = document.querySelectorAll("div.sc-hMqMXs");

              matches.forEach((match) => {
                const homeAwayTeam = match.querySelectorAll("div.sc-VigVT");

                const homeTeam = homeAwayTeam[0]?.innerHTML;
                const awayTeam = homeAwayTeam[1]?.innerHTML;
                const golHomeAway = match.querySelectorAll("div.sc-cSHVUG");
                const golHome = Number.parseInt(golHomeAway[0]?.innerHTML);
                const golAway = Number.parseInt(golHomeAway[1]?.innerHTML);

                results.push({
                  day: dayNum,
                  homeTeam,
                  awayTeam,
                  golHome,
                  golAway,
                  winner:
                    golHome === golAway
                      ? "DRAW"
                      : golHome > golAway
                      ? homeTeam
                      : awayTeam,
                });
              });
              return results;
            },
            day
          )
        )
      )
    )
  );
};

const loadPage = (browser: Browser, url: string) =>
  pipe(
    openNewPage(browser),
    TE.chain((page) =>
      pipe(
        setViewPort(page),
        TE.chain(() => goToUrl(page, url)),
        TE.map(() => page)
      )
    )
  );
