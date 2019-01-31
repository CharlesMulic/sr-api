const request = require("request");

const baseUrl = "https://api.ngs.nfl.com/league/schedule"; // ?season=2018&seasonType=REG

const seasonTypes = ["PRE", "REG", "POST"];

class NflScheduleService {
  /**
   * Fetches game information from the https://api.ngs.nfl.com/league/schedule endpoint and returns JSON.
   * With no parameters, it will return games of all types for current year's season.
   * @param { season, type } params Optional parameters where season is the desired season year, and type is one of: REG, PRE, POST
   */
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
