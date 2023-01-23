const express = require("express")
const bodyparser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")

const article = require("./articles/article")
const categories = require("./categories/category")

connection.authenticate().then(()=>{
    console.log("Conexao com o baco de dados")
}).catch((msgErro)=>{
    console.log(msgErro)
})

const app = express()

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.json())
// app.use(express.urlencoded())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.use("/",categoriesController)
app.use("/",articlesController)

app.get("/",(req,res) =>{
    res.render("index")
})

app.listen(4040,()=>{
    console.log('App rodando')
})