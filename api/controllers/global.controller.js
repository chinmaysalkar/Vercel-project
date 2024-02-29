const { Subject } = require('../../models/Subject/subject.model');
const { Student, StudentProgress } = require('../../models/Student/student.model');
const { Chapter } = require('../../models/Chapter/chapter.model');
const { StudyMaterial } = require('../../models/Study-Material/studymaterial.model');
const { School } = require('../../models/School/school.model');
const { SchoolMedium } = require('../../models/Medium/medium.model');
const { Standard } = require('../../models/Standard/standard.model');
const { Board } = require('../../models/Board/board.model');
const mongoose = require('mongoose');

async function getSchool(req, res) {
    try {
        // Fetch the school from the database
        const school = await School.find({ status: true });

        // Check if school exists
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        var response = [];
        school.forEach(school => {
            response.push({
                _id: school._id,
                schoolId: school.schoolId,
                schoolName: school.schoolName,
                status: school.status
            });
        });

        return res.status(200).json({ message: 'School fetched successfully', school: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getMedium(req, res) {
    try {
        // Find the Board
        const board = await Board.findOne();

        // Fetch the medium from the database
        const medium = await SchoolMedium.find({ board: board._id, status: true });

        // Check if medium exists
        if (!medium) {
            return res.status(404).json({ message: 'Medium not found' });
        }

        var response = [];
        medium.forEach(medium => {
            response.push({
                _id: medium._id,
                mediumId: medium.mediumId,
                mediumName: medium.mediumName,
                status: medium.status
            });
        });

        return res.status(200).json({ message: 'Medium fetched successfully', medium: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getStandard(req, res) {
    try {
        const { schoolId, mediumId } = req.body;
        // Find the Board
        const board = await Board.findOne();

        // Fetch the standard from the database
        const standard = await Standard.find({ board: board._id, school: schoolId, medium: mediumId, status: true });

        // Check if standard exists
        if (!standard) {
            return res.status(404).json({ message: 'Standard not found' });
        }

        var response = [];
        standard.forEach(standard => {
            response.push({
                _id: standard._id,
                standardId: standard.standardId,
                standardName: standard.standardName,
                status: standard.status
            });
        });

        return res.status(200).json({ message: 'Standard fetched successfully', standard: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getSubject(req, res) {
    try {
        const { studentId } = req.body;

        // Validate studentId
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Find the student by studentId
        const student = await Student.findOne({ _id: studentId });

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Extract board, medium, and standard from student
        const { board, medium, standard } = student;

        // Find the subjects that match the student's board, medium, and standard
        const subjects = await Subject.find({ board, medium, standard, status: true });

        var response = [];
        subjects.forEach(subject => {
            response.push({
                _id: subject._id,
                subjectId: subject.subjectId,
                abbreviation: subject.abbreviation,
                subjectName: subject.subjectName,
                description: subject.description,
                status: subject.status
            });
        });

        return res.status(200).json({ message: 'Subjects fetched successfully', subjects: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getChapter(req, res) {
    try {
        const { subjectId } = req.body;

        // Validate studentId
        if (!subjectId) {
            return res.status(400).json({ message: 'SubjectId ID is required' });
        }

        // Find the subject by subjectId
        const subject = await Subject.findOne({ _id: subjectId, status: true });

        // Check if subject exists
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Find the chapter by subjectId
        const chapters = await Chapter.find({ subject: subjectId, status: true });

        // Check if chapter exists
        if (!chapters) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        var response = [];
        chapters.forEach(chapter => {
            response.push({
                _id: chapter._id,
                chapterId: chapter.chapterId,
                chapterName: chapter.chapterName,
                subjectName: subject.subjectName,
                description: chapter.description,
                status: chapter.status
            });
        });

        return res.status(200).json({ message: 'Chapters fetched successfully', Chapter: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function getStudyMaterial(req, res) {
    try {
        const { chapterId } = req.body;

        // Validate chapterId
        if (!chapterId) {
            return res.status(400).json({ message: 'Chapter ID is required' });
        }

        // Find the chapter by chapterId
        const chapter = await Chapter.findOne({ _id: chapterId, status: true });

        // Check if chapter exists
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Find the study material by chapterId
        const studyMaterials = await StudyMaterial.find({ chapter: chapterId, status: true }).populate('materials.mediafile');

        // Check if study material exists
        if (!studyMaterials) {
            return res.status(404).json({ message: 'Study Material not found' });
        }

        var response = [];
        studyMaterials.forEach(studyMaterial => {
            response.push({
                _id: studyMaterial._id,
                isPaid: studyMaterial.isPaid,
                materials: studyMaterial.materials,
                chapterName: chapter.chapterName,
                chapterdescription: chapter.description,
                status: studyMaterial.status
            });
        });

        return res.status(200).json({ message: 'Study Material fetched successfully', material: response });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function upsertStudentProgress(req, res) {
    try {
        const { studentId, studyMaterialId, progress, testId } = req.body;

        // Validate studentId, studyMaterialId and progress
        // if (!studentId || !studyMaterialId || !progress) {
        //     return res.status(400).json({ message: 'Student ID, Study Material ID and Progress are required' });
        // }

        // Find the student by studentId
        const student = await Student.findOne({ _id: studentId });

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (testId) {
            // Find all study materials where status is true
            const studyMaterials = await StudyMaterial.find({ status: true });

            // Initialize materialDoc as null
            let materialDoc = null;
            let studyMaterialIdd = null;

            // Loop over each study material in the studyMaterials array
            for (let sm of studyMaterials) {
                // Find the material in sm.materials where the test property matches testId
                const material = sm.materials.find(material => material.test && material.test.toString() === testId);

                // If a material was found, get the entire document and break the loop
                if (material) {
                    materialDoc = material;
                    studyMaterialIdd = sm._id;
                    break;
                }
            }

            // Check if a material was found
            if (!materialDoc) {
                return res.status(404).json({ message: 'Material not found' });
            }

            // Check if the progress object exists in the StudentProgress document
            const existingProgress = await StudentProgress.findOne({ student: studentId, studyMaterial: studyMaterialIdd, "progress.section": materialDoc._id });

            // If the progress object exists in the StudentProgress document, update it
            if (existingProgress) {
                await StudentProgress.updateOne(
                    { student: studentId, studyMaterial: studyMaterialIdd, "progress.section": materialDoc._id },
                    { $set: { "progress.$.status": "Completed" } }
                );
            }
            // If the progress object doesn't exist in the StudentProgress document, push it
            else {
                await StudentProgress.updateOne(
                    { student: studentId, studyMaterial: studyMaterialIdd },
                    { $addToSet: { progress: { section: materialDoc._id, status: "Completed" } } },
                    { upsert: true }
                );
            }

            // Find the updated StudentProgress document
            const upsertedProgress = await StudentProgress.findOne({ student: studentId, studyMaterial: studyMaterialIdd });

            return res.status(200).json({ message: 'Student progress upserted successfully', progress: upsertedProgress });
        }

        if (studyMaterialId, progress) {
            // Find the study material by studyMaterialId
            const studyMaterial = await StudyMaterial.findOne({ _id: studyMaterialId, status: true });

            // Check if study material exists
            if (!studyMaterial) {
                return res.status(404).json({ message: 'Study Material not found' });
            }

            // Find the StudentProgress document
            let studentProgress = await StudentProgress.findOne({ student: studentId, studyMaterial: studyMaterialId });

            // If StudentProgress document doesn't exist, create a new one
            if (!studentProgress) {
                studentProgress = new StudentProgress({ student: studentId, studyMaterial: studyMaterialId, progress: [] });
            }

            // For each progress object in the request body
            for (let p of progress) {
                // Check if the progress object exists in the StudentProgress document
                const existingProgress = await StudentProgress.findOne({ student: studentId, studyMaterial: studyMaterialId, "progress.section": p.section });

                // If the progress object exists in the StudentProgress document, update it
                if (existingProgress) {
                    await StudentProgress.updateOne(
                        { student: studentId, studyMaterial: studyMaterialId, "progress.section": p.section },
                        { $set: { "progress.$.status": p.status } }
                    );
                }
                // If the progress object doesn't exist in the StudentProgress document, push it
                else {
                    await StudentProgress.updateOne(
                        { student: studentId, studyMaterial: studyMaterialId },
                        { $addToSet: { progress: p } },
                        { upsert: true }
                    );
                }
            }

            // Find the updated StudentProgress document
            const upsertedProgress = await StudentProgress.findOne({ student: studentId, studyMaterial: studyMaterialId });

            return res.status(200).json({ message: 'Student progress upserted successfully', progress: upsertedProgress });
        }

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function listStudentProgress(req, res) {
    try {
        const { studentId } = req.body;

        // Validate studentId
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Find the StudentProgress documents for the student
        const studentProgress = await StudentProgress.find({ student: studentId });

        return res.status(200).json({ message: 'Student progress fetched successfully', progress: studentProgress });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

module.exports = {
    getSchool,
    getMedium,
    getStandard,
    getSubject,
    getChapter,
    getStudyMaterial,
    upsertStudentProgress,
    listStudentProgress
}