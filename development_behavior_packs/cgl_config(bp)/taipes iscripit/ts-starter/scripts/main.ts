import { world, system, TicksPerSecond } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((ev) => {
    system.runTimeout(() => {

      const jugador = ev.playerId;
      for (let keyl of world.getAllPlayers()) {
        if (keyl.id === jugador) {
          keyl.onScreenDisplay.setTitle("§l§aSeja bem-vindo!");
            }
        }


        },TicksPerSecond * 7);

        
    });



