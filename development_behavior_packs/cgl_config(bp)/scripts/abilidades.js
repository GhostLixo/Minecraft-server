 import {world,  system} from "@minecraft/server"

 system.runInterval(()=>{
     const dash_scoreboard = world.scoreboard.getObjective("dash")
     const dash_max_scoreboard = world.scoreboard.getObjective("dash_max")
    for (const player of world.getAllPlayers()) {
        const dash_score = dash_scoreboard.getScore(player) ?? 0
        const dash_max_score = dash_max_scoreboard.getScore(player) ?? 0
        if(!player.isOnGround) {
            if(player.isJumping && dash_score > 0) {
                dash_scoreboard.addScore(player, -1)
            player.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, 1.5)
        }
        } else {
            dash_scoreboard.setScore(player, dash_max_score)
        }
    }
 
 });