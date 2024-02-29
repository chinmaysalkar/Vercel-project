const router = require('express').Router();
const multer = require('multer');
var path = require('path');
var uuid = require('uuid');

const { login } = require('../auth/auth');
const { dashboard, dashboard_graph } = require('../controllers/admin/dashboard.controller');
const { CollegeList, CollegeCreate, CollegeEdit, CollegeDelete, CollegeUpdate, college_list } = require('../controllers/admin/college.controller');
const { SchoolList, SchoolCreate, SchoolEdit, SchoolDelete, SchoolUpdate, school_list } = require('../controllers/admin/school.controller');
const { BoardList, BoardCreate, BoardEdit, BoardDelete, BoardUpdate, board_list } = require('../controllers/admin/board.controller');
const { MediumList, MediumCreate, MediumEdit, MediumDelete, MediumUpdate, medium_list } = require('../controllers/admin/medium.controller');
const { StandardList, StandardCreate, StandardEdit, StandardDelete, StandardUpdate, standard_list, boarding } = require('../controllers/admin/standard.controller');
const { SubjectList, SubjectCreate, SubjectEdit, SubjectDelete, SubjectUpdate, subject_list, stdclass } = require('../controllers/admin/subject.controller');
const { ChapterList, ChapterCreate, ChapterEdit, ChapterDelete, ChapterUpdate, chapter_list, stdsubject, stdchapter } = require('../controllers/admin/chapter.controller'); 
const { StudentList, StudentCreate, StudentEdit, StudentDelete, StudentUpdate, student_list } = require('../controllers/admin/student.controller');
const { StudyMaterialList, StudyMaterialCreate, StudyMaterialEdit, StudyMaterialDelete, StudyMaterialUpdate, StudyMaterialAddList, StudyMaterialEditModel, StudyMaterialDeleteModel } = require('../controllers/admin/studymaterial.controller');
const { QuestionList, QuestionCreate, QuestionEdit, QuestionDelete, QuestionUpdate, QuestionOptionUpdate, question_list, stdquestion } = require('../controllers/admin/question.controller'); 
const { TestList, TestCreate, TestEdit, TestDelete, TestUpdate, test_list } = require('../controllers/admin/test.controller'); 

// image upload 
const storage = multer.memoryStorage();
const maxSize = 1024 * 1024 * 500;
const upload = multer({ storage, limits: { fileSize: maxSize }});

const fieldsupload = upload.fields([{ name: 'collegeLogo', maxCount: 1 },{ name: 'schoolLogo', maxCount: 1 },{ name: 'boardLogo', maxCount: 1 },
{ name: 'profilePicture', maxCount: 1 },{ name: 'mediafile', maxCount: 20 }]);


router.get("/", login, function(req, res, next) {
    if (req.session.auth_data.role == "superadmin") {
        next();
    } else {
        res.redirect('/admin/user');
    }
}, dashboard);
router.get("/dashboard_graph", login, dashboard_graph);

// Global
router.get("/college-list", login, college_list);
router.get("/school-list", login, school_list);
router.get("/board-list", login, board_list);
router.get("/medium-list", login, medium_list);
router.get("/standard-list", login, standard_list);
router.get("/subject-list", login, subject_list);
router.get("/chapter-list", login, chapter_list);
router.get("/student-list", login, student_list);
router.get("/question-list", login, question_list);
router.get("/test-list", login, test_list);
router.post("/boarding", login, boarding);
router.post("/stdclass", login, stdclass);
router.post("/stdsubject", login, stdsubject);
router.post("/stdchapter", login, stdchapter);
router.post("/stdquestion", login, stdquestion);

// College
router.get("/college", login, CollegeList);
router.get('/college/create', (req, res, next) => {
    res.render('admin/college/college-create', { auth_data: req.session.auth_data, title: 'Add College', page_title: 'Add College', folder: 'Apps' });
})
router.get("/college/delete/:id", login, CollegeDelete);
router.get("/college/edit/:id", login, CollegeEdit);
router.post("/college/create", login, fieldsupload, CollegeCreate);
router.post("/college/update", login, fieldsupload, CollegeUpdate);

// School
router.get("/school", login, SchoolList);
router.get('/school/create', (req, res, next) => {
    res.render('admin/school/school-create', { auth_data: req.session.auth_data, title: 'Add School', page_title: 'Add School', folder: 'Apps' });
})
router.get("/school/delete/:id", login, SchoolDelete);
router.get("/school/edit/:id", login, SchoolEdit);
router.post("/school/create", login, fieldsupload, SchoolCreate);
router.post("/school/update", login, fieldsupload, SchoolUpdate);

// Board
router.get("/board", login, BoardList);
router.get('/board/create', (req, res, next) => {
    res.render('admin/board/board-create', { auth_data: req.session.auth_data, title: 'Add Board', page_title: 'Add Board', folder: 'Apps' });
})
router.get("/board/delete/:id", login, BoardDelete);
router.get("/board/edit/:id", login, BoardEdit);
router.post("/board/create", login, fieldsupload, BoardCreate);
router.post("/board/update", login, fieldsupload, BoardUpdate);

// Medium
router.get("/medium", login, MediumList);
router.get('/medium/create', (req, res, next) => {
    res.render('admin/medium/medium-create', { auth_data: req.session.auth_data, title: 'Add Medium', page_title: 'Add Medium', folder: 'Apps' });
})
router.get("/medium/delete/:id", login, MediumDelete);
router.get("/medium/edit/:id", login, MediumEdit);
router.post("/medium/create", login, fieldsupload, MediumCreate);
router.post("/medium/update", login, fieldsupload, MediumUpdate);

// Standard
router.get("/standard", login, StandardList);
router.get('/standard/create', (req, res, next) => {
    res.render('admin/standard/standard-create', { auth_data: req.session.auth_data, title: 'Add Standard', page_title: 'Add Standard', folder: 'Apps' });
})
router.get("/standard/delete/:id", login, StandardDelete);
router.get("/standard/edit/:id", login, StandardEdit);
router.post("/standard/create", login, fieldsupload, StandardCreate);
router.post("/standard/update", login, fieldsupload, StandardUpdate);

// Subject
router.get("/subject", login, SubjectList);
router.get('/subject/create', (req, res, next) => {
    res.render('admin/subject/subject-create', { auth_data: req.session.auth_data, title: 'Add Subject', page_title: 'Add Subject', folder: 'Apps' });
})
router.get("/subject/delete/:id", login, SubjectDelete);
router.get("/subject/edit/:id", login, SubjectEdit);
router.post("/subject/create", login, fieldsupload, SubjectCreate);
router.post("/subject/update", login, fieldsupload, SubjectUpdate);

// Chapter
router.get("/chapter", login, ChapterList);
router.get('/chapter/create', (req, res, next) => {
    res.render('admin/chapter/chapter-create', { auth_data: req.session.auth_data, title: 'Add Chapter', page_title: 'Add Chapter', folder: 'Apps' });
})
router.get("/chapter/delete/:id", login, ChapterDelete);
router.get("/chapter/edit/:id", login, ChapterEdit);
router.post("/chapter/create", login, fieldsupload, ChapterCreate);
router.post("/chapter/update", login, fieldsupload, ChapterUpdate);

// Student
router.get("/student", login, StudentList);
router.get('/student/create', (req, res, next) => {
    res.render('admin/student/student-create', { auth_data: req.session.auth_data, title: 'Add Student', page_title: 'Add Student', folder: 'Apps' });
})
router.get("/student/delete/:id", login, StudentDelete);
router.get("/student/edit/:id", login, StudentEdit);
router.post("/student/create", login, fieldsupload, StudentCreate);
router.post("/student/update", login, fieldsupload, StudentUpdate);

// Study Material
router.get("/studymaterial", login, StudyMaterialList);
router.get('/studymaterial/create', (req, res, next) => {
    res.render('admin/studymaterial/studymaterial-create', { auth_data: req.session.auth_data, title: 'Add Study Material', page_title: 'Add Study Material', folder: 'Apps' });
})
router.get("/studymaterial/delete/:id", login, StudyMaterialDelete);
router.get("/studymaterial/edit/:id", login, StudyMaterialEdit);
router.get("/studymaterial/editmodel/:id/:materialId", login, StudyMaterialEditModel);
router.get("/studymaterial/deletemodel/:id/:materialId", login, StudyMaterialDeleteModel);
router.post("/studymaterial/create", login, fieldsupload, StudyMaterialCreate);
router.post("/studymaterial/update", login, fieldsupload, StudyMaterialUpdate);
router.post("/studymaterial/StudyMaterialAddList", login, fieldsupload, StudyMaterialAddList);

// Question
router.get("/question", login, QuestionList);
router.get('/question/create', (req, res, next) => {
    res.render('admin/question/question-create', { auth_data: req.session.auth_data, title: 'Add Question', page_title: 'Add Question', folder: 'Apps' });
})
router.get("/question/delete/:id", login, QuestionDelete);
router.get("/question/edit/:id", login, QuestionEdit);
router.post("/question/option/update/:id/:optionid", login, QuestionOptionUpdate);
router.post("/question/create", login, fieldsupload, QuestionCreate);
router.post("/question/update", login, fieldsupload, QuestionUpdate);

// Test
router.get("/test", login, TestList);
router.get('/test/create', (req, res, next) => {
    res.render('admin/test/test-create', { auth_data: req.session.auth_data, title: 'Add Test', page_title: 'Add Test', folder: 'Apps' });
})
router.get("/test/delete/:id", login, TestDelete);
router.get("/test/edit/:id", login, TestEdit);
router.post("/test/create", login, fieldsupload, TestCreate);
router.post("/test/update", login, fieldsupload, TestUpdate);

module.exports = router;