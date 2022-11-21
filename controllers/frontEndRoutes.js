const express = require('express');
const router = express.Router();
const {User,Post,Comment} = require('../models');
const moment = require('moment');

router.get("/",(req,res)=>{

    Post.findAll({
        include:[{
            model:User,
            attributes:['username'],
        },{
            model:Comment,
            attributes:['id'],
        }],
        order: [
          ['createdAt', 'DESC'],
        ],
        
    }).then(allpost=>{

        const postsHbsData = allpost.map(post=>post.get({plain:true}))
        // update the date format
        postsHbsData.map(post=>post.date = moment(post.createdAt).format('MM/DD/YYYY'));

        console.log(postsHbsData);
        res.render("home", {
            posts: postsHbsData,
            logged_in: req.session.logged_in,
            username: req.session.username,
        })

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
        hbsData.logged_in=req.session.logged_in;
        hbsData.Posts.map(post=>post.date = moment(post.createdAt).format('MM/DD/YYYY'));
        console.log(hbsData.Posts)
        res.render("dashboard",hbsData)
    })
})

router.get("/create-post",(req,res)=>{
    if(!req.session.logged_in){
        return res.redirect("/login")
    }
    res.render("createpost",{
        logged_in: req.session.logged_in,
        username: req.session.username
    })
})

router.get("/edit-post/:id",(req,res)=>{
    if(!req.session.logged_in){
        return res.redirect("/login")
    }

    Post.findByPk(req.params.id)
    .then(postData=>{
        const hbsData = postData.toJSON();
        console.log(hbsData)
        hbsData.logged_in=req.session.logged_in;
        hbsData.username=req.session.username;
        res.render("createpost",hbsData)
    })

})



// GET one post
router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: [
                {
                    model:User,
                    attributes: ['username'],
                }
            ]
          },
        ],
      });

      const postHbsData = postData.toJSON();
      // update the date format
      postHbsData.date = moment(postHbsData.updatedAt).format('MM/DD/YYYY') ;
      postHbsData.logged_in=req.session.logged_in;
      postHbsData.username=req.session.username;
      postHbsData.Comments.map(cmt=>cmt.date = moment(cmt.createdAt).format('MM/DD/YYYY'));
      // for each comment, check if it is my comment. in order to show 'update' 'delete' button
      postHbsData.Comments.map(cmt=>cmt.myComment = ( cmt.UserId == req.session.user_id ? true : false));

      console.log(postHbsData);
      res.render('post', postHbsData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


module.exports = router;