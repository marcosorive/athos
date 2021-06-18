const bcrypt = require('bcrypt')
const logger = require('./logger')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
})

const User = sequelize.define('users', {
  username: DataTypes.TEXT,
  password: DataTypes.TEXT,
  chatId: DataTypes.TEXT
})

User.sync()

async function createUser (username, plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(plainPassword, salt)
    const createdUser = User.create({ username, password })
    return createdUser
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function authenticate (username, password, chatId) {
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) return null
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      user.chatId = chatId
      await user.save()
    }
    return user
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function getAllChatIds () {
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
