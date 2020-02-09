const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(db => {
	console.log("Connection established");
}).catch( error => { console.log(error);});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(upload());
app.use(methodOverride('_method'));
const {select, generateDate} = require('./helpers/helpers.js');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select:select, generateDate: generateDate}}));
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'secret key',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
	res.locals.user = req.user || null;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

app.listen(4500,()=>{
	console.log("istening to 4500");
});
