const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
const { host, port, database, user, password } = parse(env("DATABASE_URL"));

const postgresSettings = {
  client: "postgres",
  host,
  port,
  database,
  username: user,
  password,
  ssl: { rejectUnauthorized: false }
}

const sqliteSettings = {
client: 'sqlite',
filename: '.tmp/data.db'
}

return {
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: process.env.DATABASE_TYPE_SQLITE ? sqliteSettings : postgresSettings,
      options: {
        useNullAsDefault: true,
      },
    },
  }}
};





