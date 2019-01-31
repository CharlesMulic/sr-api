const express = require("express");
const router = express.Router();
const gamesService = require("../services/NflGamesService");

module.exports = app => {
  /**
   * Returns team abbreviations and bye weeks corresponding to the 17 weeks of a standard NFL season.
   * Bye weeks are weeks that a given team does not play any games.
   * Optional query parameters:
   *    - season (defaults to current year)
   *    - abbr (used to look up a single team, by default will return all teams)
   * Example request: http://localhost:3000/api/teams/bye?season=2017&abbr=DEN
   *
   * Satisfies requirements: An endpoint that accepts parameters for year/season and/or
   *                         team alias then returns corresponding teams and bye weeks.
   */
  router.get("/teams/bye", async (req, res) => {
    const teams = req.query.abbr ? [req.query.abbr] : await gamesService.getTeamsAbbrs(); // team alias parameter
    const season = req.query.season ? req.query.season : new Date().getFullYear; // year/season parameter
    const byeWeeksPromises = teams.map(team => gamesService.getByeWeeksForTeamAbbr(team, season));
    Promise.all(byeWeeksPromises)
      .then(teams => {
        res.json({
          season,
          teams: teams.sort((a, b) => (a.byeWeeks[0] < b.byeWeeks[0] ? -1 : 1))
        });
      })
      .catch(err => res.json(err));
  });

  /* An endpoint should take a team alias as a parameter and 
  return the average number of points AFTER the bye week 
  (optionally by period, so include a period parameter as well). */
  router.get("/pointsAfterByeWeek/:teamAlias", (req, res) => {
    const alias = req.params.teamAlias;
    if (!alias) {
      throw new Error("Must provide team alias"); // TODO error handling
    }
    const averagePoints = 10; // TODO
    const period = req.query.period; // TODO
    res.json({ alias, period, average_points: averagePoints });
  });

  app.use("/api", router);
};
