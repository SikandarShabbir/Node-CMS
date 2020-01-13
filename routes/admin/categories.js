const express = require('express');
const router = express.Router();
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
	if (!request.body.name) {
		errors.push({message: "Please enter name"});
	}
	if (errors.length > 0) {
		response.render('admin/categories',{ errors: errors });
	}

	const createCategory = new Category({
		name: request.body.name
	})
	createCategory.save()
	.then( createCategory => {
		request.flash('success', 'Category Created Successfully');
		response.redirect('/admin/categories');
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/', (request, response)=>{
	Category.find({}).then( categories => {
		response.render('admin/categories', {categories: categories});		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
});

router.get('/edit/:id', (request, response)=> {
	Category.findOne({_id: request.params.id}).then( category => {
		response.render('admin/categories/edit', {category: category});		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})

router.put('/edit/:id', (request, response)=> {
	Category.findOne({_id: request.params.id}).then( category => {
		category.name = request.body.name;
		category.save().then(Category=> {
			request.flash('success','Category Updated Successfully');
			response.redirect('/admin/categories');
		})		
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})

router.delete('/delete/:id', (request, response)=> {

	Category.findOne({_id: request.params.id}).then( category => {
		category.remove();
		request.flash('success','Category Deleted Successfully');
		response.redirect('/admin/categories');	
	})
	.catch(error =>{
		console.log("Error: "+error);
	});
})



module.exports = router;