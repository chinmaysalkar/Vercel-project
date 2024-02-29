const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// const authroute = require('./Routes/authroute');
const APIrouter = require('./api/router/api.router');
const Authrouter = require('./Routes/Authrouter.js');
const adminRouter = require('./Routes/Admin.router');
const sellerRouter = require('./Routes/seller.router');
// const customerRouter = require('./Routes/customer.router');
const expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const upload = require('express-fileupload');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: ".env" });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ resave: true, saveUninitialized: true, secret: 'XCR3rsasa%RDHHH', cookie: { maxAge: 3600000 } }));
app.use(express.json());
app.use(flash());
app.use(cors());

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use('/', Authrouter);
app.use('/api', APIrouter);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
// app.use(upload());

app.use(cookieParser());

app.set('layout', 'layout/layout');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

// superadmin
app.use('/superadmin', function(req, res, next) {

    if (req.session.auth_data) {
        if (req.session.auth_data.role == "superadmin") {
            next();
        } else {
            res.redirect('/corporation');
        }
    } else {
        res.redirect('/login');
    }
}, adminRouter);

// corporation
app.use('/seller', function(req, res, next) {
    if (req.session.auth_data) {
        if (req.session.auth_data.role == "seller") {
            next();
        } else {
            res.redirect('/superadmin');
        }
    } else {
        res.redirect('/login');
    }
}, sellerRouter);

// store
// app.use('/customer', function(req, res, next) {
//     if (req.session.auth_data) {
//         if (req.session.auth_data.role == "customer") {
//             next();
//         } else {
//             res.redirect('/superadmin');
//         }
//     } else {
//         res.redirect('/login');
//     }
// }, customerRouter);

app.use((err, req, res, next) => {
    let error = {...err }
    if (error.name === 'JsonWebTokenError') {
        err.message = "please login again";
        err.statusCode = 401;
        return res.status(401).redirect('view/login');
    }
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'errors';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,

    })
});

const http = require("http").createServer(app);
http.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));