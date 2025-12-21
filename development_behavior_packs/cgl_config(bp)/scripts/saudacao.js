import { world, system, TicksPerSecond } from "@minecraft/server";

world.afterEvents.playerJoin.subscribe((ev) => {
    system.runTimeout(() => {
      const mana_scoreboard = world.scoreboard.getObjective("mana")
      const estamina_scoreboard = world.scoreboard.getObjective("estamina")

      const jugador = ev.playerId;
      for (let keyl of world.getAllPlayers()) {
        if (keyl.id === jugador) {
          estamina_scoreboard.setScore(keyl, 0) ?? 0
          mana_scoreboard.setScore(keyl, 0) ?? 0
          keyl.onScreenDisplay.setTitle("§l§aSeja bem-vindo!\n" +  ev.playerName);
          world.sendMessage("Bem vindo " + ev.playerId);
          world.sendMessage("Bem vindxo " + ev.playerName);
            }
        }


        },TicksPerSecond * 7);

        
    });
