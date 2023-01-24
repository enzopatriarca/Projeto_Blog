const express = require("express")
const router = express.Router()
const user = require("./User")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users",adminAuth,(req,res)=>{
    // if (req.session.user == undefined) {
    //     res.redirect("/")
    // }
    user.findAll().then(users =>{
        res.render("admin/users/list_users",{
            users:users,
        })
    })
})

router.get("/admin/users/create",adminAuth,(req,res) =>{
    res.render("admin/users/create")
})

router.post("/user/create",adminAuth,(req,res) =>{
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

router.get("/user/edit/:id",adminAuth,(req,res) =>{
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

router.post("/user/update",adminAuth,(req,res) =>{
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

router.post("/user/delete",adminAuth,(req,res) =>{
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

router.get("/login",(req,res) =>{
    res.render("admin/users/login")
})

router.post("/authenticate",(req,res)=>{
    var email = req.body.email
    var password = req.body.password

    user.findOne({where:{email:email}}).then(User =>{
        if(User != undefined){
            var aux = bcrypt.compareSync(password,User.password)
            if(aux){    
                req.session.user={
                    id: User.id,
                    email: User.email
                }
                res.redirect("admin/articles")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

router.get("/logout",(req,res)=>{
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router