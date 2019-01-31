const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const gamesService = require("./services/NflGamesService");
const config = require("../conf.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

/* An endpoint that accepts parameters for year/season and/or 
team alias then returns corresponding teams and bye weeks. 
A bye week for the NFL is a week that team does NOT play. */
router.get("/test", (req, res) => {
  res.json({ message: "hooray! welcome to our api!" });
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

  gamesService.getTeams().then(teams => {
    console.log(teams);
    const byeWeeksPromises = teams.map(team => gamesService.getByeWeeksForTeamAbbr(team));
    Promise.all(byeWeeksPromises).then(teams => {
      console.log(teams.sort((a, b) => (a.byeWeeks[0] < b.byeWeeks[0] ? -1 : 1)));
    });
  });

  //   gamesService.clearData();
  //   gamesService.ingestThirdPartyData();
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
