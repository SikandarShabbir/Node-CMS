const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cms').then(db=>{
	console.log("Mongo Connected");
}).catch(error=>console.log(error));


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

const home = require('./routes/home/index');
app.use('/', home);

const admin = require('./routes/admin/index');
app.use('/admin', admin);

const posts = require('./routes/admin/posts');
app.use('/admin', posts);




app.listen(4500,()=>{
	console.log("istening to 4500");
});
