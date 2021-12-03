import { MatchRecord } from "./types";

export const extractTeams = (matches: MatchRecord[]) => {
  const teams = new Set<string>();
  matches.forEach((match) => {
    teams.add(match.awayTeam);
    teams.add(match.homeTeam);
  });
  return Array.from(teams);
};

export const analyzeDraws = (teams: string[], matches: MatchRecord[]) => {
  const sortedMatches = matches.sort((a, b) => a.day - b.day);
  const res = teams.map((team) => {
    const draws = sortedMatches
      .filter((el) => el.awayTeam === team || el.homeTeam === team)
      .map((el) =>
        el.golHome === el.golAway ? "X" : el.golHome > el.golAway ? "1" : "2"
      )
      .join("")
      .split("X")
      .map((s) => s.length);
    return { team, draws };
  });
  return res;
};
