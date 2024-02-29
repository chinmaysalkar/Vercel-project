const { get } = require('request');
const { Student } = require('../../models/Student/student.model');
const { insertMediaMiddleware, deleteMedia, getMedia, gets3Media } = require('../media.controller');
const bcrypt = require( 'bcrypt' );

async function StudentList(req, res) {
    try {
        const data = await Student.find().populate('school board medium standard').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/student/student-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Student List',
            page_title: 'Student List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function StudentCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const fullName = body.firstName + ' ' + body.lastName;
        const studentId = `S-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        if (req.files['profilePicture']) {
            var profilePicture = await insertMediaMiddleware(req.files['profilePicture'], account);
            var img = profilePicture.map(ele => ele._id);
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);

        await Student.create({
            studentId: studentId,
            firstName: body.firstName,
            lastName: body.lastName,
            fullName: fullName,
            email: body.email,
            phone: body.phone,
            address: body.address,
            city: body.city,
            password: hashedPassword,
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            profilePicture: img
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Student Create Successfully'
        });
        res.redirect('/superadmin/student');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/student');
    }
}

async function StudentEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Student.findById(id);
        if (data.profilePicture !== null) {
            var response = await getMedia(data.profilePicture);
        }
  
        return res.render('admin/student/student-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: response,
            title: 'Edit Student',
            page_title: 'Edit Student',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function StudentDelete(req, res) {
    try {
        const id = req.params.id;
        await Student.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Student Delete Successfully'
        });
        res.redirect('/superadmin/student');
    } catch (error) {
        res.send(error)
    }
}

async function StudentUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const fullName = body.firstName + ' ' + body.lastName;
        if (body.student_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }
        if (req.files['profilePicture']) {
            var profilePicture = await insertMediaMiddleware(req.files['profilePicture'], account);
            var img = profilePicture.map(ele => ele._id);
        }
        if(body.password){
            var hashedPassword = await bcrypt.hash(body.password, 10);
        }

        await Student.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                firstName: body.firstName,
                lastName: body.lastName,
                fullName: fullName,
                email: body.email,
                phone: body.phone,
                address: body.address,
                city: body.city,
                password: hashedPassword,
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                profilePicture: img,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Student Update Successfully'
        });
        res.redirect('/superadmin/student');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/student');
    }
}

async function student_list(req, res) {
    try {
        var data = await Student.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    fullName: 1
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

module.exports = { StudentList, StudentCreate, StudentEdit, StudentDelete, StudentUpdate, student_list }