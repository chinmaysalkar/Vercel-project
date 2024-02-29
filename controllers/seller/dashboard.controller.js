module.exports = {

    dashboard: (req, res) => {
        res.render('seller/apps-ecommerce-seller-details', { auth_data: req.session.auth_data, title: 'Dashboard', page_title: 'Dashboard', folder: 'Dashboards' });
    },
    add_product: (req, res) => {
       
        res.render('seller/apps-ecommerce-add-product', { auth_data: req.session.auth_data, title: 'Create Product', page_title: 'Create Product', folder: 'Ecommerce' });
    }
}