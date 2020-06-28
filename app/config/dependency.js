const constant = require(__basePath + 'app/config/constants');
const logger   = require(constant.path.app + 'core/logger');
const config   = require(constant.path.app + 'core/configuration');

module.exports = function (app) {
    //Setting dependencies
    app.set('di', {
        constant: constant,
        log     : logger,
        config  : config
    });

    app.use('/LMS/api/v1/lead', require(constant.path.module + 'lead').router);
    app.use('/LMS/api/v1/user', require(constant.path.module + 'user').router);
    app.use('/LMS/api/v1/group', require(constant.path.module + 'group').router);
    app.use('/LMS/api/v1/monitor', require(constant.path.module + 'monitor').router);
};