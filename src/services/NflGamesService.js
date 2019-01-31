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

function getWeekNumber(dateString) {
  // regular season 9/6/2018 (Thursday) - 12/30/2018 (Sunday) 17 weeks
  const parts = dateString.split("/");
  const month = Number.parseInt(parts[0]);
  const year = Number.parseInt(parts[2]);
  const day = Number.parseInt(parts[1]);

  date = new Date(Date.UTC(year, month, day));
  let weekNum = Number.parseInt(moment(date).format("w"));

  if (weekNum < 40) {
    weekNum += 52;
  }
  weekNum -= 39;
  return weekNum;
}

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

  getByeWeeksForTeamAbbr(abbr) {
    return new Promise((resolve, reject) => {
      this.getGameDatesForTeamAbbr(abbr).then(games => {
        const byeWeeks = [];
        for (let i = 1; i <= 17; i++) {
          // iterate through the 17 NFL season weeks
          if (games.filter(g => g.week === i).length == 0) {
            // find the missing weeks
            byeWeeks.push(i);
          }
        }
        resolve({
          team: games[0].abbr,
          byeWeeks
        });
      });
    });
  }

  getGameDatesForTeamAbbr(abbr) {
    const query = { $or: [{ "homeTeam.abbr": abbr }, { "visitorTeam.abbr": abbr }] };
    return new Promise((resolve, reject) => {
      // { gameDate: 1, _id: 0 }
      Game.find(query, "gameDate", (err, results) => {
        if (err) {
          reject(err);
        } else {
          //   const gameDates = results.map(gameData => gameData.gameDate);
          //   resolve(gameDates);
          resolve(
            results
              .map(r => {
                return {
                  abbr,
                  gameDate: r.gameDate,
                  week: getWeekNumber(r.gameDate)
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

  getTeams() {
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
   */
  ingestThirdPartyData(season = 2018, type = "REG") {
    return new Promise((resolve, reject) => {
      scheduleService.getNflScheduleForSeason({ season, type }).then(results => {
        for (let i = 0; i < results.response.length; i++) {
          const gameData = results.response[i];
          const game = new Game(gameData);
          game.save((err, g) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            } else {
              console.log("Game saved.");
            }
          });
        }
        resolve();
      });
    });
  }
}

const service = new NflGamesService();

module.exports = service;
