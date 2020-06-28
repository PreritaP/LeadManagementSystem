/**
 * User Controller for user manager
 * 
 * @author Prerita
 */
const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');

exports.ping = function (req, res, next) {
	return res.status(200).json(response.build('SUCCESS', [{response:'pong'}]));
}