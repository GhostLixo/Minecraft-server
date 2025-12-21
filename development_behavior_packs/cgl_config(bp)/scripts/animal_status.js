import { world, system } from "@minecraft/server"

system.runInterval(() =>{

    for (const animal of world.getDimension("overworld").getEntities()){
        const vida_score = animal.getComponent("health") 
        animal.nameTag(`vida: ${vida_score.currentValue}`)
    }
})