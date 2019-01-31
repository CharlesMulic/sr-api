const mongoose = require("mongoose");

const ScoreDetailsSchema = new mongoose.Schema({
  pointTotal: Number,
  pointQ1: Number,
  pointQ2: Number,
  pointQ3: Number,
  pointQ4: Number,
  pointOT: Number,
  timeoutsRemaining: Number
});

const ScoreSchema = new mongoose.Schema({
  time: String,
  phase: String,
  visitorTeamScore: ScoreDetailsSchema,
  homeTeamScore: ScoreDetailsSchema,
  releasedToClubs: Boolean
});
const Score = mongoose.model("Score", ScoreSchema);

module.exports = { Site: Score, ScoreSchema };
