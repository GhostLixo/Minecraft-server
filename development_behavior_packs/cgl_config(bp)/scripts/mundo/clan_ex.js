//extesao de clan.js, para adicionar mais funcoes separa do codigo principal, 
// para melhor organizaçao do codigo

import { ModalFormData } from "@minecraft/server-ui";
import { world, system } from "@minecraft/server";


export function formmeuclan(player) {
} // falta fazer

export function formlistclans(player, clanNames) {
    const formClanList = new ModalFormData()
    world.getallPlayers().forEach((player) => {
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
            playerName.addTag(`convite_clan_${player.getTags().find(tag => tag.startsWith("clan_"))}`);
            player.sendMessage(`Você convidou ${playerName} para o seu clan`);
            //aqui vai a logica para convidar o jogador para o clan, como verificar se o jogador existe, se ele tem clan, enviar a mensagem de convite, etc
        })
} //feito mas nao testado

export function formmembrosclan(player) {
} // falta fazer

export function formexpulsarmembro(player) {
} // falta fazer
export function formpromovermembro(player) {
} // falta fazer

export function formrebaixarmembro(player) {
} // falta fazer
export function formsairclan(player) {
} // falta fazer

export function formcriaclan(player) {
    const formCreateClan = new ModalFormData()
        .title("Criar Clan")
        .label("Preencha os campos abaixo para criar seu clan")
        .textField("Nome do Clan", "Digite o nome do seu clan", "Clan")
        .textField("Tag do Clan", "Digite a tag do seu clan", "TAG")
        //.toggle("Clan privado?", false) talves de para o futuro, por enquanto so tem clan publico
        .show(player)
        .then((response) => {
            if (response.canceled) return;
            const clanName = response.formValues[0];
            const clanTag = response.formValues[1];
            const isPrivate = response.formValues[2];
            player.addTag(`clan_${clanName}`);
            player.setDynamicProperty("nivelClan", 1);//nivel 1 para lider do clan
            player.addTag(`clan_tag_${clanTag}`);
            player.sendMessage(`Você criou o clan ${clanName} com a tag ${clanTag} e privacidade ${isPrivate}`);
            //aqui vai a logica para criar o clan, como verificar se o nome e tag ja existe, 
            // criar o clan no banco de dados, adicionar o jogador como lider do clan, etc
        });
} // feito mas nao testado


