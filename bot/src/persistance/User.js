const bcrypt = require('bcrypt')
const { logger } = require('../logger')
const { sequelize } = require('./database')
const { DataTypes } = require('sequelize')

const User = sequelize.define('users', {
  username: DataTypes.TEXT,
  password: DataTypes.TEXT,
  chatId: DataTypes.TEXT
})

User.sync()

async function createUser(username, plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(plainPassword, salt)
    const createdUser = await User.create({ username, password })
    return createdUser
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function authenticate(username, password, chatId) {
  try {
    logger.debug(`User named ${username} is trying to authenticate.`)
    const user = await User.findOne({ where: { username } })
    if (!user) {
      logger.debug(`User named ${username} was not in the database.`)
      return null
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      user.chatId = chatId
      await user.save()
      return user
    } else {
      logger.debug(`Password was not valid.`)
      return null;
    }
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function getAllChatIds() {
  try {
    return (await User.findAll({
      attributes: ['chatId']
    })).map(u => u.chatId)
  } catch (error) {
    logger.error(error)
    return null
  }
}

module.exports = {
  createUser,
  authenticate,
  getAllChatIds
}
