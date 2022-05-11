const { username } = require("../configs/database")
const db=require("./../configs/sequelize")
const Proprietario = require("./model")

exports.create = (req, res) => {
    this.createDefault(req.body.Nome, req.body.Cpf, req.body.Telefone).then(proprietario => {
        console.log("req.body.nome= "+req.body.Nome)
        res.send(proprietario)
    })
 }
 
 exports.createDefault = async (nome, cpf, telefone) =>{
 
     try{
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
 
 