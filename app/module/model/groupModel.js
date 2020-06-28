const constant   = require(__basePath + 'app/config/constants');
const database   = require(constant.path.app + 'core/database');
const BaseModel  = require(constant.path.app + 'module/model/baseModel');
const {logger}   = require(constant.path.app + 'core/logger');
const async      = require('async');


class groupModel extends BaseModel {
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

    insertGroupDetails(payload, callback) {
        let query = `
        INSERT INTO 
            lms_group (groupRank,groupType)
        VALUES 
            (:groupRank,:groupType) 
        `;

        let params = {
            groupRank 		: payload.groupRank,
            groupType       : payload.groupType
        };

        this.databaseObj.query(groupModel.DB.MASTER, {
            sql   : query,
            values: params
        }, callback, {queryFormat: 'namedParameters'});
    }


    createGroup(params, callback) {
    	var _this = this;

    	let groupParams = {};

    	if (params.groupRank !== undefined && params.groupRank !== '') {
            groupParams.groupRank = params.groupRank;
        }
        if (params.groupType !== undefined && params.groupType !== '') {
            groupParams.groupType = params.groupType;
        }

        _this.insertGroupDetails(groupParams, function(error, results){
        	if(error){
                return callback(error); 
            }
            else {
                return callback(null , results);
            }
            return true;
        });
    }


    getGroupDetails(params, callback) {

        let groupParams = {};
        if (params.groupRank !== undefined && params.groupRank !== '') {
            groupParams.groupRank = params.groupRank;
        }
        if (params.groupType !== undefined && params.groupType !== '') {
            groupParams.groupType = params.groupType;
        }
        if (params.groupId !== undefined && params.groupId !== '') {
            groupParams.groupId = params.groupId;
        }

        return this.mysqlSelect(
            "lms_group",
            groupParams,
            {},
            callback
        );
    }

}

module.exports = groupModel;