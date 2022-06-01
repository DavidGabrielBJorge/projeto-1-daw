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
    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    var nome=/[a-zA-Z]/g;
    var numeroCpf=/[0-9]{11}/g;
    var validarValor=/^\d{0,2}(\.\d{0,2}){0,1}$/;
    var espacoBranco=/([^\s]*)/;

    console.log("req.body.valor: "+req.body.valor);

    if(req.body.Nome.match((espacoBranco)) && req.body.telefone.match(espacoBranco) && req.body.cpf.match(espacoBranco) && req.body.telefone.match(numeroTelefone) && req.body.Nome.match(nome) &&  req.body.cpf.match(numeroCpf) && req.body.Nome.match() )
    {
        try{
            let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone);
        
            console.log("===============Entrando no Create imovel===============");
            console.log("req.body.Nome: "+req.body.Nome);
            console.log("req.body.cpf: "+req.body.cpf);
            console.log("req.body.telefone: "+req.body.telefone);
            console.log("req.body.valor: "+req.body.valor);


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
                console.log(err);
              
            }
    }
    else{
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});

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


