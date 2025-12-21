import { world, system } from "@minecraft/server"

system.runInterval(() =>{
    world.afterEvents.playerJoin.subscribe(() => {
        console.warn("teste");
    })
});