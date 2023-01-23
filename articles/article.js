const Sequelize = require("sequelize")
const connection = require("../database/database")
const category = require("../categories/category")

const article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },slug:{
        type: Sequelize.STRING,
        allowNull: false,

    },body:{
        type: Sequelize.TEXT,
        allowNull:false,
    }

})
category.hasMany(article)
article.belongsTo(category)



module.exports = article