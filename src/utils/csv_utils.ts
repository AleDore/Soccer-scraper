import * as fastCsv from "fast-csv";
import { toError } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as fs from "fs";

const writeFileAsync = TE.taskify(fs.writeFile);

export const writeCsv = (path: string, data: unknown) =>
  pipe(
    TE.tryCatch(
      () => fastCsv.writeToString(data as any, { headers: true }),
      toError
    ),
    TE.chain((csv) => writeFileAsync(path, csv)),
    TE.map(() => void 0)
  );
