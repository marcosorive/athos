# Athos

Athos is a small distributed system that periodically checks product prices and notifies you vía telegram if the price goes down. 

# About ❓
- This system is developed with the idea of being used in a raspberry pi, but it can be deployed in any cloud environment, of course.

## Bot
- Usually telegram bots are accessible by everyone using the app. The bot part of Athos is built to be different. The reason is simple: web scrapping is hard and you have to be considerate with the website. If I allow any user to add products to be tracked, it would almost look like I'm DDosing the stores to get the prices.
- For this reason, the bot is meant to only be used by a small amount of people. That's why it uses an authentication mechanism.
- You can easily create your own telegram bot and deploy your own Athos. 

## Product management
- The product management part is a simple Strapi instance that has products

# Requirements 🛠
- Node.js 12 or greater.
- SQLite3. (Since I use Sequelize you could change the DBMS little work.)
- A Telegram bot API key. (Obtained when you create the bot with [botfahter](https://core.telegram.org/bots#6-botfather))

# Installation 💻
- Clone the repository with `git clone` in the folder you want to install
- If you are using a debian based OS can install it running the install.sh script. Using other OS, install nodejs 12 or greater and run `npm run setup`.

# Configuration ⚙️


# Launch 🚀


# How to use 🤖


# Supported stores 🏪
