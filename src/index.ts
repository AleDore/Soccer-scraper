import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as AR from "fp-ts/lib/Array";

import { writeCsv } from "./utils/csv_utils";
import { launchBrowser } from "./utils/puppeteer";
import { scrape } from "./Scraper";
import { analyzeDraws, extractTeams } from "./utils/analytics";

(async () => {
  try {
    const urls = [
      "https://www.statistichesulcalcio.com/campionati/Italia/Serie-A_71/anno_129.html",
      "https://www.statistichesulcalcio.com/campionati/Italia/Serie-B_72/anno_129.html",
      "https://www.statistichesulcalcio.com/campionati/Spagna/Liga_128/anno_129.html",
      "https://www.statistichesulcalcio.com/campionati/Inghilterra/Premier-League_55/anno_129.html",
    ];
    await pipe(
      launchBrowser(),
      TE.chain((browser) =>
        AR.sequence(TE.ApplicativePar)(
          urls.map((championshipUrl) =>
            pipe(
              scrape(browser, `${championshipUrl}`),
              TE.map((championshipPayload) => ({
                championship: championshipUrl.substring(
                  championshipUrl.indexOf("/", 50) + 1,
                  championshipUrl.lastIndexOf("/")
                ),
                matches: AR.flatten(championshipPayload).sort(
                  (a, b) => a.day - b.day
                ),
              }))
            )
          )
        )
      ),
      TE.map((championShips) =>
        championShips.map((championship) => ({
          ...championship,
          draws: analyzeDraws(
            extractTeams(championship.matches),
            championship.matches
          ),
        }))
      ),
      TE.chain((championShips) =>
        AR.sequence(TE.ApplicativeSeq)(
          championShips.map((_) => {
            console.log("Championship draws analysis");
            console.log(JSON.stringify(_.draws));
            console.log("Championship payload " + _.championship);
            console.log(JSON.stringify(_.matches));
            return writeCsv(
              `/Users/alessio/Desktop/out_${_.championship}.csv`,
              _.matches
            );
          })
        )
      ),
      TE.mapLeft((e) => {
        throw e;
      })
    )();
  } catch (error) {
    console.log("Could not create a browser instance => : ", error);
  }
})();
