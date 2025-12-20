import { world, system, TicksPerSecond } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((ev) => {
    system.runTimeout(() => {

      const jugador = ev.playerId;
      for (let keyl of world.getAllPlayers()) {
        if (keyl.id === jugador) {
          keyl.onScreenDisplay.setTitle("§l§aSeja bem-vindo!" +  ev.playerName);
          world.sendMessage("Bem vindo " + ev.playerId);
          world.sendMessage("Bem vindxo " + ev.playerName);
            }
        }


        },TicksPerSecond * 7);

        
    });
