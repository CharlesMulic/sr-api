const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { SiteSchema } = require("./Site");
const { TeamSchema } = require("./Team");
const { ScoreSchema } = require("./Score");

const gameSchema = new Schema({
  nameId: String,
  gameDate: String,
  gameKey: Number,
  gameTimeEastern: String,
  gameTimeLocal: String,
  gameType: String,
  homeDisplayName: String,
  homeNickname: String,
  //   homeTeam: Schema.Types.ObjectId,
  homeTeam: TeamSchema,
  homeTeamAbbr: String,
  homeTeamId: String,
  isoTime: Number,
  networkChannel: String,
  ngsGame: Boolean,
  season: Number,
  seasonType: String,
  site: SiteSchema,
  //   site: Schema.Types.ObjectId,
  visitorDisplayName: String,
  visitorNickname: String,
  visitorTeam: TeamSchema,
  //   visitorTeam: Schema.Types.ObjectId,
  visitorTeamAbbr: String,
  visitorTeamId: String,
  week: Number,
  weekName: String,
  weekNameAbbr: String,
  validated: Boolean,
  score: ScoreSchema
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
