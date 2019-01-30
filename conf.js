const dev = {
  env: "development",
  port: 3000,
  baseUrl: "http://localhost:3000",
  db: {
    name: "sr-nfl-data",
    user: "sr-nfl-data-user",
    password: "ntALNb5kqGEZ94V",
    host: "ds237723.mlab.com",
    port: "37723"
  }
};

module.exports = {
  ENV: process.env.NODE_ENV || dev.env,
  PORT: process.env.PORT || dev.port,
  URL: process.env.BASE_URL || dev.baseUrl,
  MONGODB_URI:
    process.env.MONGODB_URL ||
    `mongodb://${dev.db.user}:${dev.db.password}@${dev.db.host}:${dev.db.port}/${dev.db.name}`
};
