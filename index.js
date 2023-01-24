const express = require("express")
const bodyparser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")
const userController = require("./user/UserController")

const article = require("./articles/article")
const categories = require("./categories/category")
const user = require("./user/User")

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
app.use("/",userController)

app.get("/",(req,res) =>{
    article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{

        categories.findAll().then(categories =>{
            res.render("index",{
                articles:articles,
                categories:categories
            })
        })



    })
})

app.get("/:slug",(req,res) =>{
  var slug = req.params.slug
  article.findOne({
    where:{
        slug:slug
    }
  }).then(article =>{
    if(article != undefined){

        categories.findAll().then(categories =>{
            res.render("article",{
                article:article,
                categories:categories
            })
        })
        

    }else{
        res.render("/")
    }
  }).catch(error =>{
    res.redirect("/")
  })
})

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug
    categories.findOne({
        where:{
            slug:slug
        },
        include: [{model:article}]
    }).then( category =>{
        if (category != undefined) {
            categories.findAll().then(categories =>{
                res.render("index",{
                    categories:categories,
                    articles: category.articles
                })
            })
        }else{
            res.redirect("/")
        }
    }).catch(error =>{
        res.redirect("/")
    })
})

app.listen(4040,()=>{
    console.log('App rodando')
})