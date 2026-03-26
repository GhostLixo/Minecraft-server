import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { system, world, TicksPerSecond } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net"


export let arrayclan = [];    // Nomes dos clãs
export let TextoBilhete = []; // Bilhete que o jogador deixa
export let arrayMembros = []; // Array dos membros de cada clã
export let ClaName = "vaise";
export let arrayClanRegras = [];


export function formcriaclan(player) {
    const formCreateClan = new ModalFormData()
        formCreateClan
        .title("Criar Clã")
        .textField("Preencha os campos abaixo para criar seu clã\n\nNome do Clã", "Digite o nome do seu clan")
        //.textField("Tag do Clan", "Digite a tag do seu clan")
        //.toggle("Clan privado?", {defaultValue: false}) 
        .show(player)
        .then((response) => { if (response.canceled) return;
            
            const clanName = response.formValues[0];
            //const clanTag = response.formValues[1];
            //const isPrivate = response.formValues[2];
            DBsalvarClan(clanName, player.name).then(res => {
                if (res.status === 200) {
                player.sendMessage(`Clã ${clanName} salvo no banco de dados!`);
                console.log(res.body);
                console.log("Slavo");
                player.addTag(`clan_${clanName}`);
                player.setDynamicProperty("nivelClan", 3);//nivel 3 para lider do clan
                player.setDynamicProperty("doclan", clanName);
                player.sendMessage(`Você criou o clan ${clanName}`);
            }   else { player.sendMessage(`Erro ao salvar clã: ${res.status}`); return; }
            });
        });
} 
function DBsalvarClan(clanName, lider) {
  const request = new HttpRequest("http://localhost:3000/SalvarClan");
  request.method = HttpRequestMethod.Post;
  request.body = JSON.stringify({ nome: clanName, ListaMembros: lider });
request.headers = [new HttpHeader("Content-Type", "application/json")];
  return http.request(request);
}
export async function DBCarregarClanName(){ // Retorna array do nome de todos os clãs
    const requisitar = new HttpRequest("http://localhost:3000/carregarClanNames");
    requisitar.method = HttpRequestMethod.Get;

    const resposta = await http.request(requisitar);
    if (resposta.status === 200){
        const dados = JSON.parse(resposta.body);      // [ { nome: "ClanA" }, { nome: "ClanB" } ]
        arrayclan = dados.map(clan => clan.nome);
        console.warn("DBCarregar ClanName carregando lista de clans ");
    }
    else{
        console.log("Erro ao buscar dados [dbcarregarclanname]: " + resposta.status);
    }    
}


export function form_MostrarRegras (player,clanTextoRegras){
    const formRegras = new MessageFormData();
    formRegras.title("Regras do Clã");
    formRegras.body(clanTextoRegras);
    formRegras.button1("Entendido");
    formRegras.show(player).then((response) => {
        if (response.canceled || response.selection != 0) return;
    });
}
export function form_definirouVerRegras(player){
    const formLiderRegras = new ActionFormData();
    formLiderRegras.title("Editar ou Vizualizar Regras");
    formLiderRegras.button("Editar Regras");
    formLiderRegras.button("Vizualizar Regras");
    formLiderRegras.show(player).then((response) => {
        if (response.canceled) return;
        else {

        }
    });
}



export function formmeuclan(player) {// Formulario UI 
} // falta fazer


export function DeixarBilhete(player){
    const formDeixarBilhete = new ModalFormData();
    formDeixarBilhete.title("Deixando um recado");
    formDeixarBilhete.textField("\n\nDeixe um bilhete para os seus membros", "Escreva aqui");
    formDeixarBilhete.show(player).then((response) => {
        if (response.canceled) {return;}
        else {
            const obilhete = response.formValues[0];
            let concatenar = {clanName: player.getDynamicProperty("doclan"), recado: obilhete};
            TextoBilhete.push(concatenar);
        }
    });
}
export function VerBilhete(player, bilhete){
    const formVerbilhete = new MessageFormData();
    formVerbilhete.title("Bilhetes dos Superiores");
    formVerbilhete.body(bilhete);
    formVerbilhete.button1("Entendido");
    formVerbilhete.show(player).then((response) => {
        if (response.canceled) {return;}
    });
}




export function formconvitarMembro(player) { // Primeiro passo convidar
    
    const playerscivil = world.getAllPlayers().filter((p) => p.getDynamicProperty("doclan") !== player.getDynamicProperty("doclan"))
    if ( playerscivil.length == 0){ player.sendMessage("§cNão há civil para convidar"); return; }

    const formConviteMembro = new ModalFormData()
        .title("Convidar Membro")
        .dropdown("  Selecione um jogador para convidar\n\n\n", playerscivil.map(p => p.name))// Retorna os nomes de todos os civis
        .show(player)
        .then((response) => {
            if (response.canceled) return; 
            const jogadorSelecionado = playerscivil[response.formValues];
            jogadorSelecionado.setDynamicProperty("temconvite?", true);
            console.log("string " + jogadorSelecionado.name + "Tem convite: " + jogadorSelecionado.getDynamicProperty("temconvite?"))
            // console.log("teste " + JSON.stringify(jogadorSelecionado));
            // console.log("teste " + JSON.stringify(response.formValues));
            
            
            Mostrarconvite(jogadorSelecionado, player.getDynamicProperty("doclan"), player );
            
            //targetPlayer.addTag(`convite_clan_${player.getTags().find(tag => tag.startsWith("clan_"))}`)
            player.sendMessage(`Você convidou ${jogadorSelecionado.name} para o seu clã` );
            system.runTimeout(() => {
                jogadorSelecionado.setDynamicProperty("temconvite?", false);
                console.log("Covnite mudou para falso " + jogadorSelecionado.getDynamicProperty("temconvite?"));
            }, 20 * TicksPerSecond);
            

            //aqui vai a logica para convidar o l x
            //  jogador para o clan, como verificar se o jogador existe, se ele tem clan, enviar a mensagem de convite, etc
            
            
        })
} //feito mas nao testado
function Mostrarconvite(JogadorConvidado, doclan, lider){
    console.log("Jogador convidado " ,JogadorConvidado.name );
    const form_convite = new MessageFormData();
    form_convite.title("Você foi convidado para participar de um clã!!!");
    form_convite.body(`${lider.name} convidou você para participar do clã: ${doclan}`);
    form_convite.button1("Aceitar convite");
    form_convite.button2("Recusar convite");
    form_convite.show(JogadorConvidado).then((response) => {
        if (response.canceled){ console.warn("Cancelado");return;} 
        console.log("Aceitar " + response.selection)
        switch (response.selection){
            case 0:
                console.warn("Caso 1 Aceitar");
                console.warn("Caso 1 test", JogadorConvidado.name);
                DbAdcionarMembro(JogadorConvidado.name, doclan, lider).then(res => {
                    if (res.status === 200) {
                        JogadorConvidado.setDynamicProperty("doclan", doclan);
                        JogadorConvidado.setDynamicProperty("nivelClan", 1);
                        JogadorConvidado.sendMessage("Parabens! Você agora faz parte do clã --> " + doclan);
                        console.log("Membro convidado e Salvo no banco de dados");
                    }
                    else {
                        console.log("db " ,  JogadorConvidado.name, " ", res.status); 
                }});

                return;
            case 1:
                console.warn("Caso 2 recusar");
                lider.sendMessage(JogadorConvidado.name + " §cRecusou o convite");
                return;
        }
    });
}
function DbAdcionarMembro(convidado, entrou_no_clanName){
    
    const requisitar = new HttpRequest("http://localhost:3000/adicionarMembro");
    requisitar.method = HttpRequestMethod.Post;
    requisitar.body = JSON.stringify({ nome: entrou_no_clanName, ADDmembro: convidado });
    requisitar.headers = [new HttpHeader("Content-Type", "application/json")];
    return http.request(requisitar);
}


export function MostrarClans(player, variavel){// §a Finalizado
    const formClanList = new ActionFormData();
    let texto = "";
    formClanList.title("Clãs Existentes");
    for (const x in variavel){
        texto = texto + `---> ${variavel[x]}\n`
    }  
    formClanList.body(`Veja a Lista dos Clãs existentes:\n${texto}`);
    formClanList.show(player).then((response) => {
        if (response.canceled) return;})
}


export async function DBCarregarListaMembros(doclan){ // Retorna array dos membros do clã, a função foi chamada em uiMain no itemUse
    const requisitar = new HttpRequest(`http://localhost:3000/carregarListaMembros/${doclan}`);
    requisitar.method = HttpRequestMethod.Get;

    const resposta = await http.request(requisitar);
    if (resposta.status === 200){
              // [ { nome: "ClanA" }, { nome: "ClanB" } ]
        arrayMembros = JSON.parse(resposta.body);
        console.log("Consulta == " + JSON.parse(resposta.body));
        console.log("Consulta == " + typeof(JSON.parse(resposta.body)));
    }
    else{
        console.log("Erro ao buscar dados [dbcarregarListaMembros]: " + resposta.status);
    }    
}
export function form_ListarMembros(player, arraymembros) {
     
    const formMembrosList = new ActionFormData();
    let texto = "";
    formMembrosList.title("Lista de Membros");
    if (arrayMembros.length == 0 ){
        texto = arrayMembros[0];
    }
    else { 
        for (const x in arraymembros){
        texto = texto + `---> ${arraymembros[x]}\n`;
    }  
    }
    console.log(arrayMembros[0], " dsfdfdsfdsf");
    formMembrosList.body(`Veja a Lista dos Membros do clã:\n\n${texto}`);
    formMembrosList.show(player).then((response) => {
        if (response.canceled) return;});
}
 // falta fazer

export function form_expulsarmembro(player) {
    const Membrosdocla = world.getAllPlayers().filter((p) => p.getDynamicProperty("doclan") == player.getDynamicProperty("doclan"));
    if ( Membrosdocla.length == 1){ player.sendMessage("§cSó tem você no Clã, convide mais jogadores"); return; }
    const expulsarMembro = new ModalFormData()
        .title("Expulsar um Membro do clã")
        .dropdown("  Selecione um jogador para Expulsar\n\n\n", Membrosdocla.map(p => p.name))// Retorna os nomes de todos os civis
        .show(player)
        .then((response) => {
            if (response.canceled) return; 
            const jogadorSelecionado = Membrosdocla[response.formValues];
            jogadorSelecionado.setDynamicProperty("temconvite?", true);
            console.log("string " + jogadorSelecionado.name + "Tem convite: " + jogadorSelecionado.getDynamicProperty("temconvite?"))
            // console.log("teste " + JSON.stringify(jogadorSelecionado));
            // console.log("teste " + JSON.stringify(response.formValues));
            
            
            //targetPlayer.addTag(`convite_clan_${player.getTags().find(tag => tag.startsWith("clan_"))}`)
            player.sendMessage(`Você expulsou ${jogadorSelecionado.name} do seu clã` );
            
        });
} // falta fazer
function DBexpulsarMembro(playerExpulso, doclan){
    const requisitar = new HttpRequest ('');
    requisitar.method = HttpRequestMethod.DELETE;


}
export function form_promovermembro(player) {
} // falta fazer

export function form_rebaixarmembro(player) {
} // falta fazer



export function form_sairclan(player) { // Função 100% pronta e funcional
    const formSairClan = new ModalFormData();
    formSairClan.title("Sair do Clã");
    formSairClan.textField("\n\nVocê realmente Deseja sair do clã?", "Digite a palavra chave --> CONFIRMAR");
    formSairClan.show(player).then((response) => {
        if (response.canceled) return;
        else{
            if (response.formValues[0] == "CONFIRMAR"){
                player.setDynamicProperty("doclan", "civil");
                player.setDynamicProperty("nivelClan", 0);
                player.sendMessage("§eAgora você já não faz parte de nenhum Clã!!!");
            }
        }
    });
}


