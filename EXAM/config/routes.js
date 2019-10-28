const routers = require('../routers');

module.exports = (app) => {
    app.use('/', routers.home);
    
    app.use('/user', routers.user);

    app.use('/expense', routers.expense)

    app.use('*', (req, res, next) => {
        res.render('404');
    })
}