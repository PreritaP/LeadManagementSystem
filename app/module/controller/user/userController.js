/**
 * User Controller for user manager
 * 
 * @author Prerita
 */

const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');
const underscore    = require('underscore');
const userModel     = require(constants.path.app + 'module/model/userModel');


/**
 * Create User API
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.createUser = function ( req, res, next ) {

	const userModelObj = new userModel();

	if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Create User fields are missing.'));
    } else {
    	let userCreateParam = {
    		"userName" 			: req.body.userName,
    		"employeeCode" 		: req.body.employeeCode,
    		"userRole"			: req.body.userRole,
    		"userDayBucket" 	: req.body.userDayBucket,
    		"userTotalBucket" 	: req.body.userTotalBucket
    	}
    	userModelObj.createUser(userCreateParam, function (error, results){
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS', 'User Created Successfully'));
    	});
    }
}


/**
 * Map user in a group 
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.mapUserInGroup = function ( req, res, next ) {
	const userModelObj = new userModel();

	if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Map User fields are missing.'));
    } else {
    	let userMapParam = {
    		"rank" 			: req.body.rank,
    		"userId" 		: req.body.userId,
    		"groupId"		: req.body.groupId
    	}
    	userModelObj.mapUserInGroup(userMapParam, function (error, results){
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS', 'User Map Successfully'));
    	});
    }
}


/**
 * get all active user in a group  
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.getActiveUserIngroup = function ( req, res, next ) {
	const userModelObj = new userModel();

	if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Group id is required.'));
    } else {
    	userModelObj.getActiveUserIngroup(req.body.groupId, function (error, results){
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS', results));
    	});
    }
}

/**
 * get User list by role 
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.getUserByRoleId = function ( req, res, next ) {
	const userModelObj = new userModel();

	if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Role Id is required.'));
    } else {
    	userModelObj.getUserList(req.body.roleId, function (error, results){
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS',results));
    	});
    }
}