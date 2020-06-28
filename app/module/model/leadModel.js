const constant   = require(__basePath + 'app/config/constants');
const database   = require(constant.path.app + 'core/database');
const BaseModel  = require(constant.path.app + 'module/model/baseModel');
const userModel     = require(constant.path.app + 'module/model/userModel');
const groupModel    = require(constant.path.app + 'module/model/groupModel');
const {logger}   = require(constant.path.app + 'core/logger');
const async      = require('async');

class leadModel extends BaseModel {
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


    insertLeadDetails(payload, callback) {
        let query = `
        INSERT INTO 
            lms_lead_detail (mobileNumber,customerName,address,pinCode,city,rank)
        VALUES 
            (:mobile,:customerName,:address,:pinCode,:cityId,:rank) 
        `;

        let params = {
            mobile          : payload.mobileNumber,
            customerName    : payload.customerName,
            address         : payload.address,
            pinCode         : payload.pinCode,
            cityId          : payload.cityId,
            rank            : payload.rank
        };

        this.databaseObj.query(leadModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }

    updateLeadDetails(leadId,params, callback) {
        let whereCondition = {
            "leadId" : leadId
        }

        let leadParams ={};

        if (params.allocatedTo !== undefined && params.allocatedTo !== '') {
            leadParams.allocatedTo = params.allocatedTo;
        }
        if (params.customerName !== undefined && params.customerName !== '') {
            leadParams.customerName = params.customerName;
        }
        if (params.address !== undefined && params.address !== '') {
            leadParams.address = params.address;
        }
        if (params.pinCode !== undefined && params.pinCode !== '') {
            leadParams.pinCode = params.pinCode;
        }
        if (params.city !== undefined && params.city !== '') {
            leadParams.city = params.city;
        }
        if (params.dispositionId !== undefined && params.dispositionId !== '') {
            leadParams.dispositionId = params.dispositionId;
        }
        
        return this.mysqlUpdate(
            "lms_lead_detail",
            leadParams,
            whereCondition,
            callback
        );
    }


    insertLeadAllocationDetails(payload, callback) {
        let query = `
        INSERT INTO 
            lms_lead_allocation (leadId,userId,allocationBy)
        VALUES 
            (:leadId,:userId,:allocationBy) 
        `;

        let params = {
            leadId          : payload.leadId,
            userId          : payload.userId,
            allocationBy    : payload.allocationBy
        };

        this.databaseObj.query(leadModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }

    createLead(params , callback) {
        var _this = this;
        let requestBody = params;
        let leadParams = {};

        if (params.mobileNumber !== undefined && params.mobileNumber !== '') {
            leadParams.mobileNumber = params.mobileNumber;
        }
        if (params.customerName !== undefined && params.customerName !== '') {
            leadParams.customerName = params.customerName;
        }
        if (params.address !== undefined && params.address !== '') {
            leadParams.address = params.address;
        }
        if (params.pinCode !== undefined && params.pinCode !== '') {
            leadParams.pinCode = params.pinCode;
        }
        if (params.city !== undefined && params.city !== '') {
            leadParams.city = params.city;
        }

        let cityDetail = {
            cityId : async.apply(getCityIdFromCityName,leadParams.city )
        };

        async.series(
            cityDetail
            ,function (error,cityResult){
                if(error) {
                    return callback(error);
                }

                leadParams.cityId   = cityResult.cityId[0].cityId;
                leadParams.rank     = cityResult.cityId[0].cityId;
                _this.insertLeadDetails(
                    leadParams,
                    function (error, result) {
                        if(error){
                            return callback(error); 
                        }
                        else {
                            return callback(null , true);
                        }
                        return true;
                    }
                );
            }
        );

        function getCityIdFromCityName(cityName, callback) {
            _this.mysqlSelect('lms_city_master', {"cityName":cityName}, {"fields":"cityId"}, function (err, cityData) {
                /* Throw error while error occurred */
                if( err ) return callback(err);
                return callback(null,cityData);
            });
        }
    }

    getLeadAllocation(callback) {
        let queryParams = {
            fields: [
                "allocation.leadId as LEAD", 
                "leadDetail.mobileNumber as CONTACT", 
                "leadDetail.customerName as CUSTOMER", 
                "leadDetail.city as CITY", 
                "userDetail.userName as AGENT"
            ],
            join : [
                {
                    type        : "LEFT",
                    table       : "lms_lead_detail leadDetail",
                    conditions  : " allocation.leadID = leadDetail.leadId"
                },
                {
                    type        : "LEFT",
                    table       : "lms_user_detail userDetail",
                    conditions  : " allocation.userId = userDetail.userId"
                }
            ]
        };
        return this.mysqlSelect(
            "lms_lead_allocation allocation",
            {},
            queryParams,
            callback
        );
    }


    getUnallocatedLeads(params, callback) {
        let queryParams = {
            limit: params.limit 
        };
        let whereCondition = {
            "allocatedTo" : {
                "sign" : "is",
                "value": null
            },
            "rank" : params.rank,
        }

        return this.mysqlSelect(
            "lms_lead_detail",
            whereCondition,
            queryParams,
            callback
        );
    }
    /**
     * autoAllocateLead: Auto allocation Leads
     *
     */
    autoAllocateLead(callback) {
        var _this = this;
        const userModelObj  = new userModel();
        const groupModelObj = new groupModel();  


        /* Fetch all auto allocation mode groups*/
        async.waterfall([
            function processAutoAllocationGroups(callback) {
                    let groupParam = {
                        "groupType"         : 1
                    }
                    groupModelObj.getGroupDetails(groupParam, function (error, results){
                        if (error) {
                            console.log("ERROR OCUURED", error);
                        }
                        return callback(null,results)
                    });
            }
        ], function (error, result) {
            if (error) {
                callback(error);
            }
            for (var i = result.length - 1; i >= 0; i--) {
                async.series({
                    userList : async.apply(processUserList, result[i].groupId),
                    leadList : async.apply(processLeadList, result[i].groupId),
                },function(error , allocationDetails ) {
                    if(error) return callback(error);
                    let leadDetails     = allocationDetails.leadList ;
                    if(leadDetails.length > 0) {
                        for (var i = 0; i<leadDetails.length ; i++ ) {
                            let leadId = leadDetails[i].leadId;
                            // Fetching userId to allocate Lead
                            userModelObj.getUserIdForAllocation(allocationDetails.userList,function(error, userId) {
                                if(error) return callback(error);

                                let leadAllocationParams = {
                                    "leadId" : leadId,
                                    "userId" : userId,
                                    "allocationBy" : "System"
                                }
                                // Allocate Lead to user
                                _this.insertLeadAllocationDetails(
                                    leadAllocationParams,
                                    function (error, result) {
                                        if(error) return callback(error);
                                        let leadParams = {
                                            allocatedTo : userId
                                        }
                                        // Update Lead
                                        _this.updateLeadDetails(leadAllocationParams.leadId, leadParams, function (error , results) {
                                            if(error) return error;
                                            return callback(null, true);
                                        });
                                    }
                                );
                            });
                        }
                    } else {
                       //return callback(null,true);
                    }
                });
            }
        });

        /*For fetching all mapped user in a group that are auto mode*/
        function processUserList(groupId , callback) {
            userModelObj.getActiveUserIngroup(groupId , function (error , userList) {
                if (error) {
                    console.log("ERROR OCUURED", error);
                    return callback(error);
                }
                return callback(null,userList);
            });
        }
        /*Fetch Leads in a groups*/
        function processLeadList(groupId , callback) {
            let leadParams = {
                "rank"  : groupId ,
                "limit" : 5
            }
            _this.getUnallocatedLeads( leadParams, function (error , leadList) {
                if (error) {
                    console.log("ERROR OCUURED", error);
                    return callback(error);
                }
                return callback(null,leadList);
            });
        }
    }

}

module.exports = leadModel;
