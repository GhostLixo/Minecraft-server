import { World } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./clan_ex.js";
import * as clan_ex from "./clan_ex.js";


//sistema de clan

//funcionalidades:
// criar clan(sem clan), FEITO
// entrar em clan(sem clan), FEITO
// sair de clan(com clan), FEITO
//convidar membros para o clan(lider e colider do clan), FEITO
// ver meu clan(com clan), FEITO
// listar clans(com ou sem clan), FEITO
// ver membros do clan(com clan e lider ou colider), FEITO
// expulsar membros do clan(lider e colider do clan), FEITO
// promover membros do clan(lider do clan), FEITO
// rebaixar membros do clan(lider do clan) FEITO

//regras:
//só pode criar clan se não tiver clan, só pode entrar em clan se não tiver clan, 
//só pode sair de clan se tiver clan, só pode ver meu clan se tiver clan,
//só pode listar clans se tiver ou não clan, só pode ver membros do clan se tiver clan,
//só pode expulsar membros do clan se for líder do clan,
//só pode promover membros do clan se for líder do clan,
//só pode rebaixar membros do clan se for líder do clan


function openClanMenu(player) {
    const formMenuClan = new ActionFormData()
        .title("Clan Menu")
    if (player.hasTag("clan")) {
        formMenuClan
        if (player.getDynamicProperty("nivelClan") >= 1) {
            formMenuClan
                .button("meu Clan", "textures/ui/eye.png")
                .button("Clan List", "textures/ui/list.png")
                .button("sair do Clan", "textures/ui/close.png")
        } else if (player.getDynamicProperty("nivelClan") >= 2) {
            formMenuClan
                .button("convidar membros para o Clan", "textures/ui/plus.png")
                .button("membros do Clan", "textures/ui/people.png")
                .button("expulsar membros do Clan", "textures/ui/close.png")
        } else if (player.getDynamicProperty("nivelClan") >= 3) {
            formMenuClan
                .button("promover membros do Clan", "textures/ui/plus.png")
                .button("rebaixar membros do Clan", "textures/ui/minus.png");
        }

    } else {
        formMenuClan
            .button("criar Clan", "textures/ui/plus.png")
            .button("Clan List", "textures/ui/list.png");
    }
    formMenuClan.show(player).then((response) => {
        if (response.canceled) {
            return;
        }
        switch (response.selection) {
            case 0:
                clan_ex.formmeuclan(player)
                break;
            case 1:
                clan_ex.formlistclans(player)
                break;
            case 2:
                clan_ex.formconvitarMembro(player)
                break;
            case 3:
                clan_ex.formmembrosclan(player)
                break;
            case 4:
                clan_ex.formexpulsarmembro(player)
                break;
            case 5:
                clan_ex.formpromovermembro(player)
                break;
            case 6:
                clan_ex.formrebaixarmembro(player)
                break;
            case 7:
                clan_ex.formsairclan(player)
                break;
            case 8:
                clan_ex.formlistclans(player)
                break;
            case 9:
                clan_ex.formcriaclan(player)
                break;
        }
    });
}
