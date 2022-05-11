const db=require("./../configs/sequelize")
const Post = require("./model")
const Usuario = require("./../usuario/model")
const UsuarioController = require("./../usuario/controller")
const { username } = require("../configs/database")
const {Op} = db.Sequelize
const status = require("http-status")

exports.create = async (req, res) => {

    try{
        
    let usuario = await UsuarioController.createDefault(req.body.firstName, req.body.lastName);

    let post = await Post.create({
        content : req.body.content,
        usuarioId : usuario.id
    },
    {
        include: [{
          association: Post.Usuario
        }]
      }
      )

    await post.reload();

    
    res.json(post);

    }catch(err){
        res.status(status.INTERNAL_SERVER_ERROR);
        console.log(err)
    }
}

exports.findAll = (req, res) => {

    //{include:Usuario,where : {content : {[Op.iLike] : '%' + req.query.content + '%' }}, order:['createdAt']}
    Post.findAll({include:Usuario,where : {content : {[Op.iLike] : '%' + req.query.content + '%' }}, order:['createdAt']}).then(posts => {
       console.log(posts);
       
        res.send(posts);
    })
}

//select * from posts where content like '%%'

exports.update =(req,res)=>{
    Post.update(
        {
            content: req.body.content 
        },
        {
            where : {
                id:req.body.id
            }
        }
    ).then(()=>{
        res.send({'mensagem' : 'ok'});
    })
}

exports.remove=(req,res)=>{

    Post.destroy({
        where:{
            id : req.body.id
        }
    }).then((affectedRows)=>{
        res.send({'message':'ok','affectedRows' : affectedRows})
    })
}


