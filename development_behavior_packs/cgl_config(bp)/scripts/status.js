import { world, system } from "@minecraft/server"

system.runInterval(() =>{
     const mana_scoreboard = world.scoreboard.getObjective("mana")

    for (const jogador of world.getAllPlayers()) {
        const vida_score = jogador.getComponents("health")
        jogador.onScreenDisplay.setActionBar(`vida ${vida_score.currentValue}\nmana ${mana_scoreboard.getScore(jogador)}`)
    }
});