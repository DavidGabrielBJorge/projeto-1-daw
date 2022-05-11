const db = require("../configs/sequelize")

const {Model, DataTypes} = db.Sequelize

const sequelize = db.sequelize

class Usuario extends Model{}

Usuario.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    firstName:{
        type: DataTypes.STRING
   
    },
    lastName:{
        type: DataTypes.STRING
    }
},{sequelize, modelName : "usuarios"})


module.exports = Usuario