const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
  siteId: Number,
  siteCity: String,
  siteFullname: String,
  siteState: String,
  roofType: String
});
const Site = mongoose.model("Site", SiteSchema);

module.exports = { Site, SiteSchema };
