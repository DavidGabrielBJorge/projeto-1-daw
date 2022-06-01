const db = require("../configs/sequelize")

const { Model, DataTypes } = db.Sequelize;

const Proprietario = require('./../proprietario/model')
const Imovel = require('./../imovel/model')

const sequelize = db.sequelize

class Aluguel extends Model{}

Aluguel.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    preco:{
        type: DataTypes.DOUBLE
    }
},{sequelize, modelName : "alugueis"})

Aluguel.Proprietario = Aluguel.belongsTo(Proprietario)
Aluguel.Imovel = Aluguel.belongsTo(Imovel)

module.exports = Aluguel