const express = require('express');

//inicializaciones
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


//Como el archivo database.js es un objeto y solo podemos 
//importar el 'url' por medio del destructor ecmascript 6
const { url } = require('./config/database.js');
const methodOverride =require('method-override');

//const exphbs=require('express-handlebars');


//mongoose.connect(url,{
//useNewUrlParser:true
//});
require('./config/database')


require('./config/passport')(passport);
//**********************************************
//*********************settings*****************

app.set('port', process.env.PORT || 3000);
app.set('appName','Eva');
app.set('views',path.join(__dirname,'views'));
//configura el motor de plantilla que es EJS, agrega a la extenciones ejs
app.set('view engine','ejs');

app.use(methodOverride('_method'));

//**********************************************
//******************middleware******************
//Mensajes en consola
app.use(morgan('dev'));
//Manejo y conversión de cookies
app.use(cookieParser());
// la información que reciba de los formularios 
//se trabajara por la url
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
	secret:'cristianseremosmillonarios',
	resave: true,
	saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use
//**********************************************
////*****************routes*********************

require('./app/routes')(app,passport);

//**********************************************
//*****************static files*****************

app.use(express.static(path.join(__dirname,'public')));

app.listen(app.get('port'), ()=>{
  console.log(app.get('appName'), 'on port', app.get('port'));
});
