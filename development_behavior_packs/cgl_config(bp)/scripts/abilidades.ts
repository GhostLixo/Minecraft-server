 import {world,  system} from "@minecraft/server"

 system.runInterval(()=>{
    for (const player of world.getAllPlayers()) {
        if(player.isJumping) {
            player.sendMessage("pulando")
        }
    }
 
 })