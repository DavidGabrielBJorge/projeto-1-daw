const db=require("./../configs/sequelize")
const Imovel = require("./model")
const Proprietario = require("./../proprietario/model")
const ProprietarioController = require("./../proprietario/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")

/*
TESTAR NO POSTMAN
{
	"Nome": "David",
	"cpf":"12233344411",
	"telefone":"5512345678",
    "endereco":"",
    "valor":10
}
   
*/


exports.create = async (req, res) => {
    try{
        
    let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone, req.body.valor);

    console.log("===============Entrando no Create imovel===============");
    console.log("req.body.Nome: "+req.body.Nome);
    console.log("req.body.cpf: "+req.body.cpf);
    console.log("req.body.telefone: "+req.body.telefone);
    console.log("req.body.telefone: "+req.body.valor);
    
    let imovel = await Imovel.create({
        valor: req.body.valor,
        endereco : req.body.endereco,
        proprietarioId : proprietario.id
        
    },
    {
        include: [{
          association: Imovel.Proprietario
        }]
      }
      )
    

    await imovel.reload();

    
    res.json(imovel);
    console.log("===============Saindo no Create imovel===============");
    }catch(err){
        res.status(status.INTERNAL_SERVER_ERROR);
        console.log(err)
    }

}

exports.findAll = (req, res) => {
    Imovel.findAll().then(imoveis => {
        res.send(imoveis)
    })
}
/*
exports.findAll = (req, res) => {
    console.log("===============Entrando no findAll imovel===============");
    Imovel.findAll({include:Proprietario,where : {endereco : {[Op.iLike] : '%' + req.query.endereco + '%' }}, order:['createdAt']}).then(imoveis => {
       console.log(imoveis);
       
        res.send(imoveis);
    console.log("===============Saindo no findAll imovel===============");
    })
}
*/

exports.update =(req,res)=>{
    Imovel.update(
        {
            endereco: req.body.endereco,
            valor: req.body.valor
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

exports.remove=(req,res)=>{

    Imovel.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}


