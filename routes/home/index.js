const express = require('express');
const router = express.Router();
const Post = require('../../models/Post.js');
const Category = require('../../models/Category.js');
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
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
router.post('/register', (request, response)=>{
	let errors = [];
	if (!request.body.firstName) {
		errors.push({message: "Please enter firstName"});
	}
	if (!request.body.lastName) {
		errors.push({message: "Please enter lastName"});
	}
	if (!request.body.email) {
		errors.push({message: "Please enter email"});
	}
	if (!request.body.password) {
		errors.push({message: "Please enter password"});
	}
	if (request.body.password != request.body.passwordConfirm) {
		errors.push({message: "Passwords dont match"});
	}
	if (errors.length > 0) {
		response.render('home/register',{ 
			errors: errors,
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			email: request.body.email,
		});
	}else{
		User.findOne({email: request.body.email}).then(user => {
			if (user) {
				request.flash('error', 'This user alredy exist please login.');
				response.redirect('/login');
			} else {
				const createUser = new User({
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				email: request.body.email,
				password: request.body.password,
				}) 
				bcrypt.genSalt(10, (err, salt)=>{
					bcrypt.hash(createUser.password, salt, (err, hash)=>{
						createUser.password = hash;
						createUser.save()
						.then( createUser => {
							request.flash('success', 'User Created Successfully please login.');
							console.log("Success: "+createUser);
							response.render('home/login');
						})
						.catch(error =>{
							console.log("Error: "+error);
						});
					})
				})
			}
		});
		
		
	}

	
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
