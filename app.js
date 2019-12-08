const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

const home = require('./routes/home/index');
app.use('/', home);
const admin = require('./routes/admin/index');
app.use('/admin', admin);




app.listen(4500,()=>{
	console.log("istening to 4500");
});