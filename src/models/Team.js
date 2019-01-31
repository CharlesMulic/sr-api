const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  season: Number,
  teamId: String,
  abbr: String,
  cityState: String,
  fullName: String,
  nick: String,
  teamType: String,
  conferenceAbbr: String,
  divisionAbbr: String
});
const Team = mongoose.model("Team", TeamSchema);

module.exports = { Team, TeamSchema };
