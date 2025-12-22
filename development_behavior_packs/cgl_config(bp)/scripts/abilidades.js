 import {world,  system, InputButton, ButtonState} from "@minecraft/server"

 

world.afterEvents.playerButtonInput.subscribe((ev) =>{
    const dash_scoreboard = world.scoreboard.getObjective("dash")
    const {player, button, newButtonState} = ev
    const dash_score = dash_scoreboard.getScore(player) ?? 0
    if (button === InputButton.Jump && newButtonState === ButtonState.Pressed && !player.isOnGround) {
        if(dash_score > 0) {
            dash_scoreboard.addScore(player, -1)
        }
        }
    })

system.runInterval(()=>{
     const dash_max_scoreboard = world.scoreboard.getObjective("dash_max")
     const dash_scoreboard = world.scoreboard.getObjective("dash")
    for (const player of world.getAllPlayers()) {
        const ViewDirection = player.getViewDirection()
    if (dash_score == 0) {
        player.applyKnockback(ViewDirection, ViewDirection.y)
    }
        const dash_max_score = dash_max_scoreboard.getScore(player) ?? 0
        if(player.isOnGround) {
            dash_scoreboard.setScore(player, dash_max_score)
        }
    }

    
 });