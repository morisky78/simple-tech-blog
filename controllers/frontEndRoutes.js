const express = require('express');
const router = express.Router();
const {User,Post,Comment} = require('../models');

router.get("/",(req,res)=>{

    Post.findAll().then(allpost=>{

        const postsHbsData = allpost.map(post=>post.get({plain:true}))
        console.log(postsHbsData);
        
        res.render("home", postsHbsData)

    })
})

router.get("/login",(req,res)=>{
    if(req.session.logged_in){
        return res.redirect("/")
    }
    res.render("login")
})

router.get("/signup",(req,res)=>{
    if(req.session.logged_in){
        return res.redirect("/")
    }
    res.render("signup")
})

router.get("/sessions",(req,res)=>{
    res.json(req.session)
})

router.get("/dashboard",(req,res)=>{
    if(!req.session.logged_in){
        return res.redirect("/login")
    }

    User.findByPk(req.session.user_id,{
        include:[Post]
    }).then(userData=>{
        const hbsData = userData.toJSON();
        console.log(hbsData)
        hbsData.logged_in=req.session.logged_in
        res.render("dashboard",hbsData)
    })
})

router.get("/create-post",(req,res)=>{
    if(!req.session.logged_in){
        return res.redirect("/login")
    }
    res.render("createpost")
})

module.exports = router;