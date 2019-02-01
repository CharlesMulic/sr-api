const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;

const mockGamesService = {
  getTeamsAbbrs: () => {
    return Promise.resolve(["WAS", "CAR"]);
  },
  getByeWeeksForTeamAbbr: (abbr, season) => {
    if (abbr == "FAIL") {
      Promise.reject(new Error("failure"));
    }
    return Promise.resolve({
      team: abbr,
      byeWeeks: [5]
    });
  }
};

const teams = require("../../src/routes/teams")(mockGamesService);

describe("teams", () => {
  describe("getByeWeeks()", () => {
    let result, req, res;

    beforeEach(() => {
      result = undefined;
      req = { query: {} };
      res = {
        json: obj => {
          result = obj;
        },
        status: code => {
          console.log(code);
        }
      };
    });

    it("uses the previous year as season if no season provided in query parameters", () => {
      return teams.getByeWeeks(req, res).then(() => {
        expect(result);
        expect(result).is.a("object");
        const previousYear = new Date().getFullYear() - 1;
        expect(result.season).to.equal(previousYear);
      });
    });

    it("uses the provided year as season if present in query parameters", () => {
      req.query.season = 2017;
      return teams.getByeWeeks(req, res).then(() => {
        expect(result.season).to.equal(2017);
      });
    });

    it("gets bye weeks for all teams if no abbr provided in query parameters", () => {
      return teams.getByeWeeks(req, res).then(() => {
        expect(result.teams).is.a("array");
        expect(result.teams.length).to.equal(2);
      });
    });

    it("gets bye weeks for single team when abbr is provided in query parameters", () => {
      req.query.abbr = "CAR";
      return teams.getByeWeeks(req, res).then(() => {
        expect(result.teams).is.a("array");
        expect(result.teams.length).to.equal(1);
        expect(result.teams[0].team).to.equal("CAR");
      });
    });

    // TODO how to test the catch case 404 json?
    // it("something when unknown abbr", () => {
    //   req.query.abbr = "FAIL";
    //   return teams.getByeWeeks(req, res).then(() => {
    //   });
    // });
  });
});
