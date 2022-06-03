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

exports.create = (req, res) => {
    console.log("===============Entrando no Create proprietario===============");

    var numeroTelefone =/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    var nome=/[a-zA-Z]/g;
    var numeroCpf=/[0-9]{11}/g;
    var espacoBranco=/^(?!\s*$).+/;


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
 exports.createDefault = async (nome, cpf, telefone) =>{
 
     try{
        console.log("===============Entrando no Create Default proprietario===============");
         let proprietario = await findByFullName(nome);
 
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
     
 
 findByFullName = async (nome) => {
 
     let proprietario = await Proprietario.findOne({where : {Nome : nome}});
 
     if(proprietario){
         console.log("Este proprietario: " + proprietario)
         return proprietario;
     }else{
         console.log("Este é null")
     }
 
 }
 
 exports.findAll = (req, res) => {
    Proprietario.findAll().then(proprietarios => {
        res.send(proprietarios)
    })
}

exports.remove=(req,res)=>{

    Proprietario.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}

exports.update =(req,res)=>{

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
            res.send({'mensagem' : 'ok'});
        }) 
    }
    else{
        res.status(httpStatus.UNAUTHORIZED);
        res.send({'mensagem' : 'Erro em um dos campos, deve conter apenas palavras no nome, o CPF deve ter no mínimo 11 números e o número de telefone deve ser no formato: +XX XXXX-XXXX, TODOS OS CAMPOS DEVEM SER PREENCHIDOS'});

    }

    
}
 
 
 