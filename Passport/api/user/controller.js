const httpStatus = require('http-status')
const Usuario = require("./model")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { username } = require('../configs/dbconfig');



/*
=============================================================================
Função para criar o usuário


{
    "name" : "testedousuario",
    "matricula" : "987654321-A",
    "login" : "lordesupremo-5",
    "password":"Mau3456"
}

https://regex101.com/
https://www.w3resource.com/javascript/form/letters-numbers-field.php
=============================================================================
*/
exports.create = async (req, res) => {

    let pass = await bcrypt.hash(req.body.password, 10);

    var nome=/[a-zA-Z]/g;
    var validarMatricula=/[^a-zA-Z0-9\-\/]/;
    var validarLogin=/[^a-zA-Z0-9\-\/]/; //impede a entrada de caracteres especiais com a exeção do -,porém permite a entrada de null
   
    var validarPassword=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    var espacoBranco=/([^\s]*)/;
 

    if(req.body.name.match(espacoBranco) && req.body.password.match(espacoBranco)  && req.body.name.match(nome) && (!req.body.matricula.match(validarMatricula)) && (!req.body.login.match(validarLogin)) && req.body.password.match(validarPassword) ){
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
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, no nome deve conter apenas letras, na matricula e no login não é permitido caracteres especiais com exceção do - e a senha deve ter entre 6 e 20  caracteres com um número, uma letra maiúscula e uma letra minuscúla'});

    }
   
}


/*
=============================================================================
Função para fazer o login utilizando o "login" como parametro, além disso analisa os dados que foram 
inseridos no login
=============================================================================
*/
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

/*
=============================================================================
Função para mostrar todos  os usuários inseridos no sistema
=============================================================================
*/
exports.findAll = async (req, res) => {
    try {
        let usuarios = await Usuario.findAll();
        res.send(usuarios);
    } catch (err) {
        res.status(err.status).end(err.message);
    }
}


/*
=============================================================================
Função para mostrar um usuário utilizanddo como parametro o login
=============================================================================
*/
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

/*
=============================================================================
Função para comparar a senha quando o usuário tenta fazer o login
=============================================================================
*/
exports.validPassword = (password, usuario) => {

    return bcrypt.compareSync(password, usuario.password);
}

/*
=============================================================================
Função para mostrar um usuário utilizando como parametro a chave primária do usuário, no caso o "id"
=============================================================================
*/
exports.findById = async (id) => {

    return Usuario.findByPk(id);
}

/*
=============================================================================
Função para remover o usuário, sendo seu parametro o  id do usuário que deve ser deletado
=============================================================================
*/
exports.remove=(req,res)=>{

    Usuario.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}

/*
=============================================================================
Função para alterar um usuário específico usando o id como parametro
=============================================================================
*/
exports.update =(req,res)=>{
    Usuario.update(
        {
            name: req.body.name,
            matricula: req.body.matricula,
            login: req.body.login,
            password: pass
        },
        {
            where : {
                id:req.body.id
            }
        }
    ).then(()=>{
        res.send({'mensagem' : 'ok'});
    })
}