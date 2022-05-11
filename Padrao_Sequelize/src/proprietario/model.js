const db = require("../configs/sequelize")

const {Model, DataTypes} = db.Sequelize

const sequelize = db.sequelize

class Proprietario extends Model{}

Proprietario.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    Nome:{
        type: DataTypes.STRING
   
    },
    Cpf:{
        type: DataTypes.STRING
    },
    Telefone:{
        type: DataTypes.BIGINT
    }
},{sequelize, modelName : "proprietarios"})


module.exports = Proprietario