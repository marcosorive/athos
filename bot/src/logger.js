const pino = require('pino')
module.exports = {
  logger: pino({prettyPrint: { colorize: false, translateTime: true}},pino.destination("./bot.log"), )
}
