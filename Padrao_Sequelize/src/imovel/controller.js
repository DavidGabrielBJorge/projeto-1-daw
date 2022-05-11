const db=require("./../configs/sequelize")
const Imovel = require("./model")
const Proprietario = require("./../proprietario/model")

exports.create = (req, res) => {
    Imovel.create({
        endereco : req.body.endereco,
        proprietario :{
            nome : req.body.nome,
            cpf : req.body.cpf,
            telefone: req.body.telefone
        }

}, {
    include: [{
        model:Proprietario,
        associaton : Imovel.Proprietario
    }]
}).then((imovel)=> {
    res.send(imovel);
}).catch((err) => {
    console.log("Erro :" + err)
})
}

exports.findAll = (req, res) => {
    Imovel.findAll().then(imoveis => {
        res.send(imoveis)
    })
}
