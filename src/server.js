const log = require("./util/Logger");
const config = require("../conf.js")(log);

const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const gamesService = require("./services/NflGamesService")(log);
const teamsRoute = require("./routes/teams")(gamesService);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  log.info(`Received request to: ${req.url}`);
  next();
});

router.get("/teams/bye", teamsRoute.getByeWeeks);
router.get("/pointsAfterByeWeek/:teamAlias", teamsRoute.pointsAfterByeWeek);
app.use("/api", router);

const db = mongoose.connection;

db.on("error", err => {
  log.error(err);
});

db.once("open", () => {
  log.info("Successfully connected to database");
  app.listen(config.PORT);
  log.info(`Server started on port: ${config.PORT}`);

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

log.info("Attempting to connect to database...");
mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

module.exports = app;
