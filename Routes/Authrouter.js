var express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signup.controller');
const { login } = require('../controllers/login.controller');
const { logout } = require('../controllers/logout.controller');
const { send_verification_otp, verify_otp } = require('../controllers/otp.controller');
/* const auth = require('./auth/auth'); */
//Authentications all TABs.

router.get('/', function(req, res) {
    if (req.session.auth_data) {
        if (req.session.auth_data.role == "superadmin") {
            res.redirect('/superadmin');
        } else if (req.session.auth_data.role == "seller") {
            res.redirect('/seller');
        } else {
            res.redirect('/customer');
        }
    } else {
        res.redirect('/login');
    }
});

//login
router.get('/login', function(req, res) {
    if (req.session.auth_data) {
        if (req.session.auth_data.role == "superadmin") {
            res.redirect('/superadmin');
        } else if (req.session.auth_data.role == "seller") {
            res.redirect('/seller');
        } else {
            res.redirect('/customer');
        }
    } else {
        res.locals = { title: 'Login' };
        res.render('Auth/login', { message: "", status: "" });
    }

});
router.get('/signup', function(req, res) {
   
        res.locals = { title: 'Signup' };
        res.render('Auth/register', { message: "", status: "" });
});

// Customer Login
router.get('/customer_login', function(req, res) {
    if (req.session.auth_data) {
        if (req.session.auth_data.role == "superadmin") {
            res.redirect('/superadmin');
        } else if (req.session.auth_data.role == "seller") {
            res.redirect('/seller');
        } else {
            res.redirect('/customer');
        }
    } else {
        res.locals = { title: 'Customer Login' };
        res.render('Auth/customer_login', { message: "", status: "" });
    }

});

router.get('/otp_verify', function(req, res) {
   
    res.locals = { title: 'OTP Verify' };
    res.render('Auth/otp_verify', { message: "", status: "" });
});

router.get('/customer_account', function(req, res) {
   
    res.locals = { title: 'My Account' };
    res.render('customer/customer_account', { message: "", status: "" });
});

router.post('/send_verification_otp', send_verification_otp);
router.post('/verify_otp', verify_otp);

router.post('/signup', signup);

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;