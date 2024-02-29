const { Question } = require('../../models/Question/question.model');
const { insertMediaMiddleware, deleteMedia, getMedia, gets3Media } = require('../media.controller');

async function QuestionList(req, res) {
    try {
        const data = await Question.find().populate('school board medium standard subject chapter').sort({ "updatedAt": -1 })
        data.forEach(question => {
            question.question = question.question.replace(/<[^>]*>?/gm, '');
        });
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/question/question-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Question List',
            page_title: 'Question List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function QuestionCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const updatedBy = account;
        const createdBy = account;
        const options = req.body.option;
        let isCorrects = req.body.isCorrect;

        // Remove the "false" values that come before "true" values
        isCorrects = isCorrects.reduce((filtered, value, i) => {
            if (value === 'true' && isCorrects[i - 1] === 'false') {
                filtered.pop();
            }
            filtered.push(value);
            return filtered;
        }, []);

        let optionsArray = [];
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const isCorrect = isCorrects[i] === 'true' ? true : false;
            optionsArray.push({
                option: option,
                isCorrect: isCorrect
            });
        }

        await Question.create({
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            subject: body.subject,
            chapter: body.chapter,
            question: body.question,
            explanation: body.explanation,
            questionInstruction: body.questionInstruction,
            options: optionsArray,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Question Create Successfully'
        });
        res.redirect('/superadmin/question');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/question');
    }
}

async function QuestionEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Question.findById(id);
        const options = data.options;

        return res.render('admin/question/question-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: options,
            title: 'Edit Question',
            page_title: 'Edit Question',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function QuestionDelete(req, res) {
    try {
        const id = req.params.id;
        await Question.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Question Delete Successfully'
        });
        res.redirect('/superadmin/question');
    } catch (error) {
        res.send(error)
    }
}

async function QuestionUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const updatedBy = account;
        if (body.question_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }

        await Question.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                subject: body.subject,
                chapter: body.chapter,
                question: body.question,
                explanation: body.explanation,
                questionInstruction: body.questionInstruction,
                options: optionsArray,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Question Update Successfully'
        });
        res.redirect('/superadmin/question');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/question');
    }
}

async function QuestionOptionUpdate(req, res) {
    try {
        const id = req.params.id;
        const optionid = req.params.optionid;
        const { option, isCorrect } = req.body;

        // Find the question by id and update the specific option
        await Question.findByIdAndUpdate(id, {
            $set: {
                "options.$[elem].option": option,
                "options.$[elem].isCorrect": isCorrect
            }
        }, {
            arrayFilters: [{ "elem._id": optionid }],
            new: true
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Question Option Update Successfully'
        });
        res.redirect('/superadmin/question');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/question');
    }
}

async function question_list(req, res) {
    try {
        var data = await Question.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    question: 1
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

async function stdquestion(req, res) {
    try {
        const { medium, subject, chapter, standard, board } = req.body;
        const data = await Question.find({ medium, subject, chapter, standard, board })

        return res.json({
            success: 1,
            data: data
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = { QuestionList, QuestionCreate, QuestionEdit, QuestionDelete, QuestionUpdate, QuestionOptionUpdate, question_list, stdquestion }