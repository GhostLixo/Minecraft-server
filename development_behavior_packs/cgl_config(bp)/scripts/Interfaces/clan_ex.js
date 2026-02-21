//extesao de clan.js, para adicionar mais funcoes separa do codigo principal, 
// para melhor organizaçao do codigo

import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
export let arrayclan = [];
function carregarClans() {
    system.run(() => {
    const clansSalvos = world.getDynamicProperty("clans");
    
    if (clansSalvos) {
        try {
            // Transforma o texto JSON de volta para uma Array
            arrayclan = JSON.parse(clansSalvos); 
            console.warn(`[Sistema de Clãs] ${arrayclan.length} clãs carregados com sucesso!`);
        } catch (error) {
            console.error("Erro ao carregar clãs. Iniciando lista vazia.");
            arrayclan = [];
        }
    } else {
        arrayclan = []; // Se não houver nada salvo, inicia vazio
    }
    });
}

// Executa a função de carregar assim que o script ligar

    carregarClans();


carregarClans();
export function formmeuclan(player) {
} // falta fazer
// export function Lista_de_clan (clanlist) {
//     let clandasdsa= clanlist;
//     console.log(clandasdsa);
// }


export function MostrarClans(player){
    const formClanList = new ActionFormData();
    formClanList.title("Clãs Existentes");
    for (let x in arrayclan){
        formClanList.body(`Veja a Lista dos Clãs existentes:\n ---> ${arrayclan.toString()[x]}\n`);
    }
    
    
       
    formClanList.show(player).then((response) => {
        if (response.canceled) return;})
}

export function formlistclans(player, clanNames) {
    const formClanList = new ModalFormData()
    world.getAllPlayers().forEach((player) => {
        if (player.hasTag("clan") && player.getDynamicProperty("nivelClan") >= 3) {
            const clanName = player.getTags().find(tag => tag.startsWith("clan_")).split("_");
            const clanTag = player.getTags().find(tag => tag.startsWith("clan_tag_")).split("_");
            // aqui vai a logica para pegar a lista de clans do banco de dados, e adicionar os nomes e tags dos clans na lista de dropdown do form
            clanNames.push(`${clanName[1]} [${clanTag[2]}]`);
        }                                                                      
    });
    formClanList
        .title("Lista de Clans")
        .label("Selecione um clan para ver mais detalhes")
        .dropdown("Clans Disponíveis", clanNames)
    
} // feito mas nao testado

export function formconvitarMembro(player) {
    const formConviteMembro = new ModalFormData()
        .title("Convidar Membro")
        .dropdown("Selecione um jogador para convidar", world.getAllPlayers().map(p => p.name))
        .show(player)
        .then((response) => {
            if (response.canceled) return;
            const playerName = response.formValues[0];
            const targetPlayer = world.getAllPlayers().find(p => p.name === playerName);
            targetPlayer.addTag(`convite_clan_${player.getTags().find(tag => tag.startsWith("clan_"))}`)
            player.sendMessage(`Você convidou ${playerName} para o seu clan`);
            //aqui vai a logica para convidar o l x
            //  jogador para o clan, como verificar se o jogador existe, se ele tem clan, enviar a mensagem de convite, etc
        })
} //feito mas nao testado

export function form_membrosclan(player) {
} // falta fazer

export function form_expulsarmembro(player) {
} // falta fazer
export function form_promovermembro(player) {
} // falta fazer

export function form_rebaixarmembro(player) {
} // falta fazer
export function form_sairclan(player) {
    
} // falta fazer
export function form_convidarmembro(player){
    
}

export function formcriaclan(player) {
    const formCreateClan = new ModalFormData()
        formCreateClan
        .title("Criar Clã")
        .label("Preencha os campos abaixo para criar seu clã")
        .textField("Nome do Clã", "Digite o nome do seu clan")
        .textField("Tag do Clan", "Digite a tag do seu clan")
        //.toggle("Clan privado?", false) talves de para o futuro, por enquanto so tem clan publico
        .show(player)
        .then((response) => {
            if (response.canceled) return;
            const clanName = response.formValues[0];
            const clanTag = response.formValues[1];
            const isPrivate = response.formValues[2];
            const criado = adicionarClan(clanTag);
            if (criado){
            player.addTag(`clan_${clanName}`);
            player.setDynamicProperty("nivelClan", 3);//nivel 3 para lider do clan
            player.setDynamicProperty("doclan", clanTag);
            player.sendMessage(`Você criou o clan ${clanName} com a tag ${clanTag} e privacidade ${isPrivate}`);
            }
            
    

                
            
            //aqui vai a logica para criar o clan, como verificar se o nome e tag ja existe, 
            // criar o clan no banco de dados, adicionar o jogador como lider do clan, etc
        });
} // feito mas nao testado
function adicionarClan(nome) {
    // Cria o objeto do clã
    const novoClan = [nome];

    // Adiciona na lista
    arrayclan.push(novoClan);

    // Salva no mundo para persistir
    world.setDynamicProperty("clans", JSON.stringify(arrayclan));

    return true;
}
