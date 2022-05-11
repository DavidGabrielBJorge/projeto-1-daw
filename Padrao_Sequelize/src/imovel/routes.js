module.exports = (app) =>{
    const controller = require("./controller")

       //criar um novo imovel
       app.post("/imovel", controller.create)

       //buscar todos os imoveis
       app.get("/imovel", controller.findAll)


       //atualiza um imovel
       app.put('/imovel',controller.update);
    
       //remove um imovel
       app.delete('/imovel',controller.remove)
}