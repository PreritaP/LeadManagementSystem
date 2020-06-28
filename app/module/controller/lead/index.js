const constants   = require(__basePath + 'app/config/constants');
const router     = require('express').Router({
    caseSensitive: true,
    strict       : true
});

const leadCont = require(constants.path.module + 'lead/leadController');
router.post('/createLead', leadCont.createLead);
router.get('/getLeadAllocation', leadCont.getLeadAllocation);
router.get('/allocateLead', leadCont.allocateLead);
router.post('/disposeLead', leadCont.disposeLead);

module.exports = {
    router: router
};
