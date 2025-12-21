import { world, system, EffectType } from "@minecraft/server"
import {MinecraftEffectTypes} from "./vanilla-data"

system.runInterval(() =>{

     const mana_scoreboard = world.scoreboard.getObjective("mana")
     const estamina_scoreboard = world.scoreboard.getObjective("estamina")
    //sistema de interfaca do status
    for (const jogador of world.getAllPlayers()) {
        const stm_score = estamina_scoreboard.getScore(jogador) ?? 0
        const mn_score = mana_scoreboard.getScore(jogador) ?? 0
         if (jogador.isSprinting ){
            if(stm_score > 0) {
                estamina_scoreboard.addScore(jogador, -1)
            }   
        }
        else if (!jogador.isSprinting) {
             if (stm_score < 100) {
                estamina_scoreboard.addScore(jogador, 1)
            }
        }
        if (stm_score == 0) {
            jogador.inputPermissions.setPermissionCategory(2, false)
        } else id (stm_score == 100) {
            jogador.inputPermissions.setPermissionCategory(2, true)
        }

        const vida_score = jogador.getComponent("health")
        jogador.onScreenDisplay.setActionBar(` ${vida_score.currentValue}\nmana ${mn_score}\n${stm_score}
            `)
    }
});