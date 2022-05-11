module.exports = (app) =>{
    const controller = require("./controller")

       //criar um novo imovel
       app.post("/imovel", controller.create)

       //buscar todos os imoveis
       app.get("/imovel", controller.findAll)

 
}