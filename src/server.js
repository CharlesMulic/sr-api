const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const gamesService = require("./services/NflGamesService");
const config = require("../conf.js");
const router = express.Router();
const teamsRoute = require("./routes/teams")(gamesService);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get("/teams/bye", teamsRoute.getByeWeeks);
router.get("/pointsAfterByeWeek/:teamAlias", teamsRoute.pointsAfterByeWeek);
app.use("/api", router);

const db = mongoose.connection;

db.on("error", err => {
  console.log(err);
});

db.once("open", () => {
  app.listen(config.PORT);
  console.log(`Server started on port: ${config.PORT}`);

  //   gamesService.getGameDatesForTeamAbbr("PHI").then(games => {
  //     console.log(games);
  //   });

  //   gamesService.getByeWeeksForTeamAbbr("PHI").then(weeks => {
  //     console.log(weeks);
  //   });

  //   gamesService.getTeamsAbbrs().then(teams => {
  //     console.log(teams);
  //     const byeWeeksPromises = teams.map(team => gamesService.getByeWeeksForTeamAbbr(team));
  //     Promise.all(byeWeeksPromises).then(teams => {
  //       console.log(teams.sort((a, b) => (a.byeWeeks[0] < b.byeWeeks[0] ? -1 : 1)));
  //     });
  //   });

  //   gamesService.clearData();
  //   gamesService.ingestThirdPartyData(2017, "POST");
  //   gamesService
  //     .getGames({ gameKey: 57567 })
  //     .then(games => {
  //       console.log(games);
  //     })
  //     .catch(err => console.log(err));
});

mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

module.exports = app;
