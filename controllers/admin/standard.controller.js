const { Standard } = require('../../models/Standard/standard.model');
const { SchoolMedium } = require('../../models/Medium/medium.model');

async function StandardList(req, res) {
    try {
        const data = await Standard.find().populate('school board medium createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/standard/standard-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Standard List',
            page_title: 'Standard List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function StandardCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const standardId = `STD-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await Standard.create({
            standardId: standardId,
            standardName: body.standardName,
            description: body.description,
            school: body.school,
            board: body.board,
            medium: body.medium,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Standard Create Successfully'
        });
        res.redirect('/superadmin/standard');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/standard');
    }
}

async function StandardEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Standard.findById(id);
  
        return res.render('admin/standard/standard-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Edit Standard',
            page_title: 'Edit Standard',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function StandardDelete(req, res) {
    try {
        const id = req.params.id;
        await Standard.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Standard Delete Successfully'
        });
        res.redirect('/superadmin/standard');
    } catch (error) {
        res.send(error)
    }
}

async function StandardUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.standard_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }
        const updatedBy = account;

        await Standard.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                standardName: body.standardName,
                description: body.description,
                school: body.school,
                board: body.board,
                medium: body.medium,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Standard Update Successfully'
        });
        res.redirect('/superadmin/standard');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/standard');
    }
}

async function standard_list(req, res) {
    try {
        var data = await Standard.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    standardName: 1
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

async function boarding(req, res) {
    try {
        const body = req.body;
        const data = await SchoolMedium.find({ board: body.board }).populate('board')

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = { StandardList, StandardCreate, StandardEdit, StandardDelete, StandardUpdate, standard_list, boarding }