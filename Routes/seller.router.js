const router = require('express').Router();
const fs = require('fs');
var path = require('path');
const multer = require('multer');


const { login } = require('../auth/auth');
const { dashboard } = require('../controllers/seller/dashboard.controller');

// image upload 
const storage = multer.memoryStorage();
const maxSize = 1024 * 1024 * 25
const upload = multer({ storage, limits: { fileSize: maxSize }});

const fieldsupload = upload.fields([{ name: 'category-img', maxCount: 1 }]);

//Dashboard
router.get("/", login, dashboard);

module.exports = router;