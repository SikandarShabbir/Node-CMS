const express = require('express');
const router = express.Router();

router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'home';
	next();
});

router.get('/', (request, response)=>{
	request.session.name = "Mr. Sikandar";
	if (request.session.name) {
		console.log(request.session);
		response.render('home/index');		
	}
});
router.get('/about', (request, response)=>{
	response.render('home/about');
});
router.get('/login', (request, response)=>{
	response.render('home/login');
});
router.get('/register', (request, response)=>{
	response.render('home/register');
});

module.exports = router;