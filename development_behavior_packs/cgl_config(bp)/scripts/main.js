import { world, system } from "@minecraft/server"
import "./saudacao"
import "./status"
import "./abilidades"
import "./animal_status"
import "./painel_adm"
import "./teste"

world.afterEvents.worldLoad.subscribe(() => {
    const a = world.scoreboard.addObjective("killcount", "Kills:");
    system.runTimeout(() => { 
    a
}, 100);
});

