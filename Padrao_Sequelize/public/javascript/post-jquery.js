Posts={
    add: () =>{
        var t = {};
        t.content = $("#content").val();
        t.firstName = $("#firstName").val();
        t.lastName = $("#lastName").val();

        $.ajax({
            type : 'POST',
            url : '/post',
            data: t,
            dataType: 'json',
            success: Posts.template

        })
        return false;


    },
    template : (data) => {

        var comment = $('<div></div>')
        .attr('id','comment-'+data.id)
        .attr('class','comment');

        var content = $('<textarea></textarea>')
        .attr('class','content')
        .attr('disabled',true)
        .html(data.content);

        var usuario = $('<p></p>')
        .attr('class','usuario')
        .html('Por '+data.usuario.firstName+" "+data.usuario.lastName+" ");



        var dtCreation = new Date(data.createdAt);
        dtCreation = (dtCreation.getDate() < 10 ? "0" + dtCreation.getDate():dtCreation.getDate())+
        "/"+((dtCreation.getMonth()+1) < 10 ? "0" + (dtCreation.getMonth()+1) : (dtCreation.getMonth()+1))+
        "/"+dtCreation.getFullYear();

        var date = $('<span></span>')
        .attr('class','date')
        .html(dtCreation);

        var btnEdit =$('<button></button>').attr('class','edit').html('Editar');
        var btnSave =$('<button></button>').attr('class','save hidden').html('Salvar');
        var btnRemove =$('<button></button>').attr('class','remove').html('Remover');

        $(btnEdit).on('click',(event)=>{
            Posts.enableEdit(event.target);
        });

        $(btnSave).on('click',(event)=>{
            Posts.update(event.target);
        })

        $(btnRemove).on('click',(event)=>{
            Posts.remove(event.target);
        })

        $(usuario).append(date);

        $(comment).append(content);
        $(comment).append(usuario);
        $(comment).append(btnEdit);
        $(comment).append(btnSave);
        $(comment).append(btnRemove);

        $("#comments").append(comment);

        
    },
    findAll: () =>{
        console.log("chegou no findall");
        $.ajax({
    
            type : "GET",
            url : '/post',
            data: {content : $("#content-search").val()},
            success : (data) => {
                $("#comments").empty();

                for(var post of data){   
                    Posts.template(post);
                }

            },
            error : () =>{
                console.log("Ocorreu um erro: ", error)
            },
            dataType : 'json'
        })
    },

    enableEdit : (button) =>{
        var comment = $(button).parent();

        $(comment).children('textarea').prop('disabled',false);
        $(comment).children('button.edit').hide();
        $(comment).children('button.save').show();

    },

    update : (button) =>{
        var comment = $(button).parent();

        var id = $(comment).attr('id').replace('comment-','');
        var content = $(comment).children('textarea').val();

        $.ajax({
            type: "PUT",
            url:"/post",
            data:{'content':content, 'id': id},
            success : (data)=>{
                //quando der certo
                $(comment).children('textarea').prop('disabled',true);
                $(comment).children('button.edit').show();
                $(comment).children('button.save').hide();

            },
            error:() => {
                console.log("Erro no update : ", error);
            },
            dataType:'json'
        })


    },

    remove: (button) =>{
        var comment = $(button).parent();

        var id = $(comment).attr('id').replace('comment-','');

        $.ajax({
            type: "DELETE",
            url:"/post",
            data:{'id': id},
            success : (data)=>{
                //quando der certo
                $(comment).remove();
              

            },
            error:() => {
                console.log("Erro no update : ", error);
            },
            dataType:'json'
        })

    }

    

}

$(document).ready(() => {
    Posts.findAll();
});
