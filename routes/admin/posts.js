
const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'admin';
	next();
});
router.post('/create', (request, response)=>{
	let allowComments;
	if (request.body.allowComments) {
		allowComments = true;
	} else {
		allowComments = false;
	}
	const createPost = Post({
		title: request.body.title,
		status: request.body.status,
		allowComments: allowComments,
		body: request.body.body
	})
	createPost.save()
	.then( postCreated => {
		console.log("Success: "+postCreated);})
	.catch(error =>{
		console.log("Error: "+error);
	});
});
router.get('/create', (request, response)=>{
	response.render('admin/posts/create');
});


module.exports = router;