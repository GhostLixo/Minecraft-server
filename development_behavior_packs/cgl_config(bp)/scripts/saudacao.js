import { world, system, TicksPerSecond } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((ev) => {
    system.runTimeout(() => {
        const mana_scoreboard = world.scoreboard.getObjective("mana");
        const estamina_scoreboard = world.scoreboard.getObjective("estamina");
        const jugador = world.getAllPlayers().filter((player) => player.id === ev.playerId); // Retorna apenas uma posição de array do objeto player

        jugador[0].onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
        mana_scoreboard?.setScore(jugador[0], 0);
        estamina_scoreboard?.setScore(jugador[0], 0);
    //               codigo legado
    //   for (let keyl of world.getAllPlayers()) {
    //     if (keyl.id === jugador) {
    //       estamina_scoreboard.setScore(keyl, 0) ?? 0
    //       mana_scoreboard.setScore(keyl, 0) ?? 0
    //       keyl.onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
    //         }
    //     }
    },TicksPerSecond * 7);
});

