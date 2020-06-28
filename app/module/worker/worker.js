const constants 	= require(__basePath + '/app/config/constants');
const response 		= require(constants.path.app + 'util/response');
const underscore    = require('underscore');
const leadModel     = require(constants.path.app + 'module/model/leadModel');
const userModel  	= require(constant.path.app + 'module/model/userModel');
const groupModel 	= require(constant.path.app + 'module/model/groupModel');
const cron 			= require('node-cron');

const leadModelObj 	= new leadModel();
const userModelObj 	= new userModel();
const groupModelObj = new groupModel();   

/**
 * Cron jobs to allocate leads
 * 
 * @author Prerita
 */
const autoAllocateLead = function(callback) {
	leadModelObj.autoAllocateLead(function (error, results) {
        if (error) {
        	callback(error);
        }
        callback(null,true);
    });
}

// get lead from redis
getLeadAllocateTask = cron.schedule('* * * * *', function() {
	autoAllocateLead(function(error, result){
		logger.info("[%s] Lead Allocated in every minute",'autoAllocateLead');
	});
}, false);

//TO start Cron Job
//getLeadAllocateTask.start();