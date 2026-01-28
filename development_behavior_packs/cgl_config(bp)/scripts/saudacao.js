import { world, system, TicksPerSecond } from "@minecraft/server";
import { statusSistema } from "./status.js";
import { Mostrar_vida_do_mob } from "./animal_status.js";

let descansarRelogio = undefined, // Variavel para encerrar o loop do relogio quando não tiver ninguem online
    descansarStatus = undefined, // Variavel para encerrar o loop do status quando não tiver ninguem online
    descansarAnimalStatus = undefined; // Variavel para encerrar o loop do status dos mobs quando não tiver ninguem online

world.afterEvents.playerJoin.subscribe((ev) => {
    const mana_scoreboard = world.scoreboard.getObjective("mana");
    const estamina_scoreboard = world.scoreboard.getObjective("estamina");
    
    
    system.runTimeout(() => {
            const jugador = world.getAllPlayers().filter((player) => player.id == ev.playerId); // Retorna apenas uma posição de array do objeto player
            
            mana_scoreboard?.setScore(jugador[0], 200);
            estamina_scoreboard?.setScore(jugador[0], 200);
            jugador[0].onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
        

    //               codigo legado
    //   for (let keyl of world.getAllPlayers()) {
    //     if (keyl.id === jugador) {
    //       estamina_scoreboard.setScore(keyl, 0) ?? 0
    //       mana_scoreboard.setScore(keyl, 0) ?? 0
    //       keyl.onScreenDisplay.setTitle("§aSeja bem-vindo!\n");
    //         }
    //     }
    console.log("Jogador entrou no servidor. " + jugador.length );
    },TicksPerSecond * 7);// O Timer é importante para garantir o objeto player, se vir antes da hora da erro


//         Relogio que mostra a hora no chat
     descansarRelogio = system.runInterval(() => {
     const relogio = new Date(),
        variavelMinuto = relogio.getMinutes().toString().padStart(2, "0"),
        VariavelHora = (relogio.getHours() - 3 + 24) % 24,
        horaFormatada = `${VariavelHora.toString().padStart(2, "0")}:${variavelMinuto}`;
     world.sendMessage("Hora " + horaFormatada);
     console.log("Hora " + horaFormatada);
}, 1000);


//         Sistema de status importada
//         Sistema de vida dos mobs importada
     descansarStatus = system.runInterval(() => { statusSistema()});
     descansarAnimalStatus = system.runInterval(() => { Mostrar_vida_do_mob();}, 30);
});


world.afterEvents.playerLeave.subscribe(() => {
    console.log(world.getAllPlayers().length);
    if (world.getAllPlayers().length == 0 ) {
        system.clearRun( descansarRelogio );//Sas pohas tem ordem certa para ser cancelada
        system.clearRun( descansarStatus );
        system.clearRun( descansarAnimalStatus );
        
        descansarRelogio = undefined;
        descansarStatus = undefined;
        descansarAnimalStatus = undefined;
        
        console.log("Loop do relogio parou.");
    }
});

