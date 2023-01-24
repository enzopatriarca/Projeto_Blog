const express = require("express")
const router = express.Router()
const category = require("./category")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/categories/new",adminAuth,(req,res) =>{
    res.render("admin/categories/new")
})

router.post("/categories/save",adminAuth,(req,res)=>{
    var title = req.body.title
    if(title != undefined){
        category.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("admin/categories/new")
    }
})

router.get("/admin/categories",adminAuth,(req,res)=>{
    category.findAll().then(categories =>{
        res.render("admin/categories/list",{
            categories: categories,
        })
    })
})

router.post("/categories/delete",adminAuth,(req,res) =>{
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })

        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")

    }
})

router.get("/admin/categories/edit/:id",adminAuth,(req,res)=>{
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    category.findByPk(id).then(category =>{
        if (category != undefined) {
            res.render("admin/categories/edit",{
                category: category
            })
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro =>{
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update",adminAuth,(req,res) =>{
    var id = req.body.id
    var title = req.body.title
    category.update({title:title, slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    })
})

module.exports = router