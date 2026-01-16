import { world, system} from "@minecraft/server"

system.runInterval(() =>{
     const mana_scoreboard = world.scoreboard.getObjective("mana")
     const estamina_scoreboard = world.scoreboard.getObjective("estamina")
    //sistema de interfaca do status
    for (const jogador of world.getAllPlayers()) {
        const stm_score = estamina_scoreboard.getScore(jogador) ?? 0
        const mn_score = mana_scoreboard.getScore(jogador) ?? 0
         if (jogador.isSprinting ){
            if(stm_score > 0) { //stm_score é a estamina
                estamina_scoreboard.addScore(jogador, -1)
            }   
        }
        else if (!jogador.isSprinting) {
             if (stm_score < 200) {
                estamina_scoreboard.addScore(jogador, 1)
            }
        }
        if (stm_score == 0) {
            jogador.inputPermissions.setPermissionCategory(2, false)
        } 
        if (stm_score == 10) {
            jogador.inputPermissions.setPermissionCategory(2, true)    
        }

        const vida_score = jogador.getComponent("health")
        jogador.onScreenDisplay.setActionBar(` ${vida_score.currentValue.toFixed(1)}\nmana ${mn_score}\n${stm_score}
            `)
    }
});
system.runInterval(() => {
    let agora = new Date(); let minuto = agora.getMinutes().toString().padStart(2, "0"); let hora = agora.getHours() -3;
    let horaFormatada = `${hora.toString().padStart(2, "0")}:${minuto}`;
    world.sendMessage("Hora " + horaFormatada);
    console.log("Hora " + horaFormatada);
}, 950);