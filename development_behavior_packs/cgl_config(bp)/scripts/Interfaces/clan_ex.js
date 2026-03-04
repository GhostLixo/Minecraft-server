import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net"

export let arrayclan = []; // Nomes dos clãs
export let TextoBilhete = [];


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
  request.body = JSON.stringify({ nome: clanName, ListaMembros: [lider] });
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
        console.log("Consulta == " + JSON.parse(resposta.body));
        console.log("Consulta == " + typeof(JSON.parse(resposta.body)));
    }
    else{
        console.log("Erro ao buscar dados [dbcarregarclanname]: " + resposta.status);
    }    
}






// function carregarClansNome() {

    
//     system.run(() => {
//     const clansSalvos = world.getDynamicProperty("clans");
    
//     if (clansSalvos) {
//         try {
//             // Transforma o texto JSON de volta para uma Array
//             arrayclan = JSON.parse(clansSalvos); 
//             console.warn(`[Sistema de Clãs] ${arrayclan.length} clãs carregados com sucesso!`);
//         } catch (error) {
//             console.error("Erro ao carregar clãs. Iniciando lista vazia.");
//             arrayclan = [];
//         }
//     } else {
//         arrayclan = []; // Se não houver nada salvo, inicia vazio
//     }
//     });
// }

// Executa a função de carregar assim que o script ligar

// carregarClansNome();





export function formmeuclan(player) {// Formulario UI 
} // falta fazer




export function DeixarBilhete(player){
    const formDeixarBilhete = new ModalFormData();
    formDeixarBilhete.title("Deixando um recado");
    formDeixarBilhete.textField("Deixe um bilhete para os seus membros", "Escreva aqui");
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




export function formconvitarMembro(player) {
    
    const playerscivil = world.getAllPlayers().filter((p) => p.getDynamicProperty("doclan") !== player.getDynamicProperty("doclan"))
    if ( playerscivil.length == 0){ player.sendMessage("Não há civil para convidar"); return; }

    const formConviteMembro = new ModalFormData()
        .title("Convidar Membro")
        .dropdown("  Selecione um jogador para convidar\n\n\n", playerscivil.map(p => p.name), player)// Retorna os nomes de todos os civis
        .show(player)
        .then((response) => {
            if (response.canceled) return; 
            
            const jogadorSelecionado = playerscivil[response.formValues[0]];
            console.log("string " + typeof(jogadorSelecionado))
            console.log("teste " + JSON.stringify(jogadorSelecionado));
            console.log("teste " + JSON.stringify(response.formValues));
            

            Mostrarconvite(jogadorSelecionado, player.getDynamicProperty("doclan"), player );
            //targetPlayer.addTag(`convite_clan_${player.getTags().find(tag => tag.startsWith("clan_"))}`)
            player.sendMessage(`Você convidou ${jogadorSelecionado.name} para o seu clã` );
            

            //aqui vai a logica para convidar o l x
            //  jogador para o clan, como verificar se o jogador existe, se ele tem clan, enviar a mensagem de convite, etc
            
            
        })
} //feito mas nao testado


function Mostrarconvite(JogadorConvidado, doclan, lider){
    console.log("Jogador convidado " ,JogadorConvidado.name );
    const form_convite = new MessageFormData();
    form_convite.title("Você foi convidado para participar de um clã!!!");
    form_convite.body(`${lider.name} convidou voce para participar do clã: ${doclan}`);
    form_convite.button1("Aceitar convite");
    form_convite.button2("Recusar convite");
    form_convite.show(JogadorConvidado).then((response) => {
        if (response.canceled) return;
        else {
                if (response.selection == 0){
                    DbAdcionarMembro(JogadorConvidado.name, doclan).then(res => {
                        if (res.status === 200) {
                            player.setDynamicProperty("doclan", doclan);
                    player.setDynamicProperty("nivelClan", 1);
                    player.sendMessage("Parabens! Você agora faz parte do clã --> " + doclan);
                    console.log(res.body);
                    console.log("Slavo");
                        }
                        else {lider.sendMessage(`Erro ao convidar o player: ${res.status}`);
                        console.log("db " ,  JogadorConvidado.name, " ", typeof(JogadorConvidado)); return;}

                    })    
                }
                else{
                    lider.sendMessage(JogadorConvidado.name + " §cRecusou o convite")
                    return;
                }                
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













export function MostrarClans(player, variavel){// §c Finalizado
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

// export function formlistclans(player, clanNames) {
//     const formClanList = new ModalFormData()
//     world.getAllPlayers().forEach((player) => {
//         if (player.hasTag("clan") && player.getDynamicProperty("nivelClan") >= 3) {
//             const clanName = player.getTags().find(tag => tag.startsWith("clan_")).split("_");
//             const clanTag = player.getTags().find(tag => tag.startsWith("clan_tag_")).split("_");
//             // aqui vai a logica para pegar a lista de clans do banco de dados, e adicionar os nomes e tags dos clans na lista de dropdown do form
//             clanNames.push(`${clanName[1]} [${clanTag[2]}]`);
//         }                                                                      
//     });
//     formClanList
//         .title("Lista de Clans")
//         .label("Selecione um clan para ver mais detalhes")
//         .dropdown("Clans Disponíveis", clanNames)
    
// } // feito mas nao testado



export function form_membrosclan(player) {
} // falta fazer

export function form_expulsarmembro(player) {
} // falta fazer
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


