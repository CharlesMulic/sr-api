const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
const service = require("../src/services/NflScheduleService");

describe("NflScheduleService", () => {
  it("is able to get imported", () => {
    assert(service);
  });
});
