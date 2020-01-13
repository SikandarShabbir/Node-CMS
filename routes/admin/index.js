const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');

router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'admin';
	next();
});
router.get('/', (request, response)=>{
	response.render('admin/index');
});
router.get('/dashboard', (request, response)=>{
	response.render('home/dashboard');
});

router.post('/generateFakePosts', (request, response)=> {
	for (var i = 0; i < request.body.number; i++) {
		let post = new Post();
		post.title = faker.name.title();	
		post.status = "public";
		post.allowComments = faker.random.boolean();	
		post.body = faker.lorem.sentence();	
		post.save().then(savePost=>{});		
	}
	response.redirect('/admin/posts');
})
module.exports = router;