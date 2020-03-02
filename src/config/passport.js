const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  
// Añadir administrador
    passport.use('admin-add', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with usuarioid
      usernameField: 'usuarioid',
      passwordField: 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, usuarioid, password, done) {
      User.findOne({'admin.usuarioid': usuarioid}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'el usuario ya existe'));
        } else {
          var newUser = new User();
          newUser.admin.nombre = req.param('nombre');
          newUser.admin.phone = req.param('phone');
          newUser.admin.email = req.param('email');
          newUser.admin.dir = req.param('dir');
          newUser.admin.usuarioid = usuarioid;
          newUser.admin.password = newUser.generateHash(password);
          console.log(newUser);
        }
      });
    }));


  passport.use('admin-login', new LocalStrategy({
    usernameField: 'usuarioid',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, usuarioid, password, done) {
    User.findOne({'admin.usuarioid': usuarioid}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no existe'))
      }
      if (!user.validAdmPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'contraseña incorrecta'));
      }
      return done(null, user);
    });
  }));


  
  passport.use('materia-add', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with usuarioid
    usernameField: 'nombre',
    passwordField: 'codigo',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, nombre, codigo, done) {
    User.findOne({'materia.codigo': codigo}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'el código ya ha sido usado'));
      } else {
        var newmateria = new User();
        newmateria.materia.profesor = req.param('profesor');
        newmateria.materia.codigo = codigo;
        newmateria.materia.nombre = nombre;
        newmateria.save(function (err) {
          if (err) { throw err; }
          return done(null, newmateria);
        });
      }
    });
  }));



  



  passport.use('student-add', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with usuarioid
    usernameField: 'usuarioid',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, usuarioid, password, done) {
    User.findOne({'student.usuarioid': usuarioid}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'el usuario ya existe'));
      } else {
        var newUser = new User();
        newUser.student.nombre = req.param('nombre');
        newUser.student.phone = req.param('phone');
        newUser.student.email = req.param('email');
        newUser.student.dir = req.param('dir');
        newUser.student.usuarioid = usuarioid;
        newUser.student.password = newUser.generateHash(password);
        newUser.save(function (err) {
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  }));
  
  passport.use('student-login', new LocalStrategy({
    usernameField: 'usuarioid',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, usuarioid, password, done) {
    User.findOne({'student.usuarioid': usuarioid}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuario no existe'))
      }
      if (!user.validstudentPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'contraseña incorrecta'));
      }
      return done(null, user);
    });
  }));

    // Añadir profesor
    passport.use('teacher-add', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with usuarioid
      usernameField: 'usuarioid',
      passwordField: 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function (req, usuarioid, password, done) {
      User.findOne({'teacher.usuarioid': usuarioid}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'el usuario ya existe'));
        } else {
          var newUser = new User();
          newUser.teacher.nombre = req.param('nombre');
          newUser.teacher.phone = req.param('phone');
          newUser.teacher.email = req.param('email');
          newUser.teacher.dir = req.param('dir');
          newUser.teacher.usuarioid = usuarioid;
          newUser.teacher.password = newUser.generateHash(password);
          newUser.save(function (err) {
            if (err) { throw err; }
            return done(null, newUser);
          });
        }
      });
    }));
   
    //  estrategias de login
    passport.use('teacher-login', new LocalStrategy({
      usernameField: 'usuarioid',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, usuarioid, password, done) {
      User.findOne({'teacher.usuarioid': usuarioid}, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'Usuario no existe'))
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'contraseña incorrecta'));
        }
        return done(null, user);
      });
    }));


}
