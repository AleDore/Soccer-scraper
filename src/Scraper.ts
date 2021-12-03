import { Browser, Page } from "puppeteer";
import { MatchRecord } from "./utils/types";
import {
  evaluateElement,
  evaluatePage,
  goToUrl,
  openNewPage,
  selectElementsWithText,
  setViewPort,
} from "./utils/puppeteer";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as AR from "fp-ts/lib/Array";

export const scrape = (browser: Browser, url: string) => {
  console.log(`scraping url ${url}`);
  return pipe(
    loadPage(browser, url),
    TE.chain((page) =>
      pipe(
        selectElementsWithText(page, "th", "Risultati", "/../../../tbody"),
        TE.chain((elements) => {
          return AR.sequence(TE.ApplicativePar)(
            elements.map((el, idx) =>
              pipe(
                evaluateElement(
                  el,
                  (tables) => {
                    const results = [];
                    const matches = tables.querySelectorAll("tr");
                    matches.forEach((match) => {
                      const matchRow = match.querySelectorAll("td");

                      const homeTeam = matchRow[1]?.innerHTML;
                      const awayTeam = matchRow[2]?.innerHTML;
                      const golHomeAway = matchRow[3]?.innerHTML;
                      const golHome = Number.parseInt(
                        golHomeAway.substr(0, golHomeAway.indexOf("-"))
                      );
                      const golAway = Number.parseInt(
                        golHomeAway.substr(
                          golHomeAway.indexOf("-") + 1,
                          golHomeAway.length
                        )
                      );

                      results.push({
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
                  el
                ),
                TE.map((_) => _.map((el) => ({ day: idx + 1, ...el })))
              )
            )
          );
        })
      )
    )
  );
};

const x = (page: Page) =>
  evaluatePage(page, () => {
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
        day: 1,
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
  });

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
