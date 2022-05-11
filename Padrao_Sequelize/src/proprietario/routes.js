module.exports =(app) => {
    const controller = require("./controller")

    //criar um novo usuário
    app.post("/proprietario", controller.create)

    //buscar todos os usuários
    app.get("/proprietario", controller.findAll)
}