 import {world,  system, InputButton, ButtonState} from "@minecraft/server"

 system.runInterval(()=>{
    world.afterEvents.playerButtonInput.subscribe((ev) =>{
        const {player, button, newButtonState} = ev
        const dash_scoreboard = world.scoreboard.getObjective("dash")
        const dash_max_scoreboard = world.scoreboard.getObjective("dash_max")
        const dash_score = dash_scoreboard.getScore(player) ?? 0
        const dash_max_score = dash_max_scoreboard.getScore(player) ?? 0
        if (button === InputButton.Jump && newButtonState === ButtonState.Released) {
            if(!player.isOnGround) {
            if(dash_score > 0) {
                const ViewDirection = player.getViewDirection()
                player.applyKnockback(ViewDirection, ViewDirection.y)
                dash_scoreboard.addScore(player, -1)
        }
        } else {
            dash_scoreboard.setScore(player, dash_max_score)
        }
        }
    })  
 });