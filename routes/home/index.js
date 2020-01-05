const express = require('express');
const router = express.Router();
const Post = require('../../models/Post.js');
const Category = require('../../models/Category.js');
router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'home';
	next();
});

router.get('/', (request, response)=>{
	request.session.name = "Mr. Sikandar";
	Post.find({}).then(posts => {
		Category.find({}).then(categories =>{
			response.render('home/index', {posts: posts, categories:categories});
		})
	});
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
router.get('/post/:id', (request, response)=>{
	Post.find({_id: request.params.id})
	.then(post=>{
		Category.find({}).then(categories =>{
			response.render('home/post', {post: post, categories:categories});
		})		
	});
});

module.exports = router;
