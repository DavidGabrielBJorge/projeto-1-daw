const httpStatus = require('http-status')
const Usuario = require("./model")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { username } = require('../configs/dbconfig');

exports.create = async (req, res) => {

    let pass = await bcrypt.hash(req.body.password, 10);

    try {
        let usuario = await Usuario.create({
            name: req.body.name,
            matricula: req.body.matricula,
            login: req.body.login,
            password: pass
        });
        res.send(usuario);
    } catch (err) {
        console.log(err);
    }
}

exports.login = async (req, res) => {

    try {

        let usuario = await Usuario.findOne({
            where: { login: req.body.login }
        });

        if (usuario) {
            bcrypt.compare(req.body.password, usuario.password, function (err, result) {
                if (result) {

                    req.session.usuario = usuario.id //insere o id do usuário na sessão
                    res.json(usuario);

                } else {
                    res.status(httpStatus.UNAUTHORIZED);
                    res.send("Usuário e/ou senha inválidos");
                }
            });
        } else {
            res.status(httpStatus.UNAUTHORIZED);
            res.send("Usuário e/ou senha inválidos");
        }

    } catch (err) {

    }

}

exports.findAll = async (req, res) => {
    try {
        let usuarios = await Usuario.findAll();
        res.send(usuarios);
    } catch (err) {
        res.status(err.status).end(err.message);
    }
}

exports.findUser = async (nomeUsuario) => {
    try {
        let usuario = await Usuario.findOne({
            where: { login: nomeUsuario }
        });
        return usuario;
    } catch (err) {
        console.log(err.message);
    }
    return null;
}

exports.validPassword = (password, usuario) => {

    return bcrypt.compareSync(password, usuario.password);
}

exports.findById = async (id) => {

    return Usuario.findByPk(id);
}
