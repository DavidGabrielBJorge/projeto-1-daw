module.exports = (app) => {

    const controller = require('./controller')

    //Criar um novo perfil de usuário
    app.post('/usuario', controller.create)

    //Busca todos os perfis de usuário
    app.get('/usuario', controller.findAll)

    //Atualiza um usuário
    app.put('/usuario',controller.update)

    //Remove um usuário
    app.delete('/usuario',controller.remove)


}