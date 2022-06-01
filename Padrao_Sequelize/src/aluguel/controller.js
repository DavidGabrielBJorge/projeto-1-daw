const db=require("./../configs/sequelize")
const Aluguel = require("./model")
const Imovel = require("./../imovel/model")
const Proprietario = require("./../proprietario/model")
const ProprietarioController = require("./../proprietario/controller")
const ImovelController = require("./../imovel/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")

exports.create = async (req, res) => {
    console.log("req.body.valor: "+req.body.valor);

        try{
            let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone);
            let imovel = await ImovelController.create(req.body.valor,req.body.endereco)
            console.log("===============Entrando no Create imovel===============");
            console.log("req.body.Nome: "+req.body.Nome);
            console.log("req.body.cpf: "+req.body.cpf);
            console.log("req.body.telefone: "+req.body.telefone);
            console.log("req.body.endereco: "+req.body.endereco);
            console.log("req.body.valor: "+req.body.valor);



                let aluguel = await Aluguel.create({
                    preco: req.body.preco,
                    proprietarioId : proprietario.id,
                    imovelId: imovel.id
                    
                },
                {
                    include: [{
                      association: Aluguel.Proprietario,
                      association: Aluguel.Imovel
                    }]
                  }
                  )
                
            
                await aluguel.reload();
            
        
            res.json(aluguel);

            console.log("===============Saindo no Create imovel===============");
            }catch(err){
                
                res.status(status.INTERNAL_SERVER_ERROR);
                console.log(err);
              
            }
    

}