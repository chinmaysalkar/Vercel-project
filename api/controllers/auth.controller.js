const { Student } = require('../../models/Student/student.model');
const { Board } = require('../../models/Board/board.model');
const { Auth } = require('../../models/auth/auth.model');
const { OTP } = require('../../models/otp/otp.model');
const { generateOTP, sendSMS } = require('../utils/public.utils');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function getStudent(req, res) {
    try {
        const { id } = req.body;

        // Validate id
        if (!id) {
            return res.status(400).json({ message: 'Student Id is required' });
        }

        // Find the student by id
        const student = await Student.findById(id);

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student Authenticated Successfully', student: student });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function StudentLogin(req, res) {
    try {
        const { phone, password } = req.body;

        // Validate phone and password
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required' });
        }

        // Find the student by phone
        const student = await Student.findOne({ phone });

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if student's status is active
        if (!student.status) {
            return res.status(400).json({ message: 'Student account is not active' });
        }

        // Check if student's phone is verified
        if (!student.isphoneVerifed) {
            return res.status(400).json({ message: 'Phone number is not verified' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);

        // Check if passwords match
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Proceed with login
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await Auth.create({
            token: token,
            student: new mongoose.mongo.ObjectId(student._id)
        });

        return res.status(200).json({ message: 'Student Authenticated Successfully', token: token });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function StudentRegistration(req, res) {
    try {
        const { firstName, lastName, phone, email, school, medium, standard, city, password, confirmPassword } = req.body;

        // Validate firstName, lastName, phone, email, school, medium, standard, city, password, confirmPassword
        if (!firstName || !lastName || !phone || !email || !school || !medium || !standard || !city || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate password and confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Find the student by phone and email
        const student = await Student.findOne({ $or: [{ phone }, { email }] });

        // Check if student exists
        if (student) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = await generateOTP(4);

        // Find the Board
        const board = await Board.findOne();

        // Create student
        const newStudent = await Student.create({
            studentId: `S-${Math.floor(Math.random() * (999999 - 100000) + 100000)}`,
            firstName: firstName,
            lastName: lastName,
            fullName: firstName + ' ' + lastName,
            phone: phone,
            email: email,
            school: new mongoose.mongo.ObjectId(school),
            board: board._id,
            medium: new mongoose.mongo.ObjectId(medium),
            standard: new mongoose.mongo.ObjectId(standard),
            city: city,
            password: hashedPassword,
            otp: otp,
            status: false
        });

        // Create OTP
        await OTP.create({
            otp: otp,
            studentId: new mongoose.mongo.ObjectId(newStudent._id)
        });

        // Send OTP to student
        sendSMS(phone, otp);

        return res.status(200).json({ message: 'OTP sent to phone' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function verifyOtp(req, res) {
    try {
        const { otp } = req.body;

        // Validate otp
        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        // Find the otp
        const otpDoc = await OTP.findOne({ otp });

        // Check if otp exists
        if (!otpDoc) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }

        // Find the student
        const student = await Student.findById(otpDoc.studentId);

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student status
        student.status = true;
        student.otp = null;
        student.isphoneVerifed = true;
        student.isemailVerifed = true;
        await student.save();

        // Delete otp
        await OTP.deleteOne({ otp });

        return res.status(200).json({ message: 'Student Registered Successfully' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function resendOtp(req, res) {
    try {
        const { phone } = req.body;

        // Validate phone
        if (!phone) {
            return res.status(400).json({ message: 'Phone is required' });
        }

        // Generate OTP
        const otp = await generateOTP(4);

        // Find the student by phone
        const student = await Student.findOne({ phone });

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student otp
        student.otp = otp;
        await student.save();

        // Create OTP
        await OTP.create({
            otp: otp,
            studentId: new mongoose.mongo.ObjectId(student._id)
        });

        // Send OTP to student
        sendSMS(phone, otp);

        return res.status(200).json({ message: 'OTP resent successfully' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function forgotPassword(req, res) {
    try {
        const { phone } = req.body;

        // Validate phone
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Find the student by phone
        const student = await Student.findOne({ phone });

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Generate OTP
        const otp = await generateOTP(4);

        // Save OTP in the database
        await OTP.create({
            otp: otp,
            studentId: new mongoose.mongo.ObjectId(student._id)
        });

        // Send OTP to student
        sendSMS(phone, otp);

        return res.status(200).json({ message: 'OTP sent to phone' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function verifyOtpAndChangePassword(req, res) {
    try {
        const { otp, newPassword, confirmNewPassword } = req.body;

        // Validate otp, newPassword, and confirmNewPassword
        if (!otp || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: 'OTP, new password, and confirm new password are required' });
        }

        // Validate newPassword and confirmNewPassword
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Find the OTP in the database
        const otpRecord = await OTP.findOne({ otp });

        // Check if OTP exists
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update student's password
        await Student.findByIdAndUpdate(otpRecord.studentId, { password: hashedPassword });

        // Delete the OTP from the database
        await OTP.findByIdAndDelete(otpRecord._id);

        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

async function StudentUpdate(req, res) {
    try {
        const { studentId, firstName, lastName, email, school, medium, standard, city, profilePicture, password, confirmPassword } = req.body;

        // Find the student by studentId
        const student = await Student.findById(studentId);

        // Check if student exists
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate password and confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Update student password
            await Student.findByIdAndUpdate({ _id: studentId }, {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            });
        }

        if (profilePicture) {
            var profile = await insertMediaMiddleware(profilePicture, account);
            var img = profile.map(ele => ele._id);

            // Update student profile picture
            await Student.findByIdAndUpdate({ _id: studentId }, {
                $set: {
                    profilePicture: img,
                    updatedAt: new Date()
                }
            });
        }

        // Update student
        await Student.findByIdAndUpdate({ _id: studentId }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                fullName: firstName + ' ' + lastName,
                email: email,
                school: new mongoose.mongo.ObjectId(school),
                medium: new mongoose.mongo.ObjectId(medium),
                standard: new mongoose.mongo.ObjectId(standard),
                city: city,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({ message: 'Student updated successfully' });

    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

module.exports = { StudentLogin, getStudent, StudentRegistration, verifyOtp, resendOtp, forgotPassword, verifyOtpAndChangePassword, StudentUpdate }