module.exports =(app) => {
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