const { username } = require("../configs/database")
const db=require("./../configs/sequelize")
const Proprietario = require("./model")

exports.create = (req, res) => {
    console.log("===============Entrando no Create proprietario===============");

    this.createDefault(req.body.Nome, req.body.Cpf, req.body.Telefone).then(proprietario => {
        console.log("req.body.nome= "+req.body.Nome)
        res.send(proprietario)

        console.log("===============Saindo no Create proprietario===============");    
    })
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
                Cpf : cpf,
                Telefone : telefone

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
 
 