/*
Use the NFL schedule feed as your source: https://api.ngs.nfl.com/league/schedule?season=2018&seasonType=REG

Ingest data from the feed into a database of your choice (allow for ingestion of different seasons and season types)

Create TWO endpoints:

- An endpoint that accepts parameters for year/season and/or team alias then returns 
corresponding teams and bye weeks. A bye week for the NFL is a week that team does NOT play.

- An endpoint should take a team alias as a parameter and return the average number of points 
AFTER the bye week (optionally by period, so include a period parameter as well).
*/

const scheduleService = require("./NflScheduleService");
const Game = require("../models/Game");
const mongoose = require("mongoose");
const moment = require("moment");
moment.locale("en-nfl", {
  parentLocale: "en",
  week: {
    dow: 4 // custom locale to change start of week to Thursdays to correspond to NFL schedule
  }
});

class NflGamesService {
  getGames(query = {}) {
    return new Promise((resolve, reject) => {
      Game.find(query, (err, gameData) => {
        if (err) {
          reject(err);
        } else {
          resolve(gameData);
        }
      });
    });
  }

  getByeWeeksForTeamAbbr(abbr, season) {
    return new Promise((resolve, reject) => {
      this.getGameDatesForTeamAbbr(abbr, season).then(games => {
        if (games.length === 0) {
          resolve({
            team: abbr,
            byeWeeks: [0]
          });
        } else {
          const byeWeeks = [];
          for (let i = 1; i <= 17; i++) {
            // iterate through the 17 NFL regular season weeks
            const game = games.find(g => g.week === i);
            if (!game) {
              byeWeeks.push(i); // find the missing weeks
            }
          }
          resolve({
            team: abbr,
            byeWeeks: byeWeeks
            // TODO could include actual date ranges for the bye week
          });
        }
      });
    });
  }

  getGameDatesForTeamAbbr(abbr, season) {
    const query = {
      // regex on season for string match on year, and abbr matching home or away team to get all the team's games
      $and: [{ gameDate: { $regex: season } }, { $or: [{ "homeTeam.abbr": abbr }, { "visitorTeam.abbr": abbr }] }]
    };
    return new Promise((resolve, reject) => {
      Game.find(query, "gameDate", (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
          // } else if (!results) {
          //   reject(`No results found for: ${abbr}`);
        } else {
          resolve(
            results
              .map(r => {
                return {
                  abbr,
                  gameDate: r.gameDate,
                  week: this.getNflSeasonWeekNumber(r.gameDate)
                };
              })
              .sort((a, b) => {
                return a.week < b.week ? -1 : 1;
              })
          );
        }
      });
    });
  }

  getTeamsAbbrs() {
    return new Promise((resolve, reject) => {
      Game.find().distinct("homeTeam.abbr", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  getTeams() {
    return new Promise((resolve, reject) => {
      Game.find({}, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  clearData() {
    mongoose.connection.collections["games"].drop(err => {
      console.log("Collection dropped: games");
      if (err) {
        console.log(err);
      }
    });
  }

  /**
   * This will copy the game data retrieved from a third party to the application's data store
   * // TODO this will currently cause duplicates if called multiple times
   */
  ingestThirdPartyData(season = new Date().getFullYear(), type = "REG") {
    return new Promise((resolve, reject) => {
      scheduleService.getNflScheduleForSeason({ season, type }).then(results => {
        for (let i = 0; i < results.response.length; i++) {
          const gameData = results.response[i];
          const game = new Game(gameData);
          game.save((err, g) => {
            if (err) {
              return reject(err);
            } else {
            }
          });
        }
        console.log(`${results.response.length} Games saved.`);
        resolve();
      });
    });
  }

  /**
   * Returns the week of the NFL season between 1 and 17.
   * @param dateString A date in the format of MM/DD/YYYY
   */
  getNflSeasonWeekNumber(dateString) {
    // regular season 9/6/2018 (Thursday) - 12/30/2018 (Sunday) 17 weeks
    const date = moment(new Date(dateString));
    if (!moment(date).isValid()) {
      throw new Error(`Unexpected date value: ${dateString}. Use the format: M/D/YYYY`);
    }
    let weekNum = Number.parseInt(moment(date).format("w"));
    weekNum -= 35; // offset week number to get weeks 1-17 corresponding to NFL season

    return weekNum;
  }
}

const service = new NflGamesService();

module.exports = service;
