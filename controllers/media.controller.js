const { Media } = require('../models/media/media.model');
const { User } = require('../models/users/users.model');
const { s3Upload, s3Uploadsingle, deletefile, s3getURL } = require('./s3.controller');

async function insertMediaMiddleware( files, account ) {
    try {
        if( !files ) {
            return {
                type: "VALIDATION_ERROR",
                message: "File is required"
            };
        }
        const useraccount = await User.findById(account);
        const params = files.map(async ele => {
            const mediaData = await s3Uploadsingle( ele );
            const data = await Media.create({
                originalname: ele.originalname,
                encoding: ele.encoding,
                mimetype: ele.mimetype,
                filename: ele.filename,
                path: mediaData.Key,
                size: ele.size,
                account: useraccount.account
            });
            return data;
        });
        const dataid = await Promise.all(params.map((ele) => ele));
        return dataid
    } catch ( e ) {
        throw e;
    }
}


async function deleteMedia( req, res, next ) {
    const { id } = req.params;
    try {
        const response = await Media.deleteOne({ _id: id });

        await deletefile( response.path );
        return {
            type: "Success",
            message: "File is deleted",
            data: response
        };
    } catch ( e ) {
        next( e );
    }
}

async function getMedia( id ) {
    try {
        const response = await Media.findById({ _id: id });

        return response
    } catch ( e ) {
        next( e );
    }
}

async function gets3Media( id ) {
    try {
        const response = await Media.findById({ _id: id });
        const ele = response.path;
        const mediaData = await s3getURL( ele );

        return mediaData
    } catch ( e ) {
        next( e );
    }
}

module.exports = { insertMediaMiddleware, deleteMedia, getMedia, gets3Media }