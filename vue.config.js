require('dotenv').config()

const Dotenv = require('dotenv-webpack')

module.exports = {
    configureWebpack: {
        plugins: [
            new Dotenv()
        ]
    },
    baseUrl: process.env.BASE_URL
}
