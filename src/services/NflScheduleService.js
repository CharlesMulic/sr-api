const request = require("request");

const baseUrl = "https://api.ngs.nfl.com/league/schedule"; // ?season=2018&seasonType=REG

const seasonTypes = ["PRE", "REG", "POST"];

/*
Use the NFL schedule feed as your source: https://api.ngs.nfl.com/league/schedule?season=2018&seasonType=REG

Ingest data from the feed into a database of your choice (allow for ingestion of different seasons and season types)

Create TWO endpoints:

- An endpoint that accepts parameters for year/season and/or team alias then returns 
corresponding teams and bye weeks. A bye week for the NFL is a week that team does NOT play.

- An endpoint should take a team alias as a parameter and return the average number of points 
AFTER the bye week (optionally by period, so include a period parameter as well).
*/
class NflScheduleService {
  getNflScheduleForSeason(params) {
    params = params ? params : {};
    if (!params.season) {
      params.season = new Date().getFullYear();
    }

    let endpoint = `${baseUrl}?season=${params.season}`;
    if (seasonTypes.includes(params.type)) {
      endpoint += `&seasonType=${params.type}`;
    } else if (params.type) {
      console.log(`Ignoring unknown season type: ${params.type}`);
    }

    return new Promise((resolve, reject) => {
      console.log(`Making request to: ${endpoint}`);
      request.get(endpoint, function(err, res, body) {
        if (!err) {
          resolve({
            request: endpoint,
            response: JSON.parse(body)
          });
        } else {
          reject(err);
        }
      });
    });
  }
}

const service = new NflScheduleService();

module.exports = service;
