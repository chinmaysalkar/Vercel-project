const { College } = require('../../models/College/college.model');
const { insertMediaMiddleware, deleteMedia, getMedia } = require('../media.controller');

async function CollegeList(req, res) {
    try {
        const data = await College.find().populate('createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/college/college-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'College List',
            page_title: 'College List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function CollegeCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (req.files['collegeLogo']) {
            var collegeLogo = await insertMediaMiddleware(req.files['collegeLogo'], account);
            var img = collegeLogo.map(ele => ele._id);
        }
        const collegeId = `C-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;
        await College.create({
            collegeId: collegeId,
            collegeName: body.collegeName,
            address: body.address,
            city: body.city,
            phone: body.phone,
            email: body.email,
            collegeLogo: img,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'College Create Successfully'
        });
        res.redirect('/superadmin/college');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/college');
    }
}

async function CollegeEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await College.findById(id);
        if (data.collegeLogo !== null) {
            var response = await getMedia(data.collegeLogo);
        }
  
        return res.render('admin/college/college-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: response,
            title: 'Edit College',
            page_title: 'Edit College',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function CollegeDelete(req, res) {
    try {
        const id = req.params.id;
        await College.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'College Delete Successfully'
        });
        res.redirect('/superadmin/college');
    } catch (error) {
        res.send(error)
    }
}

async function CollegeUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.college_status == "1") {
            var Cstatus = true;
        } else {
            var Cstatus = false;
        }
        if (req.files['collegeLogo']) {
            var collegeLogo = await insertMediaMiddleware(req.files['collegeLogo'], account);
            var img = collegeLogo.map(ele => ele._id);
        }
        const updatedBy = account;

        await College.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                collegeName: body.collegeName,
                address: body.address,
                city: body.city,
                phone: body.phone,
                email: body.email,
                collegeLogo: img,
                updatedBy: updatedBy,
                status: Cstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'College Update Successfully'
        });
        res.redirect('/superadmin/college');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/college');
    }
}

async function college_list(req, res) {
    try {
        var data = await College.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    collegeName: 1
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

module.exports = { CollegeList, CollegeCreate, CollegeEdit, CollegeDelete, CollegeUpdate, college_list }