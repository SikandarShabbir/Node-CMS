const express = require('express');
const app = express();
const router = express.Router();
const Post = require('../../models/Post.js');
const Category = require('../../models/Category.js');
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const paginate = require('express-paginate');

router.all('/*', (req, res, next)=>{
	req.app.locals.layout = 'home';
	if (req.query.limit <= 10) req.query.limit = 10;
	next();
});

router.use(paginate.middleware(10, 50));
router.get('/', async (req, res, next) => {

  try { 
    const [ posts, itemCount ] = await Promise.all([
      Post.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      Post.count({})
    ]);
 
    const pageCount = Math.ceil(itemCount / req.query.limit);

    if (itemCount > 0) {
    	Category.find({}).then(categories => {
    		res.render('home/index', {
	        posts: posts,
	        pageCount,
	        itemCount,
	        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
	        categories:categories
	      });
		})
    }
 
  } catch (err) {
    next(err);
  }
 
});

// router.get('/', (req, res)=>{
// 	req.session.name = "Mr. Sikandar";

// 	Post.find({}).then(posts => {
// 		Category.find({}).then(categories =>{
// 			res.render('home/index', {posts: posts, categories:categories});
// 		})
// 	});
// });

router.get('/about', (req, res)=>{
	res.render('home/about');
});
router.get('/login', (req, res)=>{
	res.render('home/login');
});
passport.use(new localStrategy({usernameField: 'email'},(email, password, done)=>{
	User.findOne({email: email}).then(user => {
		if (!user) return done(null, false, {message: 'No user found'});
		bcrypt.compare(password, user.password, (err, matched)=>{
			if (err) return err; 
			if (matched) {
				return done(null, user);
			} else {
				return done(null, false, {message:'Incorrect Password'});
			}
		});
	});
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
router.post('/login', (req, res, next)=>{
	passport.authenticate('local',{
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash: true
	})(req,res,next);
});
router.get('/register', (req, res)=>{
	res.render('home/register');
});
router.post('/register', (req, res)=>{
	let errors = [];
	if (!req.body.firstName) {
		errors.push({message: "Please enter firstName"});
	}
	if (!req.body.lastName) {
		errors.push({message: "Please enter lastName"});
	}
	if (!req.body.email) {
		errors.push({message: "Please enter email"});
	}
	if (!req.body.password) {
		errors.push({message: "Please enter password"});
	}
	if (req.body.password != req.body.passwordConfirm) {
		errors.push({message: "Passwords dont match"});
	}
	if (errors.length > 0) {
		res.render('home/register',{ 
			errors: errors,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
		});
	}else{
		User.findOne({email: req.body.email}).then(user => {
			if (user) {
				req.flash('error', 'This user alredy exist please login.');
				res.redirect('/login');
			} else {
				const createUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				}) 
				bcrypt.genSalt(10, (err, salt)=>{
					bcrypt.hash(createUser.password, salt, (err, hash)=>{
						createUser.password = hash;
						createUser.save()
						.then( createUser => {
							req.flash('success', 'User Created Successfully please login.');
							res.render('home/login');
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
router.get('/post/:slug', (req, res)=>{
	Post.findOne({slug: req.params.slug})
	.then(post=>{
		Category.find({}).then(categories =>{
			res.render('home/post', {post: post, categories:categories});
		})		
	})
	.catch(err =>{
		console.log(err);
	})
});
router.get('/logout', (req, res) =>{
  req.logout();
  res.redirect('/');
});
module.exports = router;
