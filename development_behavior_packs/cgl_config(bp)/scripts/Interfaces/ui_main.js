import { world, system } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"

    


system.run(() => {



    world.afterEvents.playerSpawn.subscribe((ev) => {
        const player = ev.player
        if (ev.initialSpawn === true) {
            player.sendMessage("surgiu")
            if (player.getDynamicProperty("id") === undefined) {
                player.setDynamicProperties({
                    "id": Math.floor(Math.random() * 999999999) + 1,
                    "strength": 0,
                    "velocity": 0
                })
            }

        }
    })


    world.sendMessage("testando 123")

    world.afterEvents.itemUse.subscribe((ev) => {
        const item = ev.itemStack
        const player = ev.source

        const main_form = new ActionFormData();
        main_form.title("teste")
        main_form.label(`   id ${player.getDynamicProperty("id")} | name ${player.name}`)
        main_form.label(`   força ${player.getDynamicProperty("strength")} | idade 18 | sexo M\n    velocidade ${player.getDynamicProperty("velocity")}`)
        main_form.button("1")
        main_form.button("2")
        main_form.button("3")
        main_form.button("4")


        if (item.typeId === "minecraft:compass") {
            main_form.show(player).then((response) => {
                if (response.canceled) {
                    player.sendMessage("esta off")
                }
                switch (response.selection) {
                    case 0:
                        player.setDynamicProperty("strength", (player.getDynamicProperty("strength") + 1))
                        break;
                    case 1:
                        player.sendMessage("teste02")
                        break;
                }
            })

        }
    })
})