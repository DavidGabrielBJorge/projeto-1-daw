const db=require("./../configs/sequelize")
const Imovel = require("./model")
const Proprietario = require("./../proprietario/model")
const ProprietarioController = require("./../proprietario/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")

exports.create = async (req, res) => {

    try{
        
    let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.Cpf, req.body.Telefone);

    console.log("===============Entrando no Create imovel===============");
    console.log("req.body.Nome: "+req.body.Nome);
    console.log("req.body.Cpf: "+req.body.Cpf);
    console.log("req.body.Telefone: "+req.body.Telefone);
    
    let imovel = await Imovel.create({
        endereco : req.body.endereco,
        proprietarioId : proprietario.Id
        
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
    console.log("===============Entrando no findAll imovel===============");
    Imovel.findAll({include:Proprietario,where : {endereco : {[Op.iLike] : '%' + req.query.endereco + '%' }}, order:['createdAt']}).then(imoveis => {
       console.log(imoveis);
       
        res.send(imoveis);
    console.log("===============Saindo no findAll imovel===============");
    })
}


exports.update =(req,res)=>{
    Imovel.update(
        {
            endereco: req.body.endereco 
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


