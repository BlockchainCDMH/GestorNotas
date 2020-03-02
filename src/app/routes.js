const passport = require('passport');
const Users = require('./models/user');
const materia = require('./models/user');

module.exports = (app, passport) => {


	//Rutas de administrador

	app.get('/index', (req, res) => {
		res.render('index', {
			success_msg: req.flash('loginMessage')
		});
	});

	app.get('/', (req, res) => {
		res.render('index', {
			success_msg: req.flash('loginMessage')
		});
	});


	app.post('/logina', passport.authenticate('admin-login', {
		successRedirect: '/a',
		failureRedirect: '/',
		failureFlash: true // allow flash messages
	}));


	app.get('/login', (req, res) => {
		res.render('index', {
			success_msg: req.flash('loginMessage')
		});
	});

	app.get('/a', isLoggedIn, (req, res) => {
		res.render('a');
	});



	app.get('/a1', isLoggedIn, (req, res) => {
		res.render('a1', {
			user: req.user
		});
	});

	app.get('/ad', isLoggedIn, (req, res) => {
		res.render('ad');
	});

	app.post('/ada', isLoggedIn, passport.authenticate('teacher-add', {
		session: false,
		successRedirect: '/a1',
		failureRedirect: '/ada',
		failureFlash: true // allow flash messages
	}));

	app.get('/ada', isLoggedIn, (req, res) => {
		res.render('ada', {
			success_msg: req.flash('signupMessage')
		});
	});

	app.get('/adb', isLoggedIn, async (req, res) => {
		const docentes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		res.render('adb', { docentes: docentes });
	});
	app.get('/adb/:user_id', isLoggedIn, async (req, res) => {
		const docentes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		res.render('adc', { docentes: docentes });
	});

	app.get('/adc', isLoggedIn, async (req, res) => {
		const docentes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		res.render('adc', { docentes: docentes });
	});

	app.get('/adc/:user_id', isLoggedIn, async (req, res) => {
		const user = await Users.find({ _id: req.params.user_id });
		const cursos = await Users.find({ "materia.profesor": user[0].teacher.nombre });
		res.render('adc2', { user: user, cursos: cursos });
	});

	app.get('/adc2/:user_id/:materia_id', isLoggedIn, async (req, res) => {
		const materias = await Users.find({ _id: req.params.materia_id });
		const MateriasEstudiantes = await Users.find({ 'materiaEstudiante.materiaid': req.params.materia_id });
		MateriasEstudiantes.sort();
		const usuario = await Users.findOne({ _id: req.params.user_id });
		var Estudiantes = []
		for (let i = 0; i < MateriasEstudiantes.length; i++) {
			var MateriaEstudiante = MateriasEstudiantes[i];
			var Estudiante = await Users.findById(MateriaEstudiante.materiaEstudiante.estudianteid);
			Estudiantes.push(Estudiante);
		}
		res.render('adc3', { materias: materias, usuario: usuario, Estudiantes: Estudiantes });
	});

	app.get('/addadmin', isLoggedIn, (req, res) => {
		res.render('addadmin');
	});

	app.post('/addad', passport.authenticate('admin-add', {
		session: false,
		successRedirect: '/index',
		failureRedirect: '/addadmin',
		failureFlash: true // allow flash messages
	}));

	app.get('/ae', isLoggedIn, (req, res) => {
		res.render('ae');
	});

	app.get('/aea', isLoggedIn, (req, res) => {
		res.render('aea', {
			success_msg: req.flash('signupMessage')
		});
	});

	app.post('/aea', isLoggedIn, passport.authenticate('student-add', {
		session: false,
		successRedirect: '/ae',
		failureRedirect: '/aea',
		failureFlash: true // allow flash messages
	}));

	app.get('/aec', isLoggedIn, async (req, res) => {
		const estudiante = await Users.find({ 'student.nombre': { $regex: ".*" } })
		res.render('aec', { students: estudiante });
	});

	app.get('/aec/:user_id', isLoggedIn, async (req, res) => {
		const usuario = await Users.find({ _id: req.params.user_id });
		const materias = await Users.find({ 'materiaEstudiante.estudianteid': usuario[0]._id });
		var arrayMaterias = [];

		for (let i = 0; i < materias.length; i++) {
			const element = materias[i];
			var miVar = await Users.findById(element.materiaEstudiante.materiaid);
			arrayMaterias.push(miVar);

		}
		res.render('aec2', { user: usuario, arrayMaterias: arrayMaterias });
	});

	app.get('/aec2/:user_id', isLoggedIn, async (req, res) => {
		const user = await Users.find({ _id: req.params.user_id });
		const materiasestudiantes = await Users.find({ 'materiaEstudiante.estudianteid': req.params.user_id });
		const AllMaterias = await Users.find({ 'materia.nombre': { $regex: ".*" } })
		var MateriasVistas = [];
		for (let i = 0; i < materiasestudiantes.length; i++) {
			const materiaEstudiante = materiasestudiantes[i];
			var IdMateria = await Users.findById(materiaEstudiante.materiaEstudiante.materiaid);
			MateriasVistas.push(IdMateria);
		}

		var MateriasNoInscritas = [];
		for (let i = 0; i < AllMaterias.length; i++) {
			const CAllMaterias = AllMaterias[i];
			var a = 0;
			for (let j = 0; j < MateriasVistas.length; j++) {
				const CMateriasVistas = MateriasVistas[j];
				if (String(CAllMaterias._id) == String(CMateriasVistas._id)) {
					a = 1;
				}

			}
			if (a == 1) { }
			else {
				var miVar = await Users.findById(CAllMaterias._id);
				MateriasNoInscritas.push(miVar)
			}
		}

		res.render('aec3', { user: user, materias: MateriasNoInscritas });
	});

	app.get('/aec3/:usuario_id/:materia_id', isLoggedIn, async (req, res) => {
		const user = await Users.find({ _id: req.params.usuario_id });
		const materias = await Users.find({ 'materia.nombre': { $regex: ".*" } });
		var newUser = new Users();
		newUser.materiaEstudiante.estudianteid = req.params.usuario_id;
		newUser.materiaEstudiante.materiaid = req.params.materia_id;
		newUser.save();
		res.render('aec3', { user: user, materias: materias });
	});



	app.get('/aec4/:usuario_id/:materia_id', isLoggedIn, async (req, res) => {
		const profes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		var profesores = [];
		for (let j = 0; j < profes.length; j++) {
			const prueba = profes[j];
			profesores[j] = [prueba.teacher.nombre, prueba._id];
		}
		const user = await Users.findById(req.params.usuario_id);
		var materia = await Users.findById(req.params.materia_id);
		res.render('aec4', { materia: materia, user: user, profesores: profesores });
	});

	app.get('/am', isLoggedIn, (req, res) => {
		res.render('am');
	});

	app.get('/ama', isLoggedIn, async (req, res) => {
		const profesor = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		res.render('ama', {
			profesor: profesor,
			success_msg: req.flash('signupMessage')
		});
	});


	app.post('/ama', isLoggedIn, passport.authenticate('materia-add', {
		session: false,
		successRedirect: '/am',
		failureRedirect: '/ama',
		failureFlash: true // allow flash messages
	}));


	app.get('/amm', isLoggedIn, async (req, res) => {
		const materias = await Users.find({ 'materia.nombre': { $regex: ".*" } });
		res.render('amm', { materias: materias });
	});


	app.get('/amm2/:materia_id', isLoggedIn, async (req, res) => {
		const materia = await Users.findById(req.params.materia_id);
		const profesores = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		const Alumnos = await Users.find({ 'materiaEstudiante.materiaid': req.params.materia_id });

		var Arrayestudiantes = [];
		for (let i = 0; i < Alumnos.length; i++) {
			const element = Alumnos[i];
			var miVar = await Users.findById(element.materiaEstudiante.estudianteid);
			Arrayestudiantes.push(miVar);
		}
		Arrayestudiantes.sort();

		res.render('amm2', { materias: materia, profesores: profesores, estudiantes: Arrayestudiantes });
	});

	app.get('/amm2v2/:materia_id/:profesor_id', isLoggedIn, async (req, res) => {
		const profesores = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		const Alumnos = await Users.find({ 'materiaEstudiante.materiaid': req.params.materia_id });
		var Arrayestudiantes = [];
		for (let i = 0; i < Alumnos.length; i++) {
			const element = Alumnos[i];
			var miVar = await Users.findById(element.materiaEstudiante.estudianteid);
			Arrayestudiantes.push(miVar);
		}
		await Users.findByIdAndUpdate(req.params.materia_id,
			{ $set: { "materia.profesor": req.params.profesor_id } }, async (error, resp) => {
				const materia = await Users.findById(req.params.materia_id);
				res.render('amm2', { materias: materia, profesores: profesores, estudiantes: Arrayestudiantes });
			});

	});

	app.get('/amm3/:materia_id', isLoggedIn, async (req, res) => {
		const materia = await Users.findById(req.params.materia_id);
		const Alumnos = await Users.find({ 'materiaEstudiante.materiaid': req.params.materia_id })
		const AllStudents = await Users.find({ 'student.nombre': { $regex: ".*" } })

		var Arrayestudiantes = [];
		for (let i = 0; i < Alumnos.length; i++) {
			const element = Alumnos[i];
			var miVar = await Users.findById(element.materiaEstudiante.estudianteid);
			Arrayestudiantes.push(miVar);
		}

		var ArrayAllStudents = [];
		for (let i = 0; i < AllStudents.length; i++) {
			const CAllStudents = AllStudents[i];
			var a = 0;
			for (let j = 0; j < Arrayestudiantes.length; j++) {
				const CArrayestudiantes = Arrayestudiantes[j];
				if (String(CAllStudents._id) == String(CArrayestudiantes._id)) {
					a = 1;
				}

			}
			if (a == 1) { }
			else {
				var miVar = await Users.findById(CAllStudents._id);
				ArrayAllStudents.push(miVar)
			}
		}

		res.render('amm3', { materias: materia, estudiantes: Arrayestudiantes, AllStudents: ArrayAllStudents });
	});

	app.post('/amm4/:materia_id', isLoggedIn, async (req, res, done) => {
		const IdStudents = req.body;
		const materias = await Users.find({ 'materia.nombre': { $regex: ".*" } });
		var IdMateria = await Users.findById(req.params.materia_id);
		var IdMateria = IdMateria._id;
		if (typeof (IdStudents.nombre) === "string") {
			var newMateriaStudent = new Users();
			newMateriaStudent.materiaEstudiante.estudianteid = IdStudents.nombre;
			newMateriaStudent.materiaEstudiante.materiaid = IdMateria;
			newMateriaStudent.save()
		} else {
			for (let i = 0; i < IdStudents.nombre.length; i++) {
				const IdStudent = IdStudents.nombre[i];
				var newMateriaStudent = new Users();
				newMateriaStudent.materiaEstudiante.estudianteid = IdStudent;
				newMateriaStudent.materiaEstudiante.materiaid = IdMateria;
				newMateriaStudent.save()
			}
		}

		for (let i = 0; i < IdStudents.nombre.length; i++) {
			const IdStudent = IdStudents.nombre[i];
			var newMateriaStudent = new Users();
			newMateriaStudent.materiaEstudiante.estudianteid = IdStudent;
			newMateriaStudent.materiaEstudiante.materiaid = IdMateria;
		}
		res.render('amm', { materias: materias });
	});

	app.get('/logout', isLoggedIn, (req, res) => {
		req.logout();
		res.redirect('/index');
	});

	// Rutas de docente

	app.get('/d', isLoggedInD, (req, res) => {
		res.render('d', {
			user: req.user
		});
	});

	app.get('/d1', isLoggedInD, (req, res) => {
		res.render('d1', {
			user: req.user
		});
	});

	app.get('/dc/:user_id', isLoggedInD, async (req, res) => {
		const usuario = await Users.find({ _id: req.params.user_id });
		const materias = await Users.find({ 'materia.profesor': usuario[0].teacher.nombre });

		var Numestudiantes = [];

		for (let i = 0; i < materias.length; i++) {
			const element = materias[i];
			var miVar = await Users.find({ 'materiaEstudiante.materiaid': element._id });
			Numestudiantes.push(miVar.length);

		}
		res.render('dc', { user: usuario, arrayMaterias: materias, Numestudiantes: Numestudiantes });
	});

	app.get('/dc1/:user_id/:materia_id', isLoggedInD, async (req, res) => {
		const usuario = await Users.find({ _id: req.params.user_id });
		const materias = await Users.find({ _id: req.params.materia_id });
		const estudiantes = await Users.find({ 'materiaEstudiante.materiaid': req.params.materia_id })
		estudiantes.sort();
		var Arrayestudiantes = [];
		var ArrayestudiantesId = [];
		for (let i = 0; i < estudiantes.length; i++) {
			const element = estudiantes[i];
			ArrayestudiantesId.push(element.materiaEstudiante.estudianteid);
			var miVar = await Users.findById(element.materiaEstudiante.estudianteid);
			Arrayestudiantes.push(miVar);
		}
		res.render('dc1', { user: usuario, arrayMaterias: materias, students: Arrayestudiantes, IdStudents: ArrayestudiantesId });
	});

	app.get('/dc2/:materia_id/:user_id', isLoggedInD, async (req, res) => {
		const materias = await Users.find({ _id: req.params.materia_id });
		const usuario = await Users.find({ _id: req.params.user_id });
		res.render('dc2', { materia: materias, user: usuario });
	});

	app.get('/dc3/:materia_id/:user_id', isLoggedInD, async (req, res) => {

		const materias = await Users.find({ _id: req.params.materia_id });
		const usuario = await Users.find({ _id: req.params.user_id });
		res.render('dc3', { materia: materias, user: usuario, profe: req.user });
	});

	app.get('/dc4/:usuario_id/:materia_id', isLoggedIn, async (req, res) => {
		const profes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		var profesores = [];
		for (let j = 0; j < profes.length; j++) {
			const prueba = profes[j];
			profesores[j] = [prueba.teacher.nombre, prueba._id];
		}
		const user = await Users.findById(req.params.usuario_id);
		var materia = await Users.findById(req.params.materia_id);
		res.render('dc4', { materia: materia, user: user, profesores: profesores });
	});

	app.get('/e', isLoggedIn, (req, res) => {
		res.render('e', {
			user: req.user
		});
	});

	app.get('/e1', isLoggedIn, (req, res) => {
		res.render('e1', {
			user: req.user
		});
	});

	app.get('/ec', isLoggedIn, async (req, res) => {
		const materias = await Users.find({ 'materiaEstudiante.estudianteid': req.user._id });
		var arrayMaterias = [];

		for (let i = 0; i < materias.length; i++) {
			const element = materias[i];
			var miVar = await Users.findById(element.materiaEstudiante.materiaid);
			arrayMaterias.push(miVar);

		}
		res.render('ec', { user: req.user, arrayMaterias: arrayMaterias });
	});


	app.get('/ec2/:materia_id', isLoggedIn, async (req, res) => {
		const profes = await Users.find({ 'teacher.nombre': { $regex: ".*" } });
		var profesores = [];
		for (let j = 0; j < profes.length; j++) {
			const prueba = profes[j];
			profesores[j] = [prueba.teacher.nombre, prueba._id];
		}
		var materia = await Users.findById(req.params.materia_id);
		res.render('ec2', { materia: materia, user: req.user, profesores: profesores });
	});


	app.post('/ea', isLoggedIn, passport.authenticate('student-add', {
		session: false,
		successRedirect: '/e',
		failureRedirect: '/ea',
		failureFlash: true // allow flash messages
	}));





	app.get('/indexd', (req, res) => {
		res.render('indexd', {
			success_msg: req.flash('loginMessage')
		});
	});


	app.post('/logind', passport.authenticate('teacher-login', {
		successRedirect: '/d',
		failureRedirect: '/indexd',
		failureFlash: true // allow flash messages
	}));

	app.get('/logoutd', isLoggedIn, (req, res) => {
		req.logout();
		res.redirect('/indexd');
	});

	//rutas de estudiante

	app.get('/indexe', (req, res) => {
		res.render('indexe', {
			success_msg: req.flash('loginMessage')
		});
	});


	app.post('/logine', passport.authenticate('student-login', {
		successRedirect: '/e',
		failureRedirect: '/indexe',
		failureFlash: true // allow flash messages
	}));


	app.get('/logoute', isLoggedIn, (req, res) => {
		req.logout();
		res.redirect('/indexe');
	});

	//ruta por defecto

	app.get('*', (req, res) => {
		res.render('indexe', {
			success_msg: req.flash('loginMessage')
		});
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		res.redirect('/');
	};

	function isLoggedInD(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		res.redirect('/indexd');
	};

	function isLoggedInE(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		res.redirect('/indexe');
	};

};
