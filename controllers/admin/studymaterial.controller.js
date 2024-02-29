const { StudyMaterial } = require('../../models/Study-Material/studymaterial.model');
const { Test } = require('../../models/Test/test.model');
const { insertMediaMiddleware, deleteMedia, getMedia, gets3Media } = require('../media.controller');

async function StudyMaterialList(req, res) {
    try {
        const data = await StudyMaterial.find().populate('school board medium standard subject chapter').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/studymaterial/studymaterial-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Study Material List',
            page_title: 'Study Material List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function StudyMaterialCreate(req, res) {
    try {
        const body = req.body;
        const order = body.order;
        const title = body.title;
        const description = body.description;
        const type = body.type;
        const hyperlink = body.hyperlink;
        const test = body.test;
        const account = req.session.auth_data._id;
        const updatedBy = account;
        const createdBy = account;
        if (req.files['mediafile']) {
            var mediafile = await insertMediaMiddleware(req.files['mediafile'], account);
            var img = mediafile.map(ele => ele._id);
        }
        const data = {
            order: order,
            title: title,
            description: description,
            type: type,
            mediafile: img,
            hyperlink: hyperlink,
            test: test
        };

        let materials = [];
        for (let i = 0; i < data.order.length; i++) {
            if (data.type[i] === 'media') {
                materials.push({
                    order: data.order[i],
                    title: data.title[i],
                    description: data.description[i],
                    type: data.type[i],
                    mediafile: data.mediafile[i]
                });
            } else if (data.type[i] === 'hyperlink') {
                materials.push({
                    order: data.order[i],
                    title: data.title[i],
                    description: data.description[i],
                    type: data.type[i],
                    hyperlink: data.hyperlink[i]
                });
            } else if (data.type[i] === 'test') {
                materials.push({
                    order: data.order[i],
                    title: data.title[i],
                    description: data.description[i],
                    type: data.type[i],
                    test: data.test[i]
                });
            }
        }

        await StudyMaterial.create({
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            subject: body.subject,
            chapter: body.chapter,
            materials: materials,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'StudyMaterial Create Successfully'
        });
        res.redirect('/superadmin/studymaterial');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/studymaterial');
    }
}

async function StudyMaterialEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await StudyMaterial.findById(id);
        const materials = data.materials;
        var response = [];
        for (let i = 0; i < materials.length; i++) {
            if (materials[i].type === 'media') {
                var media = await getMedia(materials[i].mediafile);
                response.push({
                    _id: materials[i]._id,
                    order: materials[i].order,
                    title: materials[i].title,
                    description: materials[i].description,
                    type: materials[i].type,
                    mediafile: media
                });
            } else if (materials[i].type === 'hyperlink') {
                response.push({
                    _id: materials[i]._id,
                    order: materials[i].order,
                    title: materials[i].title,
                    description: materials[i].description,
                    type: materials[i].type,
                    hyperlink: materials[i].hyperlink
                });
            } else if (materials[i].type === 'test') {
                const testdata = await Test.findById(materials[i].test);
                response.push({
                    _id: materials[i]._id,
                    order: materials[i].order,
                    title: materials[i].title,
                    description: materials[i].description,
                    type: materials[i].type,
                    test: testdata
                });
            }
        }

        return res.render('admin/studymaterial/studymaterial-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: response,
            title: 'Edit StudyMaterial',
            page_title: 'Edit StudyMaterial',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function StudyMaterialEditModel(req, res) {
    try {
        const id = req.params.id;
        const materialId = req.params.materialId;
        const data = await StudyMaterial.findById(id);
        const materials = data.materials;

        // Find the material with the given _id
        const material = materials.find(m => m._id.toString() === materialId);

        let response;
        if (material.type === 'media') {
            var media = await getMedia(material.mediafile);
            response = {
                _id: material._id,
                order: material.order,
                title: material.title,
                description: material.description,
                type: material.type,
                mediafile: media
            };
        } else if (material.type === 'hyperlink') {
            response = {
                _id: material._id,
                order: material.order,
                title: material.title,
                description: material.description,
                type: material.type,
                hyperlink: material.hyperlink
            };
        } else if (material.type === 'test') {
            var testdata = await Test.findById(material.test);
            response = {
                _id: material._id,
                order: material.order,
                title: material.title,
                description: material.description,
                type: material.type,
                test: testdata
            };
        }

        return res.json({
            success: 1,
            data: response
        });
    } catch (error) {
        res.send(error)
    }
}
async function StudyMaterialDelete(req, res) {
    try {
        const id = req.params.id;
        await StudyMaterial.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'StudyMaterial Delete Successfully'
        });
        res.redirect('/superadmin/studymaterial');
    } catch (error) {
        res.send(error)
    }
}

async function StudyMaterialDeleteModel(req, res) {
    try {
        const id = req.params.id;
        const materialId = req.params.materialId;

        // Use $pull to remove the material with the given _id
        await StudyMaterial.findByIdAndUpdate(id, {
            $pull: { materials: { _id: materialId } }
        }, { new: true }); // { new: true } option returns the updated document

        return res.json({
            success: 1
        });
    } catch (error) {
        res.send(error)
    }
}

async function StudyMaterialUpdate(req, res) {
    try {
        const body = req.body;
        const order = body.order;
        const title = body.title;
        const type = body.type;
        const hyperlink = body.hyperlink;
        const account = req.session.auth_data._id;
        const updatedBy = account;

        if (req.files['mediafile']) {
            var mediafile = await insertMediaMiddleware(req.files['mediafile'], account);
            var img = mediafile.map(ele => ele._id);
        }
        const data = {
            order: order,
            title: title,
            type: type,
            mediafile: img,
            hyperlink: hyperlink
        };

        let materials = [];
        for (let i = 0; i < data.order.length; i++) {
            if (data.type[i] === 'media') {
                materials.push({
                    order: data.order[i],
                    title: data.title[i],
                    type: data.type[i],
                    mediafile: data.mediafile[i]
                });
            } else if (data.type[i] === 'hyperlink') {
                materials.push({
                    order: data.order[i],
                    title: data.title[i],
                    type: data.type[i],
                    hyperlink: data.hyperlink[i]
                });
            }
        }

        if (body.isPaid == "1") {
            var paid = true;
        } else {
            var paid = false;
        }

        if (body.studymaterial_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }

        await StudyMaterial.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                subject: body.subject,
                chapter: body.chapter,
                isPaid: paid,
                materials: materials,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'StudyMaterial Update Successfully'
        });
        res.redirect('/superadmin/studymaterial');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/studymaterial');
    }
}

async function StudyMaterialAddList(req, res) {
    try {
        const body = req.body;
        const order = body.order;
        const title = body.title;
        const type = body.type;
        const description = body.description;
        const hyperlink = body.hyperlink;
        const test = body.test;
        const account = req.session.auth_data._id;

        if (body.modelid) {
            let materialObjects = [];
            if (req.files['mediafile']) {
                var mediafile = await insertMediaMiddleware(req.files['mediafile'], account);
                var img = mediafile.map(ele => ele._id);
            }

            const data = {
                order: order,
                title: title,
                type: type,
                description: description,
                mediafile: img,
                hyperlink: hyperlink,
                test: test
            };

            for (let i = 0; i < data.order.length; i++) {
                if (data.type[i] === 'media') {
                    materialObjects.push({
                        order: data.order[i],
                        title: data.title[i],
                        type: data.type[i],
                        description: data.description[i],
                        mediafile: data.mediafile[i]
                    });
                } else if (data.type[i] === 'hyperlink') {
                    materialObjects.push({
                        order: data.order[i],
                        title: data.title[i],
                        type: data.type[i],
                        description: data.description[i],
                        hyperlink: data.hyperlink[i]
                    });
                } else if (data.type[i] === 'test') {
                    materialObjects.push({
                        order: data.order[i],
                        title: data.title[i],
                        type: data.type[i],
                        description: data.description[i],
                        test: data.test[i]
                    });
                }
            }

            await StudyMaterial.updateOne(
                { _id: body.modelid },
                { $push: { materials: { $each: materialObjects } } }
            );
        } else if (body.editid) {
            // Create a new material object
            let response;
            if (type === 'media') {
                if (req.files['mediafile']) {
                    var mediafile = await insertMediaMiddleware(req.files['mediafile'], account);
                    var img = mediafile.map(ele => ele._id);
                }
                response = {
                    'materials.$.order': order,
                    'materials.$.title': title,
                    'materials.$.description': description,
                    'materials.$.type': type,
                    'materials.$.mediafile': img
                };
            } else if (type === 'hyperlink') {
                response = {
                    'materials.$.order': order,
                    'materials.$.title': title,
                    'materials.$.description': description,
                    'materials.$.type': type,
                    'materials.$.hyperlink': hyperlink
                };
            } else if (type === 'test') {
                response = {
                    'materials.$.order': order,
                    'materials.$.title': title,
                    'materials.$.description': description,
                    'materials.$.type': type,
                    'materials.$.test': test
                };
            }

            // Update the specific material object in the materials array
            await StudyMaterial.updateOne(
                { "_id": body.id, "materials._id": body.editid },
                {
                    "$set": response
                }
            );
        }

        return res.json({
            success: 1
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    StudyMaterialList,
    StudyMaterialCreate,
    StudyMaterialEdit,
    StudyMaterialDelete,
    StudyMaterialUpdate,
    StudyMaterialAddList,
    StudyMaterialEditModel,
    StudyMaterialDeleteModel
}