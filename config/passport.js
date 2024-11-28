const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../model/userModel')
module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        //Find user by email
        User.findOne({email: email})
        .then((user) => {
            if(!user){
                return done(null, false, {message: 'Email not found'})
            }
        //Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                return done(null, user)
            }else{
                //If user is not found
                return done(null, false, {message: 'Password incorrect'})
            }
        });
        })
        .catch(err => console.log(err))
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
    
}