const { Board } = require('../../models/Board/board.model');
const { insertMediaMiddleware, deleteMedia, getMedia } = require('../media.controller');

async function BoardList(req, res) {
    try {
        const data = await Board.find().populate('createdBy updatedBy').sort({ "updatedAt": -1 })
        var alert_msg = req.app.get('alert_msg');
        req.app.set('alert_msg', "");
        return res.render('admin/board/board-list', {
            auth_data: req.session.auth_data,
            user_data: data,
            title: 'Board List',
            page_title: 'Board List',
            folder: 'Apps',
            alert_msg: alert_msg,
        });
    } catch (error) {
        res.send(error)
    }
}

async function BoardCreate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (req.files['boardLogo']) {
            var boardLogo = await insertMediaMiddleware(req.files['boardLogo'], account);
            var img = boardLogo.map(ele => ele._id);
        }
        const boardId = `B-${Math.floor( Math.random() * ( 999999 - 100000 ) + 100000 )}`
        const updatedBy = account;
        const createdBy = account;

        await Board.create({
            boardId: boardId,
            boardName: body.boardName,
            description: body.description,
            boardLogo: img,
            createdBy: createdBy,
            updatedBy: updatedBy,
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Board Create Successfully'
        });
        res.redirect('/superadmin/board');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/board');
    }
}

async function BoardEdit(req, res) {
    try {
        const id = req.params.id;
        const data = await Board.findById(id);
        if (data.boardLogo !== null) {
            var response = await getMedia(data.boardLogo);
        }
  
        return res.render('admin/board/board-edit', {
            auth_data: req.session.auth_data,
            user_data: data,
            media: response,
            title: 'Edit Board',
            page_title: 'Edit Board',
            folder: 'Apps'
        });
    } catch (error) {
        res.send(error)
    }
}

async function BoardDelete(req, res) {
    try {
        const id = req.params.id;
        await Board.deleteOne({ _id: id });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Board Delete Successfully'
        });
        res.redirect('/superadmin/board');
    } catch (error) {
        res.send(error)
    }
}

async function BoardUpdate(req, res) {
    try {
        const body = req.body;
        const account = req.session.auth_data._id;
        if (body.board_status == "1") {
            var Bstatus = true;
        } else {
            var Bstatus = false;
        }
        if (req.files['boardLogo']) {
            var boardLogo = await insertMediaMiddleware(req.files['boardLogo'], account);
            var img = boardLogo.map(ele => ele._id);
        }
        const updatedBy = account;

        await Board.findByIdAndUpdate({ _id: body.id }, {
            $set: {
                boardName: body.boardName,
                description: body.description,
                boardLogo: img,
                updatedBy: updatedBy,
                status: Bstatus,
                updatedAt: new Date()
            }
        });

        req.app.set('alert_msg', {
            "status": "success",
            "message": 'Board Update Successfully'
        });
        res.redirect('/superadmin/board');
    } catch (error) {
        req.app.set('alert_msg', {
            "status": "error ",
            "message": error
        });
        res.redirect('/superadmin/board');
    }
}

async function board_list(req, res) {
    try {
        var data = await Board.aggregate([
            { $match: { status: true } },
            {
                $project: {
                    _id: 1,
                    boardName: 1
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

module.exports = { BoardList, BoardCreate, BoardEdit, BoardDelete, BoardUpdate, board_list }