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

mongoose.connect('mongodb://localhost:27017/cms', { useNewUrlParser: true }).then(db => {
	console.log("Connection established");
}).catch( error => { console.log(error);});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(upload());
app.use(methodOverride('_method'));
const {select} = require('./helpers/helpers.js');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select:select}}));
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'secret key',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(flash());
app.use((request, response, next)=>{
	response.locals.success = request.flash('success');
	next();
});

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

app.listen(4500,()=>{
	console.log("istening to 4500");
});