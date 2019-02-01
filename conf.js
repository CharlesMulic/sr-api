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

module.exports = log => {
  if (!process.env.NODE_ENV) {
    log.warn(`NODE_ENV environment variable not found; defaulting to: '${dev.env}'`);
  }

  if (!process.env.PORT) {
    log.warn(`PORT environment variable not found; defaulting to: ${dev.port}`);
  }

  if (!process.env.BASE_URL) {
    log.warn(`BASE_URL environment variable not found; defaulting to: '${dev.baseUrl}'`);
  }

  if (!process.env.MONGODB_URL) {
    log.warn(`MONGODB_URL environment variable not found; defaulting to development database in conf.js`);
  }

  return {
    ENV: process.env.NODE_ENV || dev.env,
    PORT: process.env.PORT || dev.port,
    URL: process.env.BASE_URL || dev.baseUrl,
    MONGODB_URI:
      process.env.MONGODB_URL ||
      `mongodb://${dev.db.user}:${dev.db.password}@${dev.db.host}:${dev.db.port}/${dev.db.name}`
  };
};
