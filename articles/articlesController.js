const express = require("express")
const router = express.Router()

router.get("/articles",(req,res) =>{
    res.send("rota de artigos!")
})

module.exports = router