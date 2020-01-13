
const express = require('express');
const router = express.Router();

router.all('/*', (request, response, next)=>{
    request.app.locals.layout = 'admin';
    next();
});
router.get('/', (request, response)=>{
    response.render('admin/index');
});
router.get('/create', (request, response)=>{
    response.render('home/dashboard');
});

module.exports = router;
