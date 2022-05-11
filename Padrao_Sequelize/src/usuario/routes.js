module.exports =(app) => {
    const controller = require("./controller")

    //criar um novo usuário
    app.post("/usuario", controller.create)

    //buscar todos os usuários
    app.get("/usuario", controller.findAll)
}