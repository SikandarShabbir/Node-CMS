const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const {isEmpty, uploadDir} = require('../../helpers/upload_helper.js');

router.all('/*', (request, response, next)=>{
	request.app.locals.layout = 'admin';
	next();
});

router.post('/create', (request, response)=>{
	let errors = [];
	if (!request.body.title) {
		errors.push({message: "Please enter title"});
	}
	if (!request.body.body) {
		errors.push({message: "Please enter body"});
	}
	if (errors.length > 0) {
		response.render('admin/posts/create',{ errors: errors });
	}

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
		category: request.body.category,
		allowComments: allowComments,
		body: request.body.body,
		file: fileName
	})
	createPost.save()
	.then( postCreated => {
		request.flash('success', 'Post Created Successfully');
		console.log("Success: "+postCreated);
		response.redirect('/admin/posts');
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/create', (request, response)=>{
	Category.find({}).then(categories =>{
			response.render('admin/posts/create', {categories:categories});
		})
});

router.get('/', (request, response)=>{
	Post.find({})
	.populate('category')
	.then( posts => {
		response.render('admin/posts', {posts: posts});		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/edit/:id', (request, response)=> {
	Post.findOne({_id: request.params.id}).then( post => {
		Category.find({}).then(categories =>{
			response.render('admin/posts/edit', {categories:categories, post: post});
		})		
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
		post.category = request.body.category;
		post.allowComments = allowComments;
		post.body = request.body.body;

		if (!isEmpty(request.files)) {		
			let file = request.files.file;
			fileName = Date.now()+'-'+file.name;
			post.file = fileName;
			file.mv('./public/uploads/' + fileName , (error)=>{
				if (error) {throw error;}
			});		
		}
		post.save().then(updatedPost=> {
			console.log(updatedPost);
			request.flash('success','Post Updated Successfully');
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
		request.flash('success','Post Deleted Successfully');
		response.redirect('/admin/posts');	
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})



module.exports = router;