import { world, system, GameMode } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe((ev) => {
    const { itemStack, source } = ev;
    let adm_painel = new ActionFormData();
    adm_painel.title("");
    adm_painel.label("Painel de administração");
    adm_painel.button("criativo");
    adm_painel.button("survival");
    adm_painel.button("espectador");
    adm_painel.button("ficar Invisivel");

    
    if (itemStack.typeId == "minecraft:compass" && source.hasTag("adm")) {
        system.run(() => {
            adm_painel.show(source).then((resutado) => {
                if (resutado.canceled) {
                    adm_painel = null;
                }
            switch (resutado.selection) {
                case 0:
                    source.setGameMode(GameMode.Creative);
                    break;
                case 1:
                    source.setGameMode(GameMode.Survival);
                    break;
                case 2:
                    source.setGameMode(GameMode.Spectator);
                    break;
                case 3:
                    source.runCommand("effect @s invisibility infinite 1 true");
                    break;
                }
            })
        });
    }
})
