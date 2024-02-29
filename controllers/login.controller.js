const { User } = require('../models/users/users.model');
const { Auth } = require('../models/auth/auth.model');
const mongoose = require('mongoose');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: ".env" });

async function postLogin(user) {
    try {
        const jwtkey = process.env.JWT_SECRET;
        const token = jwt.sign({ user }, jwtkey, { expiresIn: "12h" });
        const authToken = await Auth.create({
            token: token,
            'user': new mongoose.mongo.ObjectId(user._id)
        });
        return authToken;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    login: (req, res) => {
        const body = req.body;
        const email = body.email;
        const password = body.password;
        if (email != "" && password != "") {
            try {
                const asynchronousFunction = async() => {
                        var data = await User.findOne({ email: email });
                        return data
                    }
                    (async() => {
                        const result = await asynchronousFunction();
                        if (result) {
                            if (result.role != "customer") {
                                const results = compareSync(password, result.password);
                                if (results) {
                                    // result.password = undefined;
                                    // Generate a token (e.g., using JWT) for authentication
                                    await postLogin(result);
                                    req.session.loggedin = true;
                                    req.session.auth_data = result;
                                    
                                    if (result.role == 'superadmin') {
                                        res.redirect('/superadmin/student');
                                    } else {
                                        res.redirect('/seller');
                                    }

                                } else {
                                    res.locals = { title: 'Login' };
                                    console.log('login fail');
                                    req.flash('message', 'Username or password incorrect !!!');
                                    req.flash('status', 'danger');
                                    res.render('Auth/login', { message: req.flash('message'), status: req.flash('status') });
                                }
                            }
                        } else {

                            res.locals = { title: 'Login' };
                            req.flash('message', 'Username or password incorrect !!!');
                            req.flash('status', 'danger');
                            console.log('login fail');
                            res.render('Auth/login', { message: req.flash('message'), status: req.flash('status') });
                        }
                    })()
            } catch (error) {
                res.send(error)
            }
        } else {
            console.log('login fail');
            res.locals = { title: 'Login' };
            req.flash('message', 'Username or password incorrect !!!');
            req.flash('status', 'danger');
            res.render('login/login', { message: req.flash('message'), status: req.flash('status') });
        }
    },

};