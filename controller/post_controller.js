const Post = require('../models/post');

module.exports.add = function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    },function(err,post){
        if(err){
            console.log('error in posting');
            return;
        }
        return res.redirect('back');
    })
}