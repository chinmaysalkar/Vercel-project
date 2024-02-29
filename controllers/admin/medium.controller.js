const { SchoolMedium } = require('../../models/Medium/medium.model');

async function MediumList(req, res) {
    try {
        const data = await SchoolMedium.find().populate('board createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/medium/medium-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Medium List',
            page_title: 'Medium List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function MediumCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const mediumId = `M-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await SchoolMedium.create({
            mediumId: mediumId,
            mediumName: body.mediumName,
            description: body.description,
            board: body.board,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Medium Create Successfully'
        });
        res.redirect('/superadmin/medium');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/medium');
    }
}

async function MediumEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await SchoolMedium.findById(id);
  
        return res.render('admin/medium/medium-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Edit Medium',
            page_title: 'Edit Medium',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function MediumDelete(req, res) {
    try {
        const id = req.params.id;
        await SchoolMedium.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Medium Delete Successfully'
        });
        res.redirect('/superadmin/medium');
    } catch (error) {
        res.send(error)
    }
}

async function MediumUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.medium_status == "1") {
            var Mstatus = true;
        } else {
            var Mstatus = false;
        }
        const updatedBy = account;

        await SchoolMedium.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                mediumName: body.mediumName,
                description: body.description,
                board: body.board,
                updatedBy: updatedBy,
                status: Mstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Medium Update Successfully'
        });
        res.redirect('/superadmin/medium');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/medium');
    }
}

async function medium_list(req, res) {
    try {
        var data = await SchoolMedium.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    mediumName: 1
                }
            }]);

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = { MediumList, MediumCreate, MediumEdit, MediumDelete, MediumUpdate, medium_list }