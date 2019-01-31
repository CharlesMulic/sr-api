const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
const service = require("../src/services/NflGamesService");
const request = require("request");

describe("NflGamesService", () => {
  describe("getGames()", () => {
    // TODO
  });

  describe("getByeWeeksForTeamAbbr()", () => {
    // TODO
  });

  describe("getGameDatesForTeamAbbr()", () => {
    // TODO
  });

  describe("getTeamsAbbrs()", () => {
    // TODO
  });

  describe("getTeams()", () => {
    // TODO
  });

  describe("clearData()", () => {
    // TODO
  });

  describe("ingestThirdPartyData()", () => {
    // TODO
  });

  describe("getNflSeasonWeekNumber()", () => {
    it("returns 1 for the first game of NFL season of 2018", () => {
      const result = service.getNflSeasonWeekNumber("9/6/2018");
      assert(result, 1);
    });

    it("returns 1 for the 09/09/2018", () => {
      const result = service.getNflSeasonWeekNumber("09/09/2018");
      assert(result, 1);
    });

    it("returns 17 for the last game of NFL season of 2018", () => {
      const result = service.getNflSeasonWeekNumber("12/30/2018");
      assert(result, 17);
    });

    it("throws an error when given an unexpected date value", () => {
      expect(() => {
        service.getNflSeasonWeekNumber("abcdefg");
      }).to.throw("Unexpected date value: abcdefg. Use the format: M/D/YYYY");
    });
  });
});
