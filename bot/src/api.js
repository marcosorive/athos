'use strict'
const fetch = require('node-fetch')
const { logger } = require('./logger')

const baseUrl = process.env.PRODUCT_MANAGEMENT_BASE_URL

const paths = {
  loginPath: '/auth/local',
  enabledProducts: '/products?enabled=true',
  updateProduct: '/products/:id'
}

async function authenticateAndSaveJwt() {
  try {
    logger.info(`Authenticating with url ${baseUrl} ...`)
    const loginUrl = `${baseUrl}${paths.loginPath}`
    const body = {
      identifier: process.env.PRODUCT_MANAGEMENT_EMAIL,
      password: process.env.PRODUCT_MANAGEMENT_PASSWORD
    }
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const token = (await response.json()).jwt;
    process.env.PRODUCT_MANAGEMENT_JWT = token
    logger.info(`-> Authentication done!`)
  } catch (e) {
    logger.error(e)
  }
}

async function getEnabledProducts() {
  try {
    const enabledProductsUrl = `${baseUrl}${paths.enabledProducts}`
    const headers = {
      Authorization: `Bearer ${process.env.PRODUCT_MANAGEMENT_JWT}`,
      'Content-Type': 'application/json'
    }
    const response = await fetch(enabledProductsUrl, { headers })
    return await response.json()
  } catch (e) {
    logger.error(e)
  }
}

async function updateProduct(product) {
  try {
    const updateUrl = `${baseUrl}${paths.updateProduct}`.replace(':id', product.id)
    logger.info(`Updating product ${product.name}. URL is ${updateUrl}`)
    const headers = {
      Authorization: `Bearer ${process.env.PRODUCT_MANAGEMENT_JWT}`,
      'Content-Type': 'application/json'
    }
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(product)
    })
    logger.info(`Response from updating product ${product.name} is ${response.status}`)
    if (!response.ok) {
      throw new Error('Something went wrong updating!')
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  authenticateAndSaveJwt,
  getEnabledProducts,
  updateProduct
}
