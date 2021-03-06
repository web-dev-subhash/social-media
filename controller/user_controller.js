const User = require('../models/users');
const Users = require('../models/users');  //import the database file in which we stored our users
const fs = require('fs');  //for accessing file like deletion ,reading etc
const path = require('path');

module.exports.profile = function(req,res){
    // return res.end('<h1> user profile </h1>');
    // return res.render('users',{    //'users' it is filename in views section to which control go..
    //     title: "users"
    // });

    Users.findById(req.params.id,function(err,User){
        return res.render('user_profile',{
            title: "user",
            profile_user: User
        });
    });
}

module.exports.update = async function(req,res){
    if(req.params.id!=req.user.id){  //don't write here locals .user.id instead of req.user.id...that will not work
        return res.redirect('back');
    }

   /* Users.findByIdAndUpdate(req.params.id,req.body,function(err,user){ //after updation or creation , a call back function will contain that new user
        if(err){
            console.log('error in updating user profile');
        }
        return res.redirect('back');
    });*/

    /*
    Users.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        email:req.body.email
    },function(err,user){ //after updation or creation , a call back function will contain that new user
        if(err){
            console.log('error in updating user profile');
        }
        return res.redirect('back');
    });*/

    try{
        let user = await Users.findById(req.params.id);
        //directly we can't access req.body bcz form contain multidata...so we have to use multer
        //use static function
        Users.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('****multer error',err);
            }

            //now we can access req.body
            user.name= req.body.name;
            user.email= req.body.email;

            if(req.file){

                //delete previous profile
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar)); //deleting previous file
                }
                //this is saving path of the uploaded file into avatar of the user
                user.avatar= Users.avatarPath + '/' + req.file.filename;
            }

            user.save();
            return res.redirect('back');
        })
    }
    catch(err){
        console.log('error',err);
        return ;
    }

}


//rendering to sogn in page
module.exports.sign_in = function(req,res){
    //check if user has already signed in
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('sign_in',{
        title: "sign-in"
    });
}

//rendering to sign up page
module.exports.sign_up = function(req,res){
    //check if user has already signed in
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('sign_up',{
        title: "sign-up"
    });
}

//get the sign up data
module.exports.create_id = function(req,res){
    //first check if password and confirm password match or not
    //if(req.body.password != req.body.confirm-password){
    //    return res.redirect('back');
    //}

    //now check if enterd mail id is new or not
    //so for this we have to access database..
    Users.findOne({email: req.body.email},function(err,user){     //database query
        if(err){console.log('error in signing up'); return};

        if(!user){
            Users.create(req.body,function(err,user){  //database query
                if(err){console.log('error in signing up'); return}; 
            })

            return res.redirect('/users/sign-in');
        }
        else{
            return res.redirect('back');
        }

        
    });
}

//get the sign in data
module.exports.create_session = function(req,res){
    req.flash('success','logged in succesfully'); //setting key andmessage as value in flash , now for transferring to res object use own middleware
    return res.redirect('/');
}

//get the sign-out data
module.exports.destroy_session = function(req,res){
    req.logout();
    req.flash('success','you have logged out!');
    return res.redirect('/');
}
