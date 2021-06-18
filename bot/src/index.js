'use strict'
require('dotenv').config()

const { Telegraf } = require('telegraf')
const cron = require('node-cron')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const { authenticateAndSaveJwt } = require('./api')
const { authenticate } = require('./user')
const { updatePrices } = require('./productUpdater')
const { logger } = require('./logger')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
authenticateAndSaveJwt()

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)
bot.command('start', async (ctx) => {
  // Explicit usage
  const username = ctx.message.from.username
  const chatId = ctx.message.chat.id
  const message = ctx.update.message.text.split(' ')
  const password = message[1]
  const user = await authenticate(username, password, chatId)
  if (user) {
    ctx.telegram.sendMessage(ctx.message.chat.id, 'You are authenticated. You will recieve price updates.')
  } else {
    ctx.telegram.sendMessage(ctx.message.chat.id, 'Nope')
  }
})
bot.launch()

cron.schedule('* * * * *', async () => {
  logger.info('-> Begin price checking.')
  const _browser = await puppeteer.launch({ headless: false })
  await updatePrices(_browser, bot)
  _browser.close()
  logger.info('-> Finished price checking.')
})


process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)')
  bot.stop('SIGINT')
  // some other closing procedures go here
  process.exit(1)
})
