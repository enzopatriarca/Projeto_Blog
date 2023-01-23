const Sequelize = require("sequelize")

const connection = new Sequelize('guiapress','root','Passw0rd*',{
    host:'localhost',
    dialect:'mysql',
    timezone: '-03:00'

})

module.exports = connection