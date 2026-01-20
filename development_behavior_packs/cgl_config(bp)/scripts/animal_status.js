import { world } from "@minecraft/server"

export function Mostrar_vida_do_mob (){
    for (const animal of world.getDimension("overworld").getEntities()){
        const vida_score = animal.getComponent("health")
        if(vida_score) {
            animal.nameTag = `${animal.typeId.replace("minecraft:", "")}\n ${vida_score.currentValue.toFixed(1)}`
        }
    }
}