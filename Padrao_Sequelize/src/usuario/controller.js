const { username } = require("../configs/database")
const db=require("../configs/sequelize")
const Usuario = require("./model")

exports.create = (req, res) => {
   this.createDefault(req.body.firstName, req.body.lastName).then(usuario => {
       res.send(usuario)
   })
}

exports.createDefault = async (firstname, lastname) =>{

    try{
        let usuario = await findByFullName(firstname, lastname);

        if(usuario){

            return usuario;
        }else{
            return await Usuario.create({
                firstName : firstname,
                lastName : lastname
            })
        }

    }catch(err){
        console.log("Erro " + err)
    }
    
}
    

findByFullName = async (firstname, lastname) => {

    let usuario = await Usuario.findOne({where : {firstName : firstname, lastName : lastname}});

    if(usuario){
        console.log("Este user: " + usuario)
        return usuario;
    }else{
        console.log("Este é null")
    }

}

exports.findAll = (req, res) => {
    Usuario.findAll().then(usuarios => {
        res.send(usuarios)
    })
}

