import { world, system} from "@minecraft/server"
const Area_quadradaMinima = {
    x: 60,      y: 60,     z: 155
};
const Area_quadradaMaxima = { 
    x: 200,       y: 100,      z: 236
};



world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    
    const bloco = ev.player.getHeadLocation(); // A posição do jogador tem varias casas decimais kkkkkk
    if ( Math.floor(bloco.x) >= Area_quadradaMinima.x && Math.floor(bloco.x) <= Area_quadradaMaxima.x &&
         Math.floor(bloco.y) >= Area_quadradaMinima.y && Math.floor(bloco.y) <= Area_quadradaMaxima.y &&
         Math.floor(bloco.z) >= Area_quadradaMinima.z && Math.floor(bloco.z) <= Area_quadradaMaxima.z ) 
        {
            ev.cancel = true;
            ev.player.sendMessage("Você não pode");
    }
    

});
//Contador de kills

// Primeiro remover a tag do mob que matou,
//  assim evita mostrar a tag em ingles

world.afterEvents.entityDie.subscribe((ev) => {
//     let mobAgressor = ev.damageSource.damagingEntity.nameTag;
//     if (ev.deadEntity.typeId == "minecraft:player") {
//         let removeTAG = ev.damageSource.damagingEntity;// Mob Agressor
//         removeTAG.removeTag(mobAgressor); // Remove a tag do mob que matou o player
//         world.sendMessage("Tag removida do mob: " + mobAgressor);
//         }
    



//     // let removerTag = ev.damageSource.damagingEntity;// Mob Agressor
//     // if (removerTag?.typeId != "minecraft:player"){ // Se player morreu pro mob
//     //     let RemoverTag = ev.damageSource.damagingEntity.nameTag; // Pega as tags do mob que matou o playe
//     //     world.sendMessage("Tags da entidade morta: " + RemoverTag);
//     //     console.log("Tags da entidade morta: " + RemoverTag);
//     //     world.sendMessage("Tag removida");

//     // }

    
    if (ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;// Apenas player x player, se for mob agressor ignora
    let killcount = world.scoreboard.getObjective("killcount");              //   que o jogador nao matou
    system.runTimeout(() => {
    const vitima = ev.deadEntity.typeId;
    const PlayerAssassino = ev.damageSource.damagingEntity?.typeId;
        if (vitima == "minecraft:player") {
            //world.sendMessage("Um player matou outro player.");
            if (PlayerAssassino == "minecraft:player") {
                //world.sendMessage(vitima + " moreeu");
                killcount.addScore(ev.damageSource.damagingEntity, +1)
            }
        }
    }, 10);
});



