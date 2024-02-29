const { School } = require('../../models/School/school.model');
const { insertMediaMiddleware, deleteMedia, getMedia } = require('../media.controller');

async function SchoolList(req, res) {
    try {
        const data = await School.find().populate('createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/school/school-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'School List',
            page_title: 'School List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function SchoolCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (req.files['schoolLogo']) {
            var schoolLogo = await insertMediaMiddleware(req.files['schoolLogo'], account);
            var img = schoolLogo.map(ele => ele._id);
        }
        const schoolId = `S-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await School.create({
            schoolId: schoolId,
            schoolName: body.schoolName,
            address: body.address,
            city: body.city,
            phone: body.phone,
            email: body.email,
            schoolLogo: img,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'School Create Successfully'
        });
        res.redirect('/superadmin/school');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/school');
    }
}

async function SchoolEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await School.findById(id);
        if (data.schoolLogo !== null) {
            var response = await getMedia(data.schoolLogo);
        }
  
        return res.render('admin/school/school-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: response,
            title: 'Edit School',
            page_title: 'Edit School',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function SchoolDelete(req, res) {
    try {
        const id = req.params.id;
        await School.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'School Delete Successfully'
        });
        res.redirect('/superadmin/school');
    } catch (error) {
        res.send(error)
    }
}

async function SchoolUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.school_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }
        if (req.files['schoolLogo']) {
            var schoolLogo = await insertMediaMiddleware(req.files['schoolLogo'], account);
            var img = schoolLogo.map(ele => ele._id);
        }
        const updatedBy = account;

        await School.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                schoolName: body.schoolName,
                address: body.address,
                city: body.city,
                phone: body.phone,
                email: body.email,
                schoolLogo: img,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'School Update Successfully'
        });
        res.redirect('/superadmin/school');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/school');
    }
}

async function school_list(req, res) {
    try {
        var data = await School.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    schoolName: 1
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

module.exports = { SchoolList, SchoolCreate, SchoolEdit, SchoolDelete, SchoolUpdate, school_list }