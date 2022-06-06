const db=require("./../configs/sequelize")
const Imovel = require("./model")
const Proprietario = require("./../proprietario/model")
const ProprietarioController = require("./../proprietario/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")
const httpStatus = require('http-status')

/*
http://localhost:3000/imovel
=>CRIAR
{
	"Nome": "Kerry Eurodyne",
	"cpf":"23334445522",
	"telefone":"3492345678",
    "endereco":"Republic WY",
    "valor":100000
}

{
	"Nome": "Kerry Eurodyne",
	"cpf":"23334445522",
	"telefone":"3492345678",
    "endereco":"Congress St",
    "valor":150000
}

{
	"Nome": "Panam Palmer",
	"cpf":"23334448888",
	"telefone":"3492345677",
    "endereco":"El Camino del Mar",
    "valor":350000
}

===============================================
=>ALTERAR
{
    "id":1,
    "endereco":"Rua de teste",
    "valor":500
}
===============================================
=>DELETAR
{
    "id":1 
}
*/


exports.create = async (req, res) => {
    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;//valida se o número de telefone está no fromato +XX XXXX-XXXX
    var nome=/[a-zA-Z]/g;//valida se a pessoa escreveu o nome apenas com palavras, impede a pessoa de escrever números
    var numeroCpf=/[0-9]{11}/g;//valida se a pessoa escreveu apenas números e com tamanho 11
    var validarValor=/^[1-9][\.\d]*(,\d+)?$/;//valida se a pessoa escreveu um número 
    var espacoBranco=/^(?!\s*$).+/;//valida se a pessoa escreveu apenas números incluindo "."

    console.log("req.body.valor: "+req.body.valor);

    if(String(req.body.valor).match(espacoBranco) && req.body.endereco.match(espacoBranco) && req.body.Nome.match(espacoBranco) && req.body.telefone.match(espacoBranco) && req.body.cpf.match(espacoBranco) && req.body.telefone.match(numeroTelefone) && req.body.Nome.match(nome) &&  req.body.cpf.match(numeroCpf) && String(req.body.valor).match(validarValor))
    {
        try{
            //vai criar primeiro o proprietário para depois criar o imóvel
            let proprietario = await ProprietarioController.createDefault(req.body.Nome, req.body.cpf, req.body.telefone);
        
            console.log("===============Entrando no Create imovel===============");
            console.log("req.body.Nome: "+req.body.Nome);
            console.log("req.body.cpf: "+req.body.cpf);
            console.log("req.body.telefone: "+req.body.telefone);
            console.log("req.body.valor: "+req.body.valor);


                let imovel = await Imovel.create({
                    endereco : req.body.endereco,
                    valor: req.body.valor,
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
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});

    }
}



exports.createDefault = async (nome,cpf,telefone, valor, endereco) =>{

    try{
       console.log("===============Entrando no Create Default proprietario===============");
       
       let proprietario = await ProprietarioController.createDefault(nome,cpf,telefone);
        

            return await Imovel.create({
               endereco : endereco,
               valor : valor,
               proprietarioId : proprietario.id
            },
            {
                include: [{
                  association: Imovel.Proprietario
                }]
              })
        

    }catch(err){
        console.log("Erro " + err)
    }
    console.log("===============Saindo no Create Default proprietario===============");
}





/*
Função para mostrar todos os imóveis do banco
*/
exports.findAll = (req, res) => {
    Imovel.findAll().then(imoveis => {
        res.send(imoveis)
    })
}


/*
exports.findAll = (req, res) => {
    console.log("===============Entrando no findAll imovel===============");
    //utiliza como referência o endereço para mostrar os imóveis, ele cria uma query e ordena de acordo com a data da criação.
    //o sequelize possui o símbolo Op. para auxiliar no filtro de consulta
    Imovel.findAll({include:Proprietario,where : {endereco : {[Op.iLike] : '%' + req.query.endereco + '%' }}, order:['createdAt']}).then(imoveis => {
       console.log(imoveis);
       
        res.send(imoveis);
    console.log("===============Saindo no findAll imovel===============");
    })
}
*/


/*
Antes de atualizar, faz uma validação dos campos inseridos utilizando regex 
*/
exports.update =(req,res)=>{


    var espacoBranco=/^(?!\s*$).+/;//valida se a pessoa escreveu apenas números incluindo "."
    var validarValor=/^[1-9][\.\d]*(,\d+)?$/;//valida se a pessoa escreveu alguma coisa no campo


    if(String(req.body.valor).match(espacoBranco) && req.body.endereco.match(espacoBranco) && String(req.body.valor).match(validarValor))
    {
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
            res.status(httpStatus.OK);
            res.send({'mensagem' : 'ok'});
        })
    }
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});

    }

    
}

/*
Função remover um imovel, usando o id como referência
*/
exports.remove=(req,res)=>{

    Imovel.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.status(httpStatus.OK);
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}


