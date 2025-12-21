import { world, system } from "@minecraft/server"

system.runInterval(() =>{
    for (const animal of world.getDimension("overworld").getEntities()){
        animal.nameTag(`${animal.nameTag}\nvida: ${animal.getComponent("health").currentValue}`)
    }
})