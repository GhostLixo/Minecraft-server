import { world, system, TicksPerSecond } from "@minecraft/server";
import { statusSistema } from "./status.js";

let descansarRelogio = null; // Variavel para encerrar o loop do relogio quando não tiver ninguem online
let descansarStatus = null; // Variavel para encerrar o loop do status quando não tiver ninguem online


world.afterEvents.playerJoin.subscribe((ev) => {
    system.runTimeout(() => {
        const mana_scoreboard = world.scoreboard.getObjective("mana");
        const estamina_scoreboard = world.scoreboard.getObjective("estamina");
        world.getAllPlayers().forEach((player) => {
            player.onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
            mana_scoreboard?.setScore(player, 0);
            estamina_scoreboard?.setScore(player, 0);
            world.sendMessage("§aSeja bem-vindo ao servidor!\n");}); // Retorna apenas uma posição de array do objeto player


    //               codigo legado
    //   for (let keyl of world.getAllPlayers()) {
    //     if (keyl.id === jugador) {
    //       estamina_scoreboard.setScore(keyl, 0) ?? 0
    //       mana_scoreboard.setScore(keyl, 0) ?? 0
    //       keyl.onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
    //         }
    //     }
    },TicksPerSecond * 7);


//                        Relogio que mostra a hora no chat
     descansarRelogio = system.runInterval(() => {
     const relogio = new Date(),
     variavelMinuto = relogio.getMinutes().toString().padStart(2, "0"),
     VariavelHora = relogio.getHours() -3,
     horaFormatada = `${VariavelHora.toString().padStart(2, "0")}:${variavelMinuto}`;
     world.sendMessage("Hora " + horaFormatada);
     console.log("Hora " + horaFormatada);
}, 950);
//                        Sistema de status importada
     descansarStatus = system.runInterval(() => {
     statusSistema();
});

});
world.afterEvents.playerLeave.subscribe(() => {
    if (world.getAllPlayers().length == 0 ) {
        system.clearRun(descansarRelogio);
        system.clearRun(descansarStatus);
        descansarRelogio = null;
        descansarStatus = null;
        console.log("Loop do relogio parou.");
    }
});

