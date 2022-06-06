const db=require("./../configs/sequelize")
const Aluguel = require("./model")
const Imovel = require("./../imovel/model")
const Proprietario = require("./../proprietario/model")
const ProprietarioController = require("./../proprietario/controller")
const ImovelController = require("./../imovel/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")
const httpStatus = require("http-status")
/*
http://localhost:3000/aluguel
=>Criar
{
	"Nome": "Kerry Eurodyne",
	"cpf":"23334445522",
	"telefone":"3492345678",
    "endereco":"Republic WY",
    "valor":100,
    "preco":200
}

{
	"Nome": "Panam Palmer",
	"cpf":"23334448888",
	"telefone":"3492345677",
    "endereco":"El Camino del Mar",
    "valor":350000,
    "preco":1000
}

=>Alterar
{
	"id":1,
    "preco":800
}

=>Deletar
{
	"id":1
}

*/
exports.create = async (req, res) => {

    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;//valida se o número de telefone está no fromato +XX XXXX-XXXX
    var nome=/[a-zA-Z]/g;//valida se a pessoa escreveu o nome apenas com palavras, impede a pessoa de escrever números
    var numeroCpf=/[0-9]{11}/g;//valida se a pessoa escreveu apenas números e com tamanho 11
    var validarValor=/^[1-9][\.\d]*(,\d+)?$/;//valida se a pessoa escreveu alguma coisa no campo
    var espacoBranco=/^(?!\s*$).+/;//valida se a pessoa escreveu apenas números incluindo "."

    if(String(req.body.preco).match(espacoBranco) && String(req.body.valor).match(espacoBranco) && req.body.endereco.match(espacoBranco) && req.body.Nome.match(espacoBranco) && req.body.telefone.match(espacoBranco) && req.body.cpf.match(espacoBranco) && req.body.telefone.match(numeroTelefone) && req.body.Nome.match(nome) &&  req.body.cpf.match(numeroCpf) && String(req.body.valor).match(validarValor) && String(req.body.preco).match(validarValor))
    {
        try{
            let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone);

            let imovel = await ImovelController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone, req.body.valor,req.body.endereco);
            console.log(imovel.id);
           

                let aluguel = await Aluguel.create({
                    preco: req.body.preco,
                    proprietarioId : proprietario.id,
                    ImovelId: imovel.id

                },
                {
                    include: [{
                      association: Aluguel.Proprietario,
                      association: Aluguel.Imovel
                    }]
                  }
                  )
                  console.log(aluguel);


                await aluguel.reload();


            res.json(aluguel);

            console.log("===============Saindo no Create imovel===============");
            }catch(err){

                res.status(status.INTERNAL_SERVER_ERROR);
                console.log(err);

            }
    }
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});
    }


} 



/*
Função para mostrar todos os imóveis do banco
*/
exports.findAll = (req, res) => {
    Aluguel.findAll().then(alugueis => {
        res.send(alugueis)
    })
}

/*
Antes de atualizar, faz uma validação dos campos inseridos utilizando regex 
*/
exports.update =(req,res)=>{

    var validarValor=/^[1-9][\.\d]*(,\d+)?$/;//valida se a pessoa escreveu alguma coisa no campo
    var espacoBranco=/^(?!\s*$).+/;//valida se a pessoa escreveu apenas números incluindo "."

    if(String(req.body.preco).match(espacoBranco) && String(req.body.preco).match(validarValor) )
    {
        Aluguel.update(
            {
                preco: req.body.preco
            },
            {
                where : {
                    id:req.body.id
                }
            }
        ).then(()=>{
            res.status(httpStatus.OK);
            res.send({'mensagem' : 'ok'});
        })
    }
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});
    }

        
    

    
}

exports.remove=(req,res)=>{

    Aluguel.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
    
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}