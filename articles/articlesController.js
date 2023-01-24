const express = require("express")
const router = express.Router()
const category = require("../categories/category")
const article = require("./article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles",adminAuth,(req,res) =>{

    article.findAll({
        include:[{model:category}]
    }).then(articles =>{
        res.render("admin/articles/list_article",{
            articles:articles
        })

    })
})

router.get("/admin/articles/new",adminAuth,(req,res) =>{
    category.findAll().then(categories =>{
        res.render("admin/articles/new",{
            categories:categories
        })
    })
    
})

router.post("/article/save",adminAuth,(req,res) =>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete",adminAuth,(req,res) =>{
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })

        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")

    }
})

router.get("/admin/articles/edit/:id",adminAuth,(req,res)=>{
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/articles")
    }
    article.findByPk(id,).then(article =>{
        if (article != undefined) {
            category.findAll().then(categories =>{
                res.render("admin/articles/edit",{
                    article: article,
                    categories:categories
                })
            })

        }else{
            res.redirect("/admin/articles")
        }
    }).catch(erro =>{
        res.redirect("/admin/articles")
    })
})

router.post("/article/update",adminAuth,(req,res) =>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category
    // console.log(req.body.id)
    // res.send('rota update ar')
    article.update({title:title, slug:slugify(title), body:body,categoryId:category}, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(error =>{
        res.redirect("/")
    })
})

router.get("/articles/page/:num",(req,res) =>{
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * 4
    }

    article.findAndCountAll({
        limit:4,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {

        var next;
        if((offset + 4) >= articles.count){
            next = false
        }else{
            next = true
        }

        var result = {
            page:parseInt(page),
            next:next,
            articles: articles
        }
        category.findAll().then(categories =>{
             res.render("admin/articles/page",{
                 categories:categories,
                result:result
             })
            // res.json(result)
        })
        // 
    })
})

module.exports = router