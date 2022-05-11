module.exports = (app) =>{
    const controller = require("./controller")

       //criar um novo post
       app.post("/post", controller.create)

       //buscar todos os posts
       app.get("/post", controller.findAll)

       //atualiza um post
       app.put('/post',controller.update);
    
       //remove um post
       app.delete('/post',controller.remove)
}