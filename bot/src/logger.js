const pino = require('pino')
module.exports = {
  logger: pino({ level: 'debug', prettyPrint: { colorize: false, translateTime: true } }, pino.destination("./bot.log"),)
}
