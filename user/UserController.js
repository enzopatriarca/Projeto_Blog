const express = require("express")
const router = express.Router()
const user = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users",(req,res)=>{
    user.findAll().then(users =>{
        res.render("admin/users/list_users",{
            users:users,
        })
    })
})

router.get("/admin/users/create",(req,res) =>{
    res.render("admin/users/create")
})

router.post("/user/create",(req,res) =>{
    var email = req.body.email
    var password = req.body.password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password,salt)

    user.findOne({where:{email:email}}).then(u => {
        if(u == undefined){
            console.log(user)
            user.create({
                email:email,
                password: hash,
            }).then(() =>{
                res.redirect("/admin/users")
            }).catch(error =>{
                res.redirect("/admin/users")
            })
        }else{
            res.redirect("/admin/users/create")
        }
    })



    
})

router.get("/user/edit/:id",(req,res) =>{
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/users")
    }
    user.findByPk(id).then(User =>{
        if (User != undefined) {
            res.render("admin/users/edit",{
                User: User
            })
        }else{
            res.redirect("/admin/users")
        }
    }).catch(erro =>{
        res.redirect("/admin/users")
    })
})

router.post("/user/update",(req,res) =>{
    var id = req.body.id
    var email = req.body.email
    var password = req.body.password
    user.findOne({where:{email:email}}).then(User =>{
         if(User == undefined ){
            user.update({email:email, password:password},{
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/users")
            })
         }else{
            res.redirect("/admin/users")
         }
    })

})

router.post("/user/delete",(req,res) =>{
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            user.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/users")
            })

        }else{
            res.redirect("/admin/users")
        }
    }else{
        res.redirect("/admin/users")

    }
})

module.exports = router