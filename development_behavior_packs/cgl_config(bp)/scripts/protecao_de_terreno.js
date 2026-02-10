import { world } from "@minecraft/server";

const Area_quadrada_Minima = {
    x: 60,      y: 60,     z: 155    };

const Area_quadrada_Maxima = { 
    x: 200,     y: 100,    z: 236    };



world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    
    const bloco = ev.player.getHeadLocation(); // A posição do jogador tem varias casas decimais kkkkkk
    if ( Math.floor(bloco.x) >= Area_quadrada_Minima.x && Math.floor(bloco.x) <= Area_quadrada_Maxima.x &&
         Math.floor(bloco.y) >= Area_quadrada_Minima.y && Math.floor(bloco.y) <= Area_quadrada_Maxima.y &&
         Math.floor(bloco.z) >= Area_quadrada_Minima.z && Math.floor(bloco.z) <= Area_quadrada_Maxima.z ) 
        {
            ev.cancel = true;
    }
});