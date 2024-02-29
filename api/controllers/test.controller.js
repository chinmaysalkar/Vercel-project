const { Question } = require('../../models/Question/question.model');
const { Test } = require('../../models/Test/test.model');
const { AnswerSheet } = require('../../models/Answersheet/answersheet.model');
const { Student, StudentProgress } = require('../../models/Student/student.model');
const { StudyMaterial } = require('../../models/Study-Material/studymaterial.model');
const moment = require('moment-timezone');


async function getTestbyStudent(req, res) {
    try {
        const { studentId } = req.body;

        // validate studentId
        if (!studentId) {
            return res.status(400).json({ message: 'Student Id is required' });
        }

        // check if student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // get tests of student from answer sheet
        const answersheets = await AnswerSheet.find({ student: studentId, status: true }).populate('test').sort({ createdAt: -1 });

        const testResponse = answersheets.map(({ test, testTakenDate, testStatus, totalSolved, totalCorrected, totalWrong, totalMarks, _id }) => ({
            answerId: _id,
            testId: test.testId,
            title: test.title,
            testType: test.testType,
            totaltestMarks: test.totalMarks,
            passingPercentage: test.passingPercentage,
            totalQuestions: test.totalQuestions,
            isNegativeMarking: test.isNegativeMarking,
            isPaid: test.isPaid,
            testTakenDate: testTakenDate,
            testStatus: testStatus,
            totalSolved: totalSolved,
            totalCorrected: totalCorrected,
            totalWrong: totalWrong,
            totalMarks: totalMarks,
        }));

        return res.status(200).json({ message: 'Test fetched successfully', test: testResponse });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getTest(req, res) {
    try {
        const { testId } = req.body;

        // validate testId
        if (!testId) {
            return res.status(400).json({ message: 'Test Id is required' });
        }

        // check if test exists
        const test = await Test.findById({ _id: testId, status: true }).populate('questions.question');

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const testResponse = {
            testId: test._id,
            title: test.title,
            testType: test.testType,
            totalMarks: test.totalMarks,
            passingPercentage: test.passingPercentage,
            totalQuestions: test.totalQuestions,
            isNegativeMarking: test.isNegativeMarking,
            isPaid: test.isPaid,
            status: test.status,
        };

        // get questions
        const questions = test.questions;

        const questionResponse = questions.map(({ question, order, negativeMark, mark }) => ({
            questionId: question._id,
            question: question.question,
            questionInstruction: question.questionInstruction,
            questionType: question.questionType,
            options: question.options,
            status: question.status,
            order,
            negativeMark,
            mark,
        }));

        return res.status(200).json({ message: 'Test fetched successfully', test: testResponse, questions: questionResponse });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getTestWithAnswer(req, res) {
    try {
        const { answerId } = req.body;

        // validate answerId
        if (!answerId) {
            return res.status(400).json({ message: 'Test Id is required' });
        }

        // find answer sheet
        const answersheet = await AnswerSheet.findById({ _id: answerId, status: true }).populate('test questions.questionId');

        if (!answersheet) {
            return res.status(404).json({ message: 'Answer sheet not found' });
        }

        // get test from answer sheet
        const test = answersheet.test;

        const testResponse = {
            testId: test._id,
            title: test.title,
            testType: test.testType,
            totalMarks: test.totalMarks,
            passingPercentage: test.passingPercentage,
            totalQuestions: test.totalQuestions,
            isNegativeMarking: test.isNegativeMarking,
            isPaid: test.isPaid,
            status: test.status,
        };

        // get questions with answers from answer sheet
        const questions = answersheet.questions;

        const questionResponse = questions.map(({ questionId, answers, order, negativeMark, mark, isRight, marksObtained }) => ({
            questionId: questionId._id,
            question: questionId.question,
            questionType: questionId.questionType,
            options: questionId.options,
            status: questionId.status,
            order,
            answers,
            negativeMark,
            mark,
            marksObtained,
            isRight,
        }));

        return res.status(200).json({ 
            message: 'Test fetched successfully', 
            test: testResponse,
            totalSolved: answersheet.totalSolved,
            totalCorrected: answersheet.totalCorrected,
            totalWrong: answersheet.totalWrong,
            totalMarks: answersheet.totalMarks,
            testStatus: answersheet.testStatus,
            testTakenDate: answersheet.testTakenDate,
            questions: questionResponse
        });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function AnswerSingleQuestion(req, res) {
    try {
        const { studentId, testId, questionId, optionId } = req.body;

        // validate testId, studentId, questionId, optionId
        if (!testId) {
            return res.status(400).json({ message: 'Test Id is required' });
        }

        if (!studentId) {
            return res.status(400).json({ message: 'Student Id is required' });
        }

        if (!questionId) {
            return res.status(400).json({ message: 'Question Id is required' });
        }

        if (!optionId) {
            return res.status(400).json({ message: 'Option Id is required' });
        }

        // check if test exists
        const test = await Test.findById(testId).populate('questions.question');

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // check if student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // check if student has given test earlier
        const answersheet = await AnswerSheet.findOne({ test: testId, student: studentId });

        if (!answersheet) {

            // check if student has given all questions of this test
            if (test.questions.length === 0) {
                return res.status(400).json({ message: 'Student has already answered all questions of this test' });
            }

            // check if question exists in test
            const question = test.questions.find((question) => question.question._id.toString() === questionId.toString());

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            // check if option exists in question
            const option = question.question.options.find((option) => option._id.toString() === optionId.toString());

            if (!option) {
                return res.status(404).json({ message: 'Option not found' });
            }

            // check if the option is the correct answer
            const isRight = option.isCorrect;
            const marksObtained = isRight ? question.mark : -question.negativeMark;

            // create answer sheet
            const newAnswerSheet = new AnswerSheet({
                student: studentId,
                test: testId,
                questions: [
                    {
                        questionId,
                        answers: optionId,
                        order: question.order,
                        negativeMark: question.negativeMark,
                        mark: question.mark,
                        isRight,
                        marksObtained
                    }
                ],
                totalSolved: 1,
                totalCorrected: isRight ? 1 : 0,
                totalWrong: isRight ? 0 : 1,
                totalMarks: marksObtained,
                testStatus: "In Progress"
            });

            // save answer sheet
            await newAnswerSheet.save();

            return res.status(200).json({ message: 'Answer saved successfully' });

        } else {
            // check if student has given this question earlier
            const answer = answersheet.questions.find((answer) => answer.questionId.toString() === questionId.toString());

            if (answer) {
                return res.status(400).json({ message: 'Student has already answered this question' });
            }

            // check if student has given all questions of this test
            if (answersheet.questions.length === test.questions.length) {
                return res.status(400).json({ message: 'Student has already answered all questions of this test' });
            }

            // check if question exists in test
            const question = test.questions.find((question) => question.question._id.toString() === questionId.toString());

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            // check if option exists in question
            const option = question.question.options.find((option) => option._id.toString() === optionId.toString());

            if (!option) {
                return res.status(404).json({ message: 'Option not found' });
            }

            // check if the option is the correct answer
            const isRight = option.isCorrect;
            const marksObtained = isRight ? question.mark : -question.negativeMark;

            // add answer
            answersheet.questions.push({
                questionId,
                answers: optionId,
                order: question.order,
                negativeMark: question.negativeMark,
                mark: question.mark,
                isRight,
                marksObtained
            });

            // update totals
            answersheet.totalSolved += 1;
            answersheet.totalCorrected += isRight ? 1 : 0;
            answersheet.totalWrong += isRight ? 0 : 1;
            answersheet.totalMarks += marksObtained;

            // check if student has given all questions of this test
            if (answersheet.questions.length === test.totalQuestions) {
                // calculate passing marks
                const passingMarks = test.totalMarks * (test.passingPercentage / 100);

                // check if student has passed or failed
                if (answersheet.totalMarks >= passingMarks) {
                    answersheet.testStatus = 'Passed';
                } else {
                    answersheet.testStatus = 'Failed';
                }
            }

            // save answer
            await answersheet.save();

            return res.status(200).json({ message: 'Answer saved successfully' });
        }

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function AnswerAllQuestions(req, res) {
    try {
        const { studentId, testId, answers } = req.body;

        // validate testId, studentId, answers
        if (!testId) {
            return res.status(400).json({ message: 'Test Id is required' });
        }

        if (!studentId) {
            return res.status(400).json({ message: 'Student Id is required' });
        }

        if (!answers) {
            return res.status(400).json({ message: 'Answers are required' });
        }

        // find student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // find test
        const test = await Test.findById({ _id: testId, status: true }).populate('questions.question');

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // create answer sheet
        const answersheet = new AnswerSheet({
            student: studentId,
            test: testId,
            testStatus: "In Progress",
            status: true
        });

        // iterate over answers
        for (const answer of answers) {
            const { questionId, optionId } = answer;

            // find question in test
            const question = test.questions.find((question) => question.question._id.toString() === questionId.toString());

            if (!question) {
                return res.status(404).json({ message: `Question not found: ${questionId}` });
            }

            // find option in question
            const option = question.question.options.find((option) => option._id.toString() === optionId.toString());
            if (!option) {
                return res.status(404).json({ message: `Option not found: ${optionId}` });
            }

            // check if the option is the correct answer
            const isRight = option.isCorrect;
            const marksObtained = isRight ? question.mark : -question.negativeMark;

            // add answer to answer sheet
            answersheet.questions.push({
                questionId,
                answers: optionId,
                order: question.order,
                negativeMark: question.negativeMark,
                mark: question.mark,
                isRight,
                marksObtained
            });

            // update totals
            answersheet.totalSolved += 1;
            answersheet.totalCorrected += isRight ? 1 : 0;
            answersheet.totalWrong += isRight ? 0 : 1;
            answersheet.totalMarks += marksObtained;
        }

        // check if student has given all questions of this test
        if (answersheet.questions.length === test.totalQuestions) {
            // calculate passing marks
            const passingMarks = test.totalMarks * (test.passingPercentage / 100);

            // check if student has passed or failed
            if (answersheet.totalMarks >= passingMarks) {
                answersheet.testStatus = 'Passed';
            } else {
                answersheet.testStatus = 'Failed';
            }
        }

        // update test taken date
        const testDate = moment().tz('Asia/Kolkata').format("DD MMM, YYYY hh:mm A");
        answersheet.testTakenDate = testDate;

        // save answer sheet
        await answersheet.save();

        return res.status(200).json({ message: 'Answers saved successfully', answer: answersheet });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

module.exports = { getTestbyStudent, getTest, getTestWithAnswer, AnswerSingleQuestion, AnswerAllQuestions };