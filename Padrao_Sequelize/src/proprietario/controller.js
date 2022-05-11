const db=require("./../configs/sequelize")
const Proprietario = require("./model")

exports.create = (req, res) => {
    Proprietario.create({
        nome : req.body.nome,
        cpf : req.body.cpf,
        telefone: req.body.telefone

    }
    
    ).then((proprietario)=> {
        res.send(proprietario)
    })
}

exports.findAll = (req, res) => {
    Proprietario.findAll().then(proprietarios => {
        res.send(proprietarios)
    })
}
