'use strict'

async function getPrice (puppeteerBrowser, store) {
  const { url, current_price: currentPrice } = store
  const transformedUrl = new URL(url)
  const domain = transformedUrl.host.replace('www.', '')
  switch (domain) {
    case 'amazon.es':
      return await getAmazonPrice(puppeteerBrowser, url, currentPrice)
    case 'elcorteingles.es':
      return await getCorteInglesPrice(puppeteerBrowser, url, currentPrice)
    case 'pccomponentes.com':
      return await getPcComponentesPrice(puppeteerBrowser, url, currentPrice)
    case 'mediamarkt.es':
      return await getMediaMarktPrice(puppeteerBrowser, url, currentPrice)
    case 'game.es':
      return await getGamePrice(puppeteerBrowser, url, currentPrice)
    case 'fnac.es':
      return await getFnacPrice(puppeteerBrowser, url, currentPrice)
  }
}

async function getAmazonPrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const selector = '#priceblock_ourprice'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    price = await page.$eval(selector, (element) => element.innerText)
  } catch (error) {
    console.error(error)
  }
  page.close()
  return price || currentPrice
}

async function getCorteInglesPrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const selector = '.price._big'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    price = await page.$eval(selector, (element) => element.innerText)
  } catch (error) {
    console.error(error)
  }
  page.close()
  return price.replace('€', '') || currentPrice
}

async function getPcComponentesPrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const selector = '#precio-main'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    price = await page.$eval(selector, (element) => element.innerText)
  } catch (error) {
    console.error(error)
  }
  page.close()
  return price.replace('€', '') || currentPrice
}

async function getMediaMarktPrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const selector = '*[font-family=price]'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    await page.waitForSelector(selector)
    price = await page.$$(selector)
    const intPart = (await (await price[0].getProperty('innerText')).jsonValue()).replace('.', ',').replace('-', '')
    const decimalPart = price[1] ? (await (await price[1].getProperty('innerText')).jsonValue()) : '00'
    price = `${intPart}${decimalPart}`
  } catch (error) {
    console.error(error)
  }
  page.close()
  return price.replace('–', '00') || currentPrice
}

async function getGamePrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const operationSelector = '.buy--type'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    // Operation is 'comprar' or 'reservar
    const operation = (await page.$eval(operationSelector, (element) => element.innerText.toLowerCase()))
    if (operation === 'comprar' || operation === 'próximamente') {
      const int = await page.$eval('.buy--price .int', (element) => element.innerText.split('\n')[0])
      const decimal = await page.$eval('.buy--price .decimal', (element) => element.innerText)
      price = `${int}${decimal}`.replace('\'', ',')
    } else if (operation === 'reservar') {
      price = await page.$eval('.buy--info', (element) => element.innerText)
      price = price.replace('PVP WEB : ', '').replace(' €', '')
    }
  } catch (error) {
    console.error('Error: ' + error)
  }
  page.close()
  return price.replace('€', '') || currentPrice
}

async function getFnacPrice (puppeteerBrowser, url, currentPrice) {
  let price = null
  const page = await puppeteerBrowser.newPage()
  try {
    const selector = '.f-priceBox-price.f-priceBox-price--reco.checked'
    await page.setViewport({ width: 800, height: 600 })
    await page.goto(url)
    price = await page.$eval(selector, (element) => element.innerText)
  } catch (error) {
    console.error(error)
  }
  page.close()
  return price.replace('€', '') || currentPrice
}

module.exports = {
  getPrice
}
