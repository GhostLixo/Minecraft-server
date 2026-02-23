import { world, system} from "@minecraft/server"


function updade_stats(entity) {
    if (entity.hasComponent("health")) {
    const health = entity.getComponent("health");
    entity.nameTag = `${entity.typeId.replace(/_/g, " ").split("minecraft:")[1]} §r[§c${health.currentValue.toFixed()}§r/§c${health.effectiveMax}§r]`
    }
}

world.afterEvents.entitySpawn.subscribe((ev) => {
  const entity = ev.entity;
  updade_stats(entity)

});

world.afterEvents.entityHurt.subscribe((ev) =>{
    const entity = ev.hurtEntity
   updade_stats(entity)
   
})

