const { S3, AWS } = require("aws-sdk");
const { 'v4': uuid } = require('uuid');
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });

exports.s3getURL = async (Key) => {
    const s3 = new S3();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Key,
        Expires: 60
    };

    s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
            return { "err": err }
        }
        return { "url": url }
    });
};

exports.s3Upload = async (files) => {
    const s3 = new S3();

    const params = files.map((file) => {
        let Key = `uploads/${uuid()}-${file.originalname}`;
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Key,
            Body: file.buffer,
        };
    });
    const results = await Promise.all(params.map((param) => s3.upload(param).promise()));

    return { "results": results, "Key": Key }
};

exports.s3Uploadsingle = async (file) => {
    const s3 = new S3();
    let Key = `uploads/${uuid()}-${file.originalname}`;
    if (file.mimetype === 'application/pdf') {
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Key,
            Body: file.buffer,
            ContentDisposition: 'inline',
            ContentType: 'application/pdf'
        };
    } else {
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Key,
            Body: file.buffer,
            ContentDisposition: 'inline',
        };
    }
    // const params = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: Key,
    //     Body: file.buffer,
    //     ContentDisposition: 'inline',
    // };
    const results = await s3.upload(params).promise();

    return { "results": results, "Key": Key }
};

exports.deletefile = function (Key) {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        Bucket: process.env.AWS_BUCKET_NAME
    });
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Key}`
    };
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data);
        });
    });
};

