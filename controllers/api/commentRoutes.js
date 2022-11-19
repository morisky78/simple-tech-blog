const express = require('express');
const router = express.Router();
const {User,Post,Comment} = require('../../models');

// router.get("/",(req,res)=>{
//     Post.findAll({
//         include:[User, Comment]
//     }).then(postData=>{
//         res.json(postData)
//     }).catch(err=>{
//         res.status(500).json({msg:"an error occurred",err})
//     })
// })

router.post("/",(req,res)=>{
    if(!req.session.user_id){
        return res.status(403).json({msg:"login first!"})
    }
    console.log(`****`+req.body.comment+'--- postid: '+req.body.postid+'--- userid: '+req.session.user_id)
    Comment.create({
        content:req.body.comment,
        PostId:req.body.postid,
        UserId:req.session.user_id
    }).then(commentData=>{
        res.json(commentData)
    }).catch(err=>{
        res.status(500).json({msg:"an error occurred",err})
    })
})

module.exports = router;