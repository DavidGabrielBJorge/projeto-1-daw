const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require("./src/configs/sequelize")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

db.sequelize.sync({force: true}).then(()=>{
    console.log("Deu certo a criação do banco")
})


require('./src/proprietario/routes')(app)
require('./src/imovel/routes')(app)

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/view/index.html")
})

app.get("/inserir",(req,res)=>{
    res.sendFile(__dirname+"/public/view/inserir.html")
})
app.get("/sobre",(req,res)=>{
    res.sendFile(__dirname+"/public/view/sobre.html")
})
app.get("/buscar",(req,res)=>{
    res.sendFile(__dirname+"/public/view/buscar.html")
})



var server = app.listen(3000, () =>{
    console.log("Servidor rodando na porta : "+ server.address.port+" no host : "+ server.address().address)
})

