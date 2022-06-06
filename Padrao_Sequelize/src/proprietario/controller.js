const { username } = require("../configs/database")
const db=require("./../configs/sequelize")
const Proprietario = require("./model")
const httpStatus = require('http-status')

/*
http://localhost:3000/proprietario
=>CRIAR
Pessoa 1:
{
	"Nome": "Alt Cunningham",
	"cpf":"12233344411",
	"telefone":"5512345678"
}
Pessoa 2:
{
	"Nome": "Kerry Eurodyne",
	"cpf":"23334445522",
	"telefone":"3492345678"
}
===========================================================================
=>Alterar
{
    "id":1,
	"Nome": "Nome alterado",
	"cpf":"23334445599",
	"telefone":"3492345100"
}
===========================================================================
=>Deletar
{
    "id":1
}

*/


/*
==============================================================================================================================================
O Sequelize fornece vários métodos para auxiliar na consulta de dados em seu banco de dados. Alguns desses
métodos são o CRUD, para que isso ocorra deve inserir algumas palavras dedicadas, create, findOne,update,
e destroy, dessa forma o seuqlize ficará responsável pela lógica de criar, procurar, deletar e atualizar no
banco de dados.
==============================================================================================================================================
*/

/*
Função para validar um proprietário
*/
exports.create = (req, res) => {
    console.log("===============Entrando no Create proprietario===============");

/*
Antes de criar criar o proprietário, vai conferir os campos utilizando código regex
*/
    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;//valida se o número de telefone está no fromato +XX XXXX-XXXX
    var nome=/[a-zA-Z]/g;//valida se a pessoa escreveu o nome apenas com palavras, impede a pessoa de escrever números
    var numeroCpf=/[0-9]{11}/g;//valida se a pessoa escreveu apenas números e com tamanho 11
    var espacoBranco=/^(?!\s*$).+/;//valida se a pessoa escreveu alguma coisa no campo

    if(req.body.Nome.match((espacoBranco)) && req.body.telefone.match(espacoBranco) && req.body.cpf.match(espacoBranco) && req.body.telefone.match(numeroTelefone) && req.body.Nome.match(nome) && req.body.cpf.match(numeroCpf))
    {
        this.createDefault(req.body.Nome, req.body.cpf, req.body.telefone).then(proprietario => {
            console.log("req.body.nome= "+req.body.Nome)
            res.send(proprietario)
    
            console.log("===============Saindo no Create proprietario===============");    
        })  
    }
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});

    }


 }

/*
Função para criar um proprietário, ela deve ser assíncrona pois a tabela "imoveis" possui
uma FK do proprietário, logo antes de inserir os dados do imóvel deve inserir primeiro o do 
proprietário.
Dentro dessa função async contém um await que pausa a execução da função assíncrona e espera
a resolução da promise.
*/
 exports.createDefault = async (nome, cpf, telefone) =>{
 
     try{
        console.log("===============Entrando no Create Default proprietario===============");
         let proprietario = await findByFullName(nome);//procura no banco de dados se esse nome já foi usado
 
         if(proprietario){
 
             return proprietario;
         }else{
             return await Proprietario.create({
                Nome : nome,
                cpf : cpf,
                telefone : telefone

             })
           
         }
 
     }catch(err){
         console.log("Erro " + err)
     }
     console.log("===============Saindo no Create Default proprietario===============");
 }
     
/*
Função para procurar um proprietário utilizando como referência o nome
*/
 findByFullName = async (nome) => {
 
     let proprietario = await Proprietario.findOne({where : {Nome : nome}});
 
     if(proprietario){
         console.log("Este proprietario: " + proprietario)
         return proprietario;
     }else{
         console.log("Este é null")
     }
 
 }
 
 /*
Função para buscar todos os proprietários
*/
 exports.findAll = (req, res) => {
    Proprietario.findAll().then(proprietarios => {
        res.send(proprietarios)
    })
}


/*
Função remover um proprietário, usando o id como referência
*/
exports.remove=(req,res)=>{

    Proprietario.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.status(httpStatus.OK);
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}

/*
Função atualizar um proprietário, usando o id como referência e modifica determinados campos
*/
exports.update =(req,res)=>{

/*
Antes de atualizar, faz uma validação dos campos inseridos utilizando regex 
*/
    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    var nome=/[a-zA-Z]/g;
    var numeroCpf=/[0-9]{11}/g;
    var espacoBranco=/^(?!\s*$).+/;

    if(req.body.Nome.match((espacoBranco)) && req.body.telefone.match(espacoBranco) && req.body.cpf.match(espacoBranco) && req.body.telefone.match(numeroTelefone) && req.body.Nome.match(nome) && req.body.cpf.match(numeroCpf))
    {
        Proprietario.update(
            {
                Nome : req.body.Nome,
                cpf : req.body.cpf,
                telefone : req.body.telefone
    
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
 
 
 