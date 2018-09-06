const express = require('express');

const  router = express.Router();

const gravatar = require('gravatar');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const key = require('../../config/config');

const passport = require('passport');
 
// @route GET pi/users/test
// @desc Test users route
// @access Public

router.get('/test',(req,res) => res.json({msg: "Users Works"})); //res send as json for the get Request

// @route GET pi/users/register
// @desc Register
// @access Public

router.post('/register',(req,res) => {

    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json(
                {email: 'Email Already exists'}
            );
        }else{

            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //Rating
                d: 'mm' //Default
            });
            const newUser = new User({
                name:req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
              });


        }
    });
});

// @route GET api/users/login
// @desc Login User / Returing JWT Token
// @access Public

router.post('/login',(req,res)=>{

    const email =req.body.email;
    const password = req.body.password;

    //find the user by email
    User.findOne({email})
    .then(user => {
        //check for users
        if(!user){
            return res.status(404).json({email: 'User not Found'})
        }
        //check password
        bcrypt.compare(password,user.password)
        .then(isMatch =>{
            if(isMatch){
                //res.json({msg: 'Success'});
                //create payload which is kind of session variable
                const payload = {
                    id : user.id,
                    name : user.name,
                    avatar : user.avatar
                }
                //sign token
                jwt.sign(payload, key.secretKey,{ expiresIn:3600  },
                    (err,token)=>{

                        res.json({
                            success : true,
                            token : 'Bearer ' + token
                        });

                    });
            }else{
                res.status(400).json({ password : 'Password incorrect'})
            }
        
        });

    });


});

// @route GET api/users/current
// @desc Login User / Returing current user
// @access Private

router.get('/current',passport.authenticate('jwt',{ session:false }),(req,res) =>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router; //exporting route