// scripts/main.ts
import { world, system, TicksPerSecond } from "@minecraft/server";
world.afterEvents.playerJoin.subscribe((ev) => {
  system.runTimeout(() => {
    const jugador = ev.playerId;
    for (let keyl of world.getAllPlayers()) {
      if (keyl.id === jugador) {
        keyl.onScreenDisplay.setTitle("\xA7l\xA7aSeja bem-vindo!");
      }
    }
  }, TicksPerSecond * 7);
});

//# sourceMappingURL=../debug/main.js.map
