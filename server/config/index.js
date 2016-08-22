'use strict';

module.exports = function (app, db) {

    // setValue and getValue are merely alias
    // for app.set and app.get used in the less
    // common way of setting application variables.
    app.setValue = app.set.bind(app);

    app.getValue = function (path) {
        return app.get(path);
    };

    require('./app-variables')(app);

    // Logging middleware, set as application
    // variable inside of server/config/app-variables.js
    app.use(app.getValue('log'));

    require('./authentication')(app, db);

};



