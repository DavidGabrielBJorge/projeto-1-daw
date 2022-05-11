const db = require("../configs/sequelize")

const { Model, DataTypes } = db.Sequelize;

const Usuario = require('./../usuario/model')

const sequelize = db.sequelize

class Post extends Model{}

Post.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    content:{
        type: DataTypes.STRING

    }
},{sequelize, modelName : "posts"})

Post.Usuario = Post.belongsTo(Usuario)

module.exports = Post

