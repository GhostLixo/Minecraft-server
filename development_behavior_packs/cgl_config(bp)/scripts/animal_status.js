import { world, system } from "@minecraft/server"

system.runInterval(() =>{
    for (const animal of world.getDimension("overworld").getEntities()){
        animal.nameTag(`vida: ${animal.getComponent("health").currentValue}`)
    }
})