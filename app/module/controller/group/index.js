const constants   = require(__basePath + 'app/config/constants');
const router     = require('express').Router({
    caseSensitive: true,
    strict       : true
});
const group      = require(constants.path.module + 'group/groupController');

router.post('/createGroup',group.createGroup);
router.get('/getAutoAllocationGroups',group.getAutoAllocationGroups);

module.exports = {
    router: router
};