Imoveis={
    add: () =>{

        console.log("====================================Entrou no add dos imoveis====================================");

        var t = {};
        t.endereco = $("#endereco").val();
        t.Nome = $("#Nome").val();
        t.cpf = $("#cpf").val();
        t.telefone = $("#telefone").val();
        t.valor=$("#valor").val();

        console.log("t.endereco= "+ t.endereco);
        console.log("t.Nome= "+ t.Nome);
        console.log("t.cpf= "+ t.cpf);
        console.log("t.telefone= "+ t.telefone);
        console.log("t.valor= "+ t.valor);

        $.ajax({
            type : 'POST',
            url : '/imovel',
            data: t,
            dataType: 'json',
            success: Imoveis.template

        })
        return false;


    },
    template : (data) => {

        console.log("====================================Entrou no template====================================");

        
        var comment = $('<tr></tr>')
        .attr('id','comment-'+data.id)
        .attr('class','comment');

     
        var tdId=$('<td></td>').html(data.id);

        var tdEndereco =$('<td></td>');
        var tdValor =$('<td></td>');

        var endereco = $('<textarea></textarea>')
        .attr('class','endereco')
        .attr('disabled',true)
        .html(data.endereco);

        var valor = $('<textarea></textarea>')
        .attr('class','valor')
        .attr('disabled',true)
        .html(data.valor);

        $(tdEndereco).append(endereco);

        $(tdValor).append(valor);

    
        var tdNome=$('<td></td>').html(data.proprietario.Nome);
        var tdCpf=$('<td></td>').html(data.proprietario.cpf);
        var tdTelefone=$('<td></td>').html(data.proprietario.telefone);

       

        var btnEdit =$('<button></button>').attr('class','edit').html('Editar');
        var btnSave =$('<button></button>').attr('class','save hidden').html('Salvar').hide();
        var btnRemove =$('<button></button>').attr('class','remove').html('Remover');


        $(btnEdit).on('click',(event)=>{
            Imoveis.enableEdit(data.id);
        });

        $(btnSave).on('click',(event)=>{
            Imoveis.update(data.id);
        })

        $(btnRemove).on('click',(event)=>{
            Imoveis.remove(data.id);
        })

        var tdBotoes=$('<td></td>');

        var divBotoes=$('<div></div>');
        $(divBotoes).append(btnEdit);
        $(divBotoes).append(btnSave);
        $(divBotoes).append(btnRemove);

        tdBotoes.append(divBotoes);



        $(comment).append(tdId);
        $(comment).append(tdNome);
        $(comment).append(tdCpf);
        $(comment).append(tdTelefone);
        $(comment).append(tdEndereco);
        $(comment).append(tdValor);
        $(comment).append(tdBotoes);

        $("#tabela").append(comment);

        
    },
    findAll: () =>{
        console.log("chegou no findall");
        $.ajax({
    
            type : "GET",
            url : '/imovel',
            data: {endereco : $("#endereco-search").val()},
            success : (data) => {
                $("#tabela").empty();

                for(var imovel of data){   
                    Imoveis.template(imovel);
                }

            },
            error : () =>{
                console.log("Ocorreu um erro: ", error)
            },
            dataType : 'json'
        })
    },

    enableEdit : (id) =>{
        var comment = $("#comment-" + id);

        $(comment).children('td').eq(4).children('textarea').prop('disabled',false);
        $(comment).children('td').eq(5).children('textarea').prop('disabled',false);
        $(comment).children('td').children("div").children('button.edit').hide();
        $(comment).children('td').children("div").children('button.save').show();


    },

    update : (id) =>{
        var comment = $("#comment-" + id);

        var endereco = $(comment).children('td').eq(4).children('textarea').val();
        var valor = $(comment).children('td').eq(5).children('textarea').val();

        $.ajax({
            type: "PUT",
            url:"/imovel",
            data:{'endereco':endereco, 'id': id,'valor':valor},
            success : (data)=>{
                //quando der certo
                $(comment).children('td').eq(4).children('textarea').prop('disabled',true);
                $(comment).children('td').eq(5).children('textarea').prop('disabled',true);
                $(comment).children('td').children("div").children('button.edit').show();
                $(comment).children('td').children("div").children('button.save').hide();



            },
            error:() => {
                console.log("Erro no update : ", error);
            },
            dataType:'json'
        })

       


    },

    remove: (id) =>{
        var comment = $("#comment-" + id);


        $.ajax({
            type: "DELETE",
            url:"/imovel",
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
    Imoveis.findAll();
});
