module.exports =(app) => {

    //O routes chama uma função com base na URL
    const controller = require("./controller")

    //criar um novo usuário
    app.post("/proprietario", controller.create);

    //buscar todos os usuários
    app.get("/proprietario", controller.findAll);

    //deletar um proprietario
    app.delete("/proprietario", controller.remove);

    //alterar um proprietário
    app.put('/proprietario',controller.update);
}