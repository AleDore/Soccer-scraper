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
import { errorsToError } from "./utils/conversions";

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
                      let golHome;
                      let golAway;
                      // head to head
                      if (matchRow[4]?.innerHTML === " ") {
                        golHome = 3;
                        golAway = 0;
                      } else {
                        golHome = Number.parseInt(
                          golHomeAway.substr(0, golHomeAway.indexOf("-"))
                        );
                        golAway = Number.parseInt(
                          golHomeAway.substr(
                            golHomeAway.indexOf("-") + 1,
                            golHomeAway.length
                          )
                        );
                      }
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
                TE.map((_) =>
                  _.map((el) => MatchRecord.decode({ day: idx + 1, ...el }))
                ),
                TE.chain((matchRecords) =>
                  AR.sequence(TE.ApplicativePar)(
                    matchRecords.map((_) =>
                      pipe(TE.fromEither(_), TE.mapLeft(errorsToError))
                    )
                  )
                )
              )
            )
          );
        })
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
