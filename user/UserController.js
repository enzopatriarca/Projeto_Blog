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

module.exports = router