const db = require("../configs/sequelize")

const { Model, DataTypes } = db.Sequelize;

const Proprietario = require('./../proprietario/model')

const sequelize = db.sequelize

class Imovel extends Model{}

Imovel.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    endereco:{
        type: DataTypes.STRING

    },
    valor:{
        type: DataTypes.DOUBLE
    }
},{sequelize, modelName : "imoveis"})

Imovel.Proprietario = Imovel.belongsTo(Proprietario)


module.exports = Imovel

