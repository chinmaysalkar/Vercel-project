const { Standard } = require('../../models/Standard/standard.model');
const { Subject } = require('../../models/Subject/subject.model');

async function SubjectList(req, res) {
    try {
        const data = await Subject.find().populate('school board medium standard createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/subject/subject-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Subject List',
            page_title: 'Subject List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function SubjectCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const subjectId = `SUB-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await Subject.create({
            subjectId: subjectId,
            abbreviation: body.abbreviation,
            subjectName: body.subjectName,
            description: body.description,
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Subject Create Successfully'
        });
        res.redirect('/superadmin/subject');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/subject');
    }
}

async function SubjectEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Subject.findById(id);
  
        return res.render('admin/subject/subject-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Edit Subject',
            page_title: 'Edit Subject',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function SubjectDelete(req, res) {
    try {
        const id = req.params.id;
        await Subject.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Subject Delete Successfully'
        });
        res.redirect('/superadmin/subject');
    } catch (error) {
        res.send(error)
    }
}

async function SubjectUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.subject_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }
        const updatedBy = account;

        await Subject.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                subjectName: body.subjectName,
                abbreviation: body.abbreviation,
                description: body.description,
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Subject Update Successfully'
        });
        res.redirect('/superadmin/subject');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/subject');
    }
}

async function subject_list(req, res) {
    try {
        var data = await Subject.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    subjectName: 1
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

async function stdclass(req, res) {
    try {
        const { medium, school } = req.body;
        const data = await Standard.find({ medium, school }).populate('board medium')

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = { SubjectList, SubjectCreate, SubjectEdit, SubjectDelete, SubjectUpdate, subject_list, stdclass }