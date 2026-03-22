import express from 'express';


const crawRoutes = express.Router();
crawRoutes.get('/checkJob',null);
crawRoutes.get('/checkCompany', null);
crawRoutes.post('/newCompany', null);
crawRoutes.post('/newJob', null);
crawRoutes.get('/companyDetail', null);
crawRoutes.get('/jobDetail', null);
crawRoutes.put('/updateCompany', null);
crawRoutes.put('/updateJob', null);


export default crawRoutes;