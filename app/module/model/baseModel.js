const constant   = require(__basePath + 'app/config/constants');
const underscore = require('underscore');
const database   = require(constant.path.app + 'core/database');
const exceptions = require(constant.path.app + 'core/exception');


class BaseModel {

    constructor() {
        this.databaseObj = database.getInstance();
    }

    get CONNECTIONNAME() {
        return {
            READSLAVE: 'READSLAVE',
            MASTER   : 'MASTER'
        };
    }

    /*
     * @description Generic Select from mysql
     * 
     * @example 
     * let params = {
            join:[
                {table: 'roleUser', type: 'left', conditions: 'roleUser.userId = users.id'}
            ],
            limit: 70, 
            orderBy: 'email DESC', 
        };
        let conditions = {
            'users.id': 2,
            'users.email': ['abc@gmail.com', 'bcd@gmail.com'],
        };
    
        model.mysqlSelect('users', conditions, params, function (err, results) {
            //Do something with result and error
        });
    
        #Query
        SELECT * FROM users LEFT JOIN roleUser ON roleUser.userId = users.id 
            WHERE 1 AND users.id = 2 AND users.email IN ('abc@gmail.com', 'bcd@gmail.com')
            ORDER BY email DESC limit 70
     */
    mysqlSelect(table, conditions = {}, params = {}, callback) {
        let queryValues = [];

        params.fields = params.fields || '*';

        let sql = `
            SELECT 
                ${params.fields}
            FROM 
                ${table} `;

        if (params.join) {
            underscore.each(params.join, function (value) {
                value.type = value.type || 'FULL';

                sql += `
                    ${value.type} JOIN 
                        ${value.table} 
                    ON 
                        ${value.conditions}
                    `;
            });
        }

        sql += ` WHERE 1`;

        if (false === underscore.isEmpty(conditions)) {
            underscore.each(conditions, function (value, index) {
                if (underscore.isArray(value)) {
                    sql += ` AND ${index} IN (?) `;
                    queryValues.push(value);
                } else if (underscore.isObject(value)) {
                    sql += ` AND ${index} ${value.sign} ? `;
                    queryValues.push(value.value);
                } else {
                    sql += ` AND ${index} = ? `;
                    queryValues.push(value);
                }
            });
        }
        //Adding  Group By if exist
        sql += params.groupBy ? ` GROUP BY ${params.groupBy} ` : '';

        //Adding  Order By if exist
        sql += params.orderBy ? ` ORDER BY ${params.orderBy} ` : '';

        //Adding Limit
        sql += params.limit ? ` LIMIT ${params.limit}` : '';
        //console.log(sql);
        return this.databaseObj.query(this.CONNECTIONNAME.READSLAVE, {
            sql   : sql,
            values: queryValues
        }, callback);
    };


    /*
     * @description Generic Insert for mysql
     * 
     * @example 
        let data = {
            'id': 2,
            'email': abc@gmail.com,
        };
    
        model.mysqlInsert('users', data, function (err, results) {
            //Do something with result and error
        });
    
        #Query
        Insert into users SET id = 2, email=abc@gmail.com
     */
    mysqlInsert(table, data = {}, callback) {
        let sql = `
            INSERT INTO
                ${table}
            SET ?
        `;

        return this.databaseObj.query(this.CONNECTIONNAME.MASTER, {
            sql   : sql,
            values: data
        }, callback);
    }

    /*
     * @description Generic update for mysql
     * 
     * @example 
        let data = {
            'id': 2,
            'email': abc@gmail.com,
        };
    
        model.mysqlInsert('users', data, function (err, results) {
            //Do something with result and error
        });
    
        #Query
        Insert into users SET id = 2, email=abc@gmail.com
     */
    mysqlUpdate(table, data = {}, conditions = {}, callback) {
        if (underscore.isEmpty(conditions)) {
            return callback(new exceptions.UpdateConditionsNotFoundException);
        }

        let sql = `
            UPDATE
                ${table}
            SET 
                ?
            WHERE
                ?
        `;

        return this.databaseObj.query(this.CONNECTIONNAME.MASTER, {
            sql   : sql,
            values: [
                data, conditions
            ]
        }, callback);
    }

}

module.exports = BaseModel;
