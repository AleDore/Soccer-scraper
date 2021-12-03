import * as t from "io-ts";
export const MatchRecord = t.interface({
  day: t.number,
  homeTeam: t.string,
  awayTeam: t.string,
  golHome: t.number,
  golAway: t.number,
  winner: t.string,
});

export type MatchRecord = t.TypeOf<typeof MatchRecord>;
