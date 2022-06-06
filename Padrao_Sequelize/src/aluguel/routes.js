module.exports = (app) =>{
    const controller = require("./controller")

       //criar um novo aluguel
       app.post("/aluguel", controller.create)

        //buscar todos os alugueis
        app.get("/aluguel", controller.findAll)

       //atualiza um aluguel
       app.put('/aluguel',controller.update);

       //remove um aluguel
       app.delete('/aluguel',controller.remove)
} 