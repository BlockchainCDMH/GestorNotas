//Contiene las direcciones de nuestras bases
//de datos centralizadas, en este caso 'url'
//es nuestra base de datos para el login

const mongoose=require ('mongoose');

mongoose.connect('mongodb://localhost/loginnode',{
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
})
.then(db=> console.log('La base de datos se conecto'))
.catch(err => console.error(err));
