/**
 * Lead Controller for handling lead actions
 * 
 * @author Prerita
 */

const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');
const underscore    = require('underscore');
const leadModel     = require(constants.path.app + 'module/model/leadModel');


/**
 * Create Lead API
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.createLead = function ( req, res, next ) {

    const leadModelObj = new leadModel();

    if(underscore.isEmpty(req.body) == true){
        return res.status(422).json(response.build('ERROR_VALIDATION', 'Create Lead fields are missing.'));
    } else {

        let leadCreateParam = {
            "mobileNumber"  : req.body.mobileNumber,
            "customerName"  : req.body.customerName,
            "address"       : req.body.address,
            "pinCode"       : req.body.pinCode,
            "city"          : req.body.city
        }
        leadModelObj.createLead(leadCreateParam, function (error, results) {
            if (error) {
                console.log("ERROR OCUURED", error);
            }
            return res.status(200).json(response.build('SUCCESS', 'Lead Created Successfully'));
        });
    }
}


/**
 * Get lead and agent mapping list
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.getLeadAllocation = function ( req, res, next) {
    console.log('getlead allocation');
    const leadModelObj = new leadModel();
    leadModelObj.getLeadAllocation(function (error, results) {
        console.log(results);
        if (error) {
            return next(response.error('ERROR_NO_DATA'));
        }
        return res.status(200).json(response.build('SUCCESS', results));
    });
}


/**
 * get un allocated lead 
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.getUnallocatedLeads = function ( req, res, next) {
    console.log('getlead allocation');
    const leadModelObj = new leadModel();

    let leadParams = {
        "rank"  : req.body.rank ,
        "limit" : req.body.limit
    }

    leadModelObj.getUnallocatedLeads(leadParams,function (error, results) {
        console.log(results);
        if (error) {
            return next(response.error('ERROR_NO_DATA'));
        }
        return res.status(200).json(response.build('SUCCESS', results));
    });
}

/**
 * get api to allocate Leads 
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.allocateLead = function ( req, res, next) {
    const leadModelObj = new leadModel();
    leadModelObj.autoAllocateLead(function (error, results) {
        if (error) {
            return next(response.error('ERROR_NO_DATA'));
        }
        return res.status(200).json(response.build('SUCCESS', results));
    });
}


/**
 * Dispose/Close lead 
 * @param {Object} Request
 * @param {Object} Response
 * @param {Callback} Next
 * @author Prerita
 * @returns {JSON}
 */
exports.disposeLead = function ( req, res, next) {
    console.log('getlead allocation');
    const leadModelObj = new leadModel();

    let leadParams = {
        "dispositionId"  : req.body.dispositionId ,
    }

    leadModelObj.updateLeadDetails(req.body.leadId,leadParams,function (error, results) {
        if (error) {
            return next(response.error('ERROR_NO_DATA'));
        }
        return res.status(200).json(response.build('SUCCESS', results));
    });
}