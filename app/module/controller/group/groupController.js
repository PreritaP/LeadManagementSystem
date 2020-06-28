/**
 * User Controller for user manager
 * 
 * @author Prerita
 */

const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');
const underscore    = require('underscore');
const groupModel    = require(constants.path.app + 'module/model/groupModel');



/**
 * Create Group API
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.createGroup = function ( req, res, next ) {

	const groupModelObj = new groupModel();

	if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Create Group fields are missing.'));
    } else {
    	let groupCreateParam = {
    		"groupRank" 		: req.body.groupRank,
    		"groupType"			: req.body.groupType
    	}
    	groupModelObj.createGroup(groupCreateParam, function (error, results){
    		if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS', 'Group Created Successfully'));
    	});
    }
}


/**
 * get Auto allocations groups API
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.getAutoAllocationGroups = function ( req, res, next ) {
    const groupModelObj = new groupModel();
    let groupParam = {
        "groupType"         : 1
    }
    groupModelObj.getGroupDetails(groupParam, function (error, results){
        if (error) {
            console.log("ERROR OCUURED", error);
        }
        return res.status(200).json(response.build('SUCCESS', results));
    });
}