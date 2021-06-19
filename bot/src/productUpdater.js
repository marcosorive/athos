const { logger } = require('./logger')
const { getAllChatIds } = require('./user')
const { getEnabledProducts, updateProduct } = require('./api')
const { getPrice } = require('./scrapper')

function getStoreWithUpdatedPrice(_browser, product, store, delayTime, bot) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const newStore = { ...store }
                logger.info(`-> Checking store ${store.name}`)
                let newCurrent = await getPrice(_browser, store)
                newCurrent = parseFloat(newCurrent)
                logger.info(`-> Price is ${newCurrent}`)
                newStore.currentPrice = newCurrent
                if (newCurrent < parseFloat(store.minimumPrice)) {
                    newStore.minimumPrice = newCurrent
                    const chatIds = await getAllChatIds()
                    chatIds.forEach(id => bot.telegram.sendMessage(id,
                        `${product.name} has a new lowest in ${store.name}.\nNOW: ${newCurrent} (was ${store.minimumPrice})\n${store.url}`))
                }
                resolve(newStore)
            } catch (error) {
                reject(error)
            }
        }, delayTime)
    })
}

async function updatePrices(_browser, bot) {
    logger.info('--- Begin price checks --- ')
    logger.info('-> Browser started')
    try {
        const enabledProducts = await getEnabledProducts();
        return await Promise.all(enabledProducts.map(async (product, productIndex) => {
            setTimeout(() => logger.info(`-> Checking product with name ${product.name}. Absolute minimum is ${product.absoluteMinimum}`), productIndex * 10000);
            const newProduct = { ...product };
            const newStores = await Promise.all(product.stores.map(async (store, storeIndex) => {
                const delayTime = (productIndex * 10000) + (storeIndex * 5000)
                return getStoreWithUpdatedPrice(_browser, product, store, delayTime, bot)
            }));
            newProduct.stores = newStores
            let storeIsLowest = null
            newStores.forEach((s) => {
                if (s.currentPrice < newProduct.absoluteMinimum) {
                    newProduct.absoluteMinimum = s.currentPrice
                    storeIsLowest = s;
                }
            })
            if (storeIsLowest) {
                logger.info('-> Found lowest ever, notifying user.')
                const chatIds = await getAllChatIds()
                chatIds.forEach(id => bot.telegram.sendMessage(id,
                    `${product.name} has a new LOWEST EVER!.\nNOW: ${storeIsLowest.currentPrice} (was: ${product.absoluteMinimum})\nURL : ${storeIsLowest.url}`))
            }
            return await updateProduct(newProduct)
        }))
    } catch (error) {
        console.log('Updateprices: ' + error)
    }
}

module.exports = {
    updatePrices
}
