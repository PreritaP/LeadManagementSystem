const constant   = require(__basePath + 'app/config/constants');
const database   = require(constant.path.app + 'core/database');
const BaseModel  = require(constant.path.app + 'module/model/baseModel');
const {logger}   = require(constant.path.app + 'core/logger');
const async      = require('async');
const moment 	 = require('moment');


class userModel extends BaseModel {
    constructor () {
        super();
        this.databaseObj = database.getInstance();
    };

    /**
     * @description get connection database
     */
    static get DB() {
        return {
            READSLAVE           : 'READSLAVE',
            MASTER              : 'MASTER'
        };
    }

    insertUserDetails(payload, callback) {
        let query = `
        INSERT INTO 
            lms_user_detail (userName,employeeCode,userRole,userDayBucket,userTotalBucket)
        VALUES 
            (:userName,:employeeCode,:userRole,:userDayBucket,:userTotalBucket) 
        `;

        let params = {
            userName 		: payload.userName,
            employeeCode 	: payload.employeeCode,
            userRole 		: payload.userRole,
            userDayBucket 	: payload.userDayBucket,
            userTotalBucket : payload.userTotalBucket
        };

        this.databaseObj.query(userModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }


    insertUserMappingDetails(payload, callback) {
        let query = `
        INSERT INTO 
            lms_user_group_mapping (userGroupRank,userGroupGroupId,userGroupUserId)
        VALUES 
            (:rank,:groupId,:userId) 
        `;

        let params = {
            rank 		: payload.rank,
            groupId 	: payload.groupId,
            userId 		: payload.userId
        };

        this.databaseObj.query(userModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }

    createUser(params, callback) {
    	var _this = this;

    	let userParams = {};

    	if (params.userName !== undefined && params.userName !== '') {
            userParams.userName = params.userName;
        }
        if (params.employeeCode !== undefined && params.employeeCode !== '') {
            userParams.employeeCode = params.employeeCode;
        }
        if (params.userRole !== undefined && params.userRole !== '') {
            userParams.userRole = params.userRole;
        }
        if (params.userDayBucket !== undefined && params.userDayBucket !== '') {
            userParams.userDayBucket = params.userDayBucket;
        }
        if (params.userTotalBucket !== undefined && params.userTotalBucket !== '') {
            userParams.userTotalBucket = params.userTotalBucket;
        }

        _this.insertUserDetails(userParams, function(error, results){
        	if(error){
                return callback(error); 
            }
            else {
                return callback(null , results);
            }
            return true;
        });
    }


    mapUserInGroup(params, callback) {
    	var _this = this;

    	let userParams = {};

    	if (params.rank !== undefined && params.rank !== '') {
            userParams.rank = params.rank;
        }
        if (params.groupId !== undefined && params.groupId !== '') {
            userParams.groupId = params.groupId;
        }
        if (params.userId !== undefined && params.userId !== '') {
            userParams.userId = params.userId;
        }

        _this.insertUserMappingDetails(userParams, function(error, results){
        	if(error){
                return callback(error); 
            }
            else {
                return callback(null , results);
            }
            return true;
        });
    }


    getActiveUserIngroup(groupId , callback) {
    	var _this = this;

    	let queryParams = {
            fields: [
        		"userId",
        		"employeeCode",
        		"userDayBucket",
        		"userTotalBucket"
            ],
            join : [
                {
                    type        : "INNER",
                    table       : "lms_user_detail",
                    conditions  : " userGroupUserId = userId"
                }
            ]
        };

    	let whereCondition = {
    		"userAllocationMode" : 1,
    		"userStatus" : 1,
    		"userRole" : 1,
    		"userGroupGroupId" : groupId
    	} ;

    	return this.mysqlSelect(
            "lms_user_group_mapping",
            whereCondition,
            queryParams,
            callback
        );
    }

    getUserList(roleId, callback) {
    	let whereCondition = {
    		"userRole" : roleId
    	} ;
    	return this.mysqlSelect(
            "lms_user_detail",
            whereCondition,
            {},
            callback
        );
    }

    getUserTodayAllocatedLeads(userId,callback) {
    	let queryParams = {
            fields: [
        		" count(*) as count  "
            ]
        };

    	let whereCondition = {
    		"userId" : userId,
    		"allocationTime" : {
    			"sign" :">=",
    			"value":moment().format('YYYY-MM-DD 00:00:00')}
    	} ;
    	return this.mysqlSelect(
            "lms_lead_allocation",
            whereCondition,
            queryParams,
            callback
        );

    }


    /**
     * getUserIdForAllocation : for getting userId for allocation
     */
    getUserIdForAllocation(userList , callback) {
    	var userAllocatedLeads =[];
    	var _this = this;	

    	async.eachSeries(userList,function(data,callback){ 
            let userDetails = data;
            	/* get today allocated leads for agents*/
	    		_this.getUserTodayAllocatedLeads(userDetails.userId, function(error,results) {
	    			if(error) console.log(error);
	    			let count = results[0].count;
	    			if( count == undefined) count = 0;
	    			/* check for today bucket */
	    			if(userDetails.userDayBucket > results[0].count) {
	    				let user = {
	    					userId 	: userDetails.userId ,
	    					count 	: results[0].count 
	    				}
	    				userAllocatedLeads.push(user);
	    			}
	    			
	    			callback();
		    	});

	    }, function(err, results) {
	    	if(err) return err;
	        if(userAllocatedLeads.length > 0 ) {
	        	// sort array to allocate agent who has minimum leads
	        	userAllocatedLeads = userAllocatedLeads.sort(function (a, b) {
				    return a.count > b.count ;
				});
				callback(null,userAllocatedLeads[0].userId);
	        } else {
	        	// If no agent available then alloccate to center team
	        	_this.getUserList(2, function(error, results){
	        		if(error) callback(error);
	        		callback(null,results[0].userId);
	        	});
	        }

	    });
    }

}

module.exports = userModel;