import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as AR from "fp-ts/lib/Array";

import { writeCsv } from "./utils/csv_utils";
import { launchBrowser } from "./utils/puppeteer";
import { scrape } from "./Scraper";

(async () => {
  try {
    const days = Array.from(Array(16).keys()).filter((val) => val > 0);
    const urls = [
      "https://www.gazzetta.it/calcio/serie-a/calendario-risultati/?giornata=",
      "https://www.gazzetta.it/calcio/serie-b/calendario-risultati/?fase=regularSeason&giornata=",
    ];
    await pipe(
      launchBrowser(),
      TE.chain((browser) =>
        AR.sequence(TE.ApplicativePar)(
          urls.map((championshipUrl) =>
            pipe(
              AR.sequence(TE.ApplicativePar)(
                days.map((day) =>
                  scrape(browser, `${championshipUrl}${day}`, day)
                )
              ),
              TE.map((championshipPayload) => ({
                championship: championshipUrl.substr(
                  championshipUrl.indexOf("serie"),
                  7
                ),
                payload: AR.flatten(championshipPayload).sort(
                  (a, b) => a.day - b.day
                ),
              }))
            )
          )
        )
      ),
      TE.chain((championShips) =>
        AR.sequence(TE.ApplicativeSeq)(
          championShips.map((_) => {
            console.log("Championship payload " + _.championship);
            console.log(JSON.stringify(_.payload));
            return writeCsv(
              `/Users/alessio/Desktop/out_${_.championship}.csv`,
              _.payload
            );
          })
        )
      )
    )();
  } catch (error) {
    console.log("Could not create a browser instance => : ", error);
  }
})();
