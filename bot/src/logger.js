const pino = require('pino')
module.exports = {
  logger: pino(pino.destination("./bot.log"))
}
