
const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const {isEmpty, uploadDir} = require('../../helpers/upload_helper.js');

router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'admin';
	next();
});

router.post('/create', (request, response)=>{
	let fileName = '';
	if (!isEmpty(request.files)) {		
		let file = request.files.file;
		fileName = Date.now()+'-'+file.name;
		file.mv('./public/uploads/' + fileName , (error)=>{
			if (error) {throw error;}
		});		
	}
	let allowComments;
	if (request.body.allowComments) {
		allowComments = true;
	} else {
		allowComments = false;
	}
	const createPost = new Post({
		title: request.body.title,
		status: request.body.status,
		allowComments: allowComments,
		body: request.body.body,
		file: fileName
	})
	createPost.save()
	.then( postCreated => {
		console.log("Success: "+postCreated);
		response.redirect('/admin/posts');
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/create', (request, response)=>{
	response.render('admin/posts/create');
});

router.get('/', (request, response)=>{
	Post.find({}).then( posts => {
		response.render('admin/posts', {posts: posts});		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/edit/:id', (request, response)=> {
	Post.findOne({_id: request.params.id}).then( post => {
		response.render('admin/posts/edit', {post: post});		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})

router.put('/edit/:id', (request, response)=> {
	Post.findOne({_id: request.params.id}).then( post => {
		let allowComments;
		if (request.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}
		post.title = request.body.title;
		post.status = request.body.status;
		post.allowComments = allowComments;
		post.body = request.body.body;
		post.save().then(updatedPost=> {
			console.log(updatedPost);
			response.redirect('/admin/posts');
		})		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})

router.delete('/delete/:id', (request, response)=> {

	Post.findOne({_id: request.params.id}).then( post => {
		fs.unlink(uploadDir + post.file, (error)=>{});
		post.remove();
		response.redirect('/admin/posts');	
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})



module.exports = router;