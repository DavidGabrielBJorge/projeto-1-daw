module.exports = (app) =>{
    const controller = require("./controller")

       //criar um novo imovel
       app.post("/aluguel", controller.create)

}