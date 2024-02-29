const router = require('express').Router();

const { checkAuth } = require('../middlewares/checkAuth');
const { StudentLogin, getStudent, StudentRegistration, verifyOtp, resendOtp, forgotPassword, verifyOtpAndChangePassword, StudentUpdate } = require('../controllers/auth.controller');
const { getSchool, getMedium, getStandard, getSubject, getChapter, getStudyMaterial, upsertStudentProgress, listStudentProgress } = require('../controllers/global.controller');
const { getTestbyStudent, getTest, getTestWithAnswer, AnswerSingleQuestion, AnswerAllQuestions } = require('../controllers/test.controller');

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Student Auth
router.post('/student/login', StudentLogin);
router.post('/student', checkAuth, getStudent);
router.post('/student/register', StudentRegistration);
router.post('/otp/verify', verifyOtp);
router.post('/otp/resend', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/otp/verify-and-change-password', verifyOtpAndChangePassword);
router.post('/student/update', checkAuth, StudentUpdate);

// Global
router.get('/school', getSchool);
router.get('/medium', getMedium);
router.post('/standard', getStandard);
router.post('/subject', checkAuth, getSubject);
router.post('/chapter', checkAuth, getChapter);
router.post('/study-material', checkAuth, getStudyMaterial);
router.post('/student-progress', checkAuth, upsertStudentProgress);
router.post('/student-progress/list', checkAuth, listStudentProgress);

// Test
router.post('/test/student', checkAuth, getTestbyStudent);
router.post('/test', checkAuth, getTest);
router.post('/test/with-answer', checkAuth, getTestWithAnswer);
router.post('/test/answer-single-question', checkAuth, AnswerSingleQuestion);
router.post('/test/answer-all-questions', checkAuth, AnswerAllQuestions);

module.exports = router;