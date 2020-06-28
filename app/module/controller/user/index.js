const constants   = require(__basePath + 'app/config/constants');
const router     = require('express').Router({
    caseSensitive: true,
    strict       : true
});
const user      = require(constants.path.module + 'user/userController');

router.post('/createUser', user.createUser );
router.post('/mapUserGroup', user.mapUserInGroup );
router.post('/getActiveUserIngroup', user.getActiveUserIngroup );
router.post('/getUserByRoleId', user.getUserByRoleId );

module.exports = {
    router: router
};