const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
const service = require("../src/services/NflGamesService");
const request = require("request");

describe("NflGamesService", () => {
  it("is able to get imported", () => {
    assert(service);
  });
});
