//extesao de clan.js, para adicionar mais funcoes separa do codigo principal, 
// para melhor organizaçao do codigo

import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";


export function save(dados, arquivo = "dados.json") {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

export function load(arquivo = "dados.json") {
  try {
    const conteudo = fs.readFileSync(arquivo, "utf-8");
    return JSON.parse(conteudo);
  } catch (e) {
    return [];   // ou {} ou null — você escolhe o valor padrão
  }
}

FileSystem.writeFile

export let arrayclan = [];



export function formmeuclan(player) {
} // falta fazer


export function formconvitarMembro(player) {
    //const jugador = world.getAllPlayers().map(player => player.name) // Retorna uma array de string com todos os nomes dos jogadores
    //const jugador = world.getAllPlayers().forEach((player.name))
    const formConviteMembro = new ModalFormData();
        formConviteMembro.title("Convidar Membro");
        formConviteMembro.dropdown("Selecione um jogador para convidar", world.getAllPlayers().map(player => player.name));
        formConviteMembro.dropdown("Selecione um jogador para convidar", world.getAllPlayers().map(player => player.name));
        formConviteMembro.show(player).then((response) => {
            if (response.canceled) return;
            else{
                const player_sel = response.formValues[0];
                //console.log(typeof(jugador[0]));
                //console.log(jugador[0]);
                console.log(player_sel);
                console.log(typeof(response.formValues[0]));
            }
            
            
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
    const formCreateClan = new ModalFormData();

        formCreateClan.title("Criar Clã");
        //formCreateClan.label("Preencha os campos abaixo para criar seu clã"); // Esse metodo ta empurrando o array do formValues[]
        formCreateClan.textField("Preencha os campos abaixo para criar seu clã\nNome do Clã", "Digite o nome do seu clan"); //0
        formCreateClan.textField("Tag do Clan", "Digite a tag do seu clan"); //1
        formCreateClan.toggle("privar clan");//2
        //.toggle("Clan privado?", false) talves de para o futuro, por enquanto so tem clan publico
        formCreateClan.show(player).then((response) => {
            if (response.canceled) return;
            else {
            const clanName = response.formValues[0];
            const clanTag = response.formValues[1];
            const isPrivate = response.formValues[2];

            const clan_criado = {
                nome : clanName,
                tag : clanTag,
                isprivate : isPrivate
            }
            player.addTag(`clan_${clan_criado.tag}`);
            player.setDynamicProperty("doclan", clan_criado.nome);
            player.setDynamicProperty("nivelClan", 3);//nivel 3 para lider do clan
            
            console.log("Retorna " + typeof(clan_criado.nome));
            console.log("variavel " + typeof(clan_criado.nome), clanName);
            //save(clan_criado, "clan.json");
            player.sendMessage(`Você criou o clan ${clan_criado.nome} com a tag ${clan_criado.tag} e privacidade ${clan_criado.isprivate}`);
            }
            //aqui vai a logica para criar o clan, como verificar se o nome e tag ja existe, 
            // criar o clan no banco de dados, adicionar o jogador como lider do clan, etc
        });
} // feito mas nao testado

export function formlistclans(player, variavel) {
    const formClanList = new ActionFormData();
    let texto = "";
    formClanList.title("Clãs Existentes");
    for (const x in variavel){
        texto = texto + `---> ${variavel[x]}\n`
    }  
    formClanList.body(`Veja a Lista dos Clãs existentes:\n${texto}`);
    formClanList.show(player).then((response) => {
        if (response.canceled) return;})
    //const formClanList = new ModalFormData()                                                                 
    
} // feito mas nao 