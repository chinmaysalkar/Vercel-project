const { Question } = require('../../models/Question/question.model');
const { Test } = require('../../models/Test/test.model');
const { AnswerSheet } = require('../../models/Answersheet/answersheet.model');
const mongoose = require('mongoose');

async function TestList(req, res) {
    try {
        const data = await Test.find().populate('school board medium standard subject chapter').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/test/test-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Test List',
            page_title: 'Test List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function TestCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const updatedBy = account;
        const createdBy = account;
        const testId = `T-${Math.floor(Math.random() * (999999 - 100000) + 100000)}`
        const order = body.order;
        const questionId = body.questionId;
        const negativeMark = body.negativeMark;
        const mark = body.mark;

        const data = {
            order: order,
            question: questionId,
            negativeMark: negativeMark,
            mark: mark
        };

        let questions = [];
        for (let i = 0; i < data.order.length; i++) {
            questions.push({
                order: data.order[i],
                question: mongoose.Types.ObjectId(data.question[i]),
                negativeMark: data.negativeMark[i],
                mark: data.mark[i]
            });
        }

        await Test.create({
            testId: testId,
            title: body.title,
            school: body.school,
            board: body.board,
            medium: body.medium,
            standard: body.standard,
            subject: body.subject,
            chapter: body.chapter,
            totalMarks: body.totalMarks,
            passingPercentage: body.passingPercentage,
            totalQuestions: body.totalQuestions,
            questions: questions,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Test Create Successfully'
        });
        res.redirect('/superadmin/test');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/test');
    }
}

async function TestEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Test.findById(id).populate('questions.question');
        const questions = data.questions;
        return res.render('admin/test/test-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: questions,
            title: 'Edit Test',
            page_title: 'Edit Test',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function TestDelete(req, res) {
    try {
        const id = req.params.id;
        await Test.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Test Delete Successfully'
        });
        res.redirect('/superadmin/test');
    } catch (error) {
        res.send(error)
    }
}

async function TestUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        const updatedBy = account;
        const order = body.order;
        const questionId = body.questionId;
        const negativeMark = body.negativeMark;
        const mark = body.mark;

        const data = {
            order: order,
            question: questionId,
            negativeMark: negativeMark,
            mark: mark
        };

        let questions = [];
        for (let i = 0; i < data.order.length; i++) {
            questions.push({
                order: data.order[i],
                question: data.question[i],
                negativeMark: data.negativeMark[i],
                mark: data.mark[i]
            });
        }

        if (body.test_status == "1") {
            var Sstatus = true;
        } else {
            var Sstatus = false;
        }

        await Test.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                title: body.title,
                school: body.school,
                board: body.board,
                medium: body.medium,
                standard: body.standard,
                subject: body.subject,
                chapter: body.chapter,
                totalMarks: body.totalMarks,
                passingPercentage: body.passingPercentage,
                totalQuestions: body.totalQuestions,
                questions: questions,
                updatedBy: updatedBy,
                status: Sstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Test Update Successfully'
        });
        res.redirect('/superadmin/test');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/test');
    }
}

async function test_list(req, res) {
    try {
        var data = await Test.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    title: 1
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

module.exports = { TestList, TestCreate, TestEdit, TestDelete, TestUpdate, test_list }