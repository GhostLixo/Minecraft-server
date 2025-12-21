import { world, system } from "@minecraft/server"

system.runInterval(() =>{
    const mana_scoreboard = world.scoreboard.getObjective("mana")

    for (const jogador of world.getAllPlayers()) {
        const manaScore = mana_scoreboard.getScore(jogador);
        jogador.onScreenDisplay.setTitle(`${manaScore}`)
    }
});