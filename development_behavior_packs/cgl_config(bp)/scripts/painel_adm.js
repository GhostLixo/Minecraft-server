import { world, system } from "@minecraft/server"
import { ActionFormData, ModalFormData} from "@minecraft/server-ui"

system.run(() =>{
    const adm_painel =  new ActionFormData();
    adm_painel.title("teste")
    adm_painel.button("criativo")
    adm_painel.button("survival")
    adm_painel.button("espectador")

    world.afterEvents.itemUse.subscribe((ev) =>{
        const {itemStack, source} = ev
        if (itemStack.typeId == "minecraft:compass" && source.addTag("adm")) {
            adm_painel.show(source).then((resutado) =>{
                if (resutado.canceled) {
                    source.sendMessage("vc saiu do painel")
                }
                switch (resutado.selection) {
                    case 0:
                        source.setGameMode("Creative")
                        break;
                    case 1:
                        source.setGameMode("Survival")
                        break;
                    case 3:
                        source.setGameMode("Spectator")
                
                    default:
                        break;
                }
            })
        } 
    })
})