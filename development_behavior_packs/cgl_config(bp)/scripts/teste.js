import { world, system, Scoreboard } from "@minecraft/server"

//Contador de kills
world.afterEvents.entityDie.subscribe((ev) => {
    if (ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;// PAra ignorar mortes dos mobs
    let killcount = world.scoreboard.getObjective("killcount");
    system.runTimeout(() => {
    const vitima = ev.deadEntity.typeId;
    const PlayerAssassino = ev.damageSource.damagingEntity?.typeId;
        if (vitima == "minecraft:player") {
            world.sendMessage("Um player matou outro player.");
            if (PlayerAssassino == "minecraft:player") {
                world.sendMessage(vitima + " moreeu");
                killcount.addScore(ev.damageSource.damagingEntity, +1)
            }
        }
    }, 10);
});