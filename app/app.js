const constant   	= require(__basePath + 'app/config/constants');
const app        	= require('express')();
const bodyParser 	= require('body-parser');
const validator  	= require('express-validator');
const exception  	= require(constant.path.app + 'core/exception');
const {logger}   	= require(constant.path.app + 'core/logger');
const config     	= require(constant.path.app + 'core/configuration');



/*
 * @description Middlewares for parsing body
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator({}));

/*
 * Injecting all dependencies Modules + common libs
 */
require(constant.path.app + 'config/dependency')(app);

/*
 * @description Catch 404 error if no route found
 */
app.use(function (req, res) {
    return res.status(400).json({
        status       : false,
        statusMessage: '404 - Page Not found'
    });
});

/*
 * @description Error handler
 */
app.use(exception.errorHandler);


module.exports = app;
