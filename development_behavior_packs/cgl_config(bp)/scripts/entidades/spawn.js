import { world, system } from "@minecraft/server";

function spawn(mob_indice, quantiade, x, y, z) {
  const mobs = ["slime", "cow"];
  const mob = world.getDimension("overworld").getEntities({type: `minecraft:${mobs[mob_indice]}`}).filter((e) => e.hasTag("mob_teste")).length;
  //world.sendMessage(mob)
    for (let i = mob; i < quantiade; i++) {
      world
        .getDimension("overworld")
        .spawnEntity(
          `minecraft:${mobs[mob_indice]}`,
          { x, y, z },
          { initialPersistence: true },
        )
        .addTag("mob_teste");
        world.sendMessage(i.toString())
    }
}

world.afterEvents.entityDie.subscribe((ev) => {
  const { deadEntity } = ev;
  if (deadEntity.hasTag("mob_teste")) {
    spawn(1, 7, 89, 73, 6);
  }
});