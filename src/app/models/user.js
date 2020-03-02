const mongoose = require('mongoose');
const bcrypt = require ('bcrypt-nodejs');
const passport = require('passport');
const { Schema, model } = require('mongoose'); 

const userSchema = new mongoose.Schema({
	teacher:{
		nombre: String,
		phone: String,
		email: String,
		dir: String,
		usuarioid: String,
		password: String
	},
	student:{
		nombre : String,
		phone: Number,
		email: String,
		dir: String,
		usuarioid: String,
		password: String
	},
	admin:{
		nombre : String,
		phone: Number,
		email: String,
		dir: String,
		usuarioid: String,
		password: String
	},
	materia:{
		nombre: String,
		codigo: Number,
		profesor: String
	},
	materiaEstudiante:{
		estudianteid: String,
		materiaid: String
	},
	Nota:{
		materiaid: String,
		Nota: String,
		editor: String
	}
});




userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.teacher.password);
};
userSchema.methods.validAdmPassword = function (password) {
	return bcrypt.compareSync(password, this.admin.password);
  };
  userSchema.methods.validstudentPassword = function (password) {
	return bcrypt.compareSync(password, this.student.password);
  };
  

module.exports = mongoose.model('User', userSchema);
