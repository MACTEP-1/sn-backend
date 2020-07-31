var User = require('./models/User.js');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var express = require('express');
var router = express.Router();

// module.exports = {
//     register: (req, res) => {
router.post('/register', (req, res) => {
    var userData = req.body;
    // if taking username/password, need backup validation
    // in case angular validation fails

    var user = new User(userData);

    user.save((err, newUser) => {
        if (err)
            return res.status(500).send({message: 'Unable to register'});

        var payload = { sub: newUser._id };

        var token = jwt.encode(payload, '123');

        res.status(200).send({token: token});
    })
})

//    login: async (req, res) => {
//        var loginData = req.body;
router.post('/login', async (req, res) => {
    // if taking username/password, need backup validation
    // in case angular validation fails
    var loginData = req.body;

    var user = await User.findOne({email: loginData.email});

    if(!user)
        return res.status(401).send({message: 'Email or Password invalid'});
    
    bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
        if(!isMatch)
            return res.status(401).send({message: 'Email or Password invalid'});

        var payload = { sub: user._id };

        var token = jwt.encode(payload, '123');

        res.status(200).send({token: token});
    })
})

var auth = {
    router,
    checkAuthenticated(req, res, next) {
        if(!req.header('authorization'))
            return res.status(401).send({message: 'Unauthorised. Missing auth header'});
        
        const token = req.header('authorization').split(' ')[1];
    
        var payload = jwt.decode(token, '123');
    
        if (!payload)
            return res.status(401).send({message: 'Unauthorised. Auth header invalid'});
    
        req.userId = payload.sub;
    
        next();
    }
    
}

module.exports = auth;