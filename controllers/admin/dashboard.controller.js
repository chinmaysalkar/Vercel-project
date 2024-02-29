const moment = require('moment');

module.exports = {
    dashboard: (req, res) => {
        try {
            const asynchronousFunction = async() => {
                // Username
                const name = req.session.auth_data.name;               
                
                return { "name": name }
            }
            (async() => {
                var data = await asynchronousFunction();
                res.render('admin/apps-ecommerce-sellers', { auth_data: req.session.auth_data, title: 'Dashboard', page_title: 'Dashboard', folder: 'Dashboards',
                name: data.name });
            })()
        } catch (error) {
            res.send(error)
        }
    },
    dashboard_graph: (req, res) => {
        try {
            

        } catch (error) {
            res.send(error)
        }
    },
};