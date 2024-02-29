const { Subject } = require('../../models/Subject/subject.model');
const { Chapter } = require('../../models/Chapter/chapter.model');

async function ChapterList(req, res) {
    try {
        const data = await Chapter.find().populate('school board medium standard subject createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/chapter/chapter-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Chapter List',
            page_title: 'Chapter List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function ChapterCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const chapterId = `C-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await Chapter.create({
            chapterId: chapterId,
            chapterName: body.chapterName,
            description: body.description,
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            subject: body.subject,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Chapter Create Successfully'
        });
        res.redirect('/superadmin/chapter');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/chapter');
    }
}

async function ChapterEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Chapter.findById(id);
  
        return res.render('admin/chapter/chapter-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Edit Chapter',
            page_title: 'Edit Chapter',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function ChapterDelete(req, res) {
    try {
        const id = req.params.id;
        await Chapter.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Chapter Delete Successfully'
        });
        res.redirect('/superadmin/chapter');
    } catch (error) {
        res.send(error)
    }
}

async function ChapterUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.chapter_status == "1") {
            var Cstatus = true;
        } else {
            var Cstatus = false;
        }
        const updatedBy = account;

        await Chapter.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                chapterName: body.chapterName,
                description: body.description,
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                subject: body.subject,
                updatedBy: updatedBy,
                status: Cstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Chapter Update Successfully'
        });
        res.redirect('/superadmin/chapter');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/chapter');
    }
}

async function chapter_list(req, res) {
    try {
        var data = await Chapter.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    chapterName: 1
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

async function stdsubject(req, res) {
    try {
        const { medium, school, standard, board } = req.body;
        const data = await Subject.find({ medium, school, standard, board }).populate('board medium standard')

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

async function stdchapter(req, res) {
    try {
        const { medium, subject, standard, board } = req.body;
        const data = await Chapter.find({ medium, subject, standard, board }).populate('board medium standard')

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = { ChapterList, ChapterCreate, ChapterEdit, ChapterDelete, ChapterUpdate, chapter_list, stdsubject, stdchapter }