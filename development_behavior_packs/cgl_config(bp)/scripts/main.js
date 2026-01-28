import { world} from "@minecraft/server"
import "./saudacao"
import "./status"
import "./abilidades"
import "./animal_status"
import "./painel_adm"
import "./Contador_de_Kill"

world.afterEvents.worldLoad.subscribe(() => {

     let Garantindo_OBJ_Killcount = world.scoreboard.getObjective("killcount");
     if(Garantindo_OBJ_Killcount == undefined){
        world.scoreboard.addObjective("killcount", "Kills:");
     }

});

