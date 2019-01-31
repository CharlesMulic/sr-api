const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
const service = require("../src/services/NflScheduleService");
const request = require("request");

describe("NflScheduleService", () => {
  let responseObject, responseBody;

  beforeEach(() => {
    responseObject = {
      statusCode: 200,
      headers: {
        "content-type": "application/json"
      }
    };
    responseBody = [
      {
        gameId: 2018080251,
        gameDate: "08/02/2018",
        gameKey: 57502,
        gameTimeEastern: "20:00:00",
        gameTimeLocal: "20:00:00",
        gameType: "PRE",
        homeDisplayName: "Baltimore Ravens",
        homeNickname: "Ravens",
        homeTeam: {
          season: 2018,
          teamId: "0325",
          abbr: "BAL",
          cityState: "Baltimore",
          fullName: "Baltimore Ravens",
          nick: "Ravens",
          teamType: "TEAM",
          conferenceAbbr: "AFC",
          divisionAbbr: "ACN"
        },
        homeTeamAbbr: "BAL",
        homeTeamId: "0325",
        isoTime: 1533254400000,
        networkChannel: "NBC",
        ngsGame: true,
        season: 2018,
        seasonType: "PRE",
        site: {
          siteId: 1900,
          siteCity: "Canton",
          siteFullname: "Tom Benson Hall of Fame Stadium",
          siteState: "OH",
          roofType: "OUTDOOR"
        },
        visitorDisplayName: "Chicago Bears",
        visitorNickname: "Bears",
        visitorTeam: {
          season: 2018,
          teamId: "0810",
          abbr: "CHI",
          cityState: "Chicago",
          fullName: "Chicago Bears",
          nick: "Bears",
          teamType: "TEAM",
          conferenceAbbr: "NFC",
          divisionAbbr: "NCN"
        },
        visitorTeamAbbr: "CHI",
        visitorTeamId: "0810",
        week: 0,
        weekName: "Hall of Fame Week",
        weekNameAbbr: "HOF"
      }
    ];
    this.get = sinon.stub(request, "get");
  });
  afterEach(() => {
    request.get.restore();
  });

  it("fetches data for the current year when no args are provided", () => {
    request.get.yields(null, responseObject, JSON.stringify(responseBody));
    return service.getNflScheduleForSeason().then(result => {
      const { request, response } = result;
      expect(request).to.have.string("season=");
      expect(request).to.not.have.string("seasonType=");
      expect(response).to.be.a("array");
      expect(response).to.have.lengthOf(1);
    });
  });

  it("fetches data for the provided season year", () => {
    request.get.yields(null, responseObject, JSON.stringify(responseBody));
    return service.getNflScheduleForSeason({ season: 2010 }).then(result => {
      const { request, response } = result;
      expect(request).to.have.string("season=2010");
      expect(request).to.not.have.string("seasonType=");
      expect(response).to.be.a("array");
      expect(response).to.have.lengthOf(1);
    });
  });

  it("fetches data for the provided season type", () => {
    request.get.yields(null, responseObject, JSON.stringify(responseBody));
    return service.getNflScheduleForSeason({ type: "REG" }).then(result => {
      const { request, response } = result;
      expect(request).to.have.string("season=");
      expect(request).to.have.string("seasonType=REG");
      expect(response).to.be.a("array");
      expect(response).to.have.lengthOf(1);
    });
  });

  it("rejects when provided an unknown season type", () => {
    request.get.yields(null, responseObject, JSON.stringify(responseBody));
    return service.getNflScheduleForSeason({ type: "BLAH" }).then(result => {
      const { request, response } = result;
      expect(request).to.have.string("season=");
      expect(request).to.not.have.string("seasonType=");
      expect(response).to.be.a("array");
      expect(response).to.have.lengthOf(1);
    });
  });
});
