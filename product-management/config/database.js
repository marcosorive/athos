const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {

let dbSettings = undefined;

if(process.env.DATABASE_TYPE_SQLITE){
  dbSettings = {
    client: 'sqlite',
    filename: '.tmp/data.db'
    };
} else {
  const { host, port, database, user, password } = parse(env("DATABASE_URL"));
  dbSettings = {
    client: "postgres",
    host,
    port,
    database,
    username: user,
    password,
    ssl: { rejectUnauthorized: false }
  };
}

return {
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: dbSettings,
      options: {
        useNullAsDefault: true,
      },
    },
  }}
};





