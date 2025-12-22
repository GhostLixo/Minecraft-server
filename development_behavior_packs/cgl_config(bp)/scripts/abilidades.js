 import {world,  system, InputButton, ButtonState} from "@minecraft/server"

 

world.afterEvents.playerButtonInput.subscribe((ev) =>{
    const dash_scoreboard = world.scoreboard.getObjective("dash")
    const double_jump_scoreboard = world.scoreboard.getObjective("double_jump")
    const double_jump_score = double_jump_scoreboard.getScore(player) ?? 0
    const ViewDirection = player.getViewDirection()
    const {player, button, newButtonState} = ev
    const dash_score = dash_scoreboard.getScore(player) ?? 0
    if (button === InputButton.Jump && newButtonState === ButtonState.Pressed && !player.isOnGround) {
        if (double_jump_score == 0 && dash_score > 0) {
        player.applyKnockback(ViewDirection, ViewDirection.y)
    }
        if(dash_score > 0) {
            double_jump_scoreboard.addScore(player, -1)
        }
        }
    })

system.runInterval(()=>{
    const dash_scoreboard = world.scoreboard.getObjective("dash")
     const dash_max_scoreboard = world.scoreboard.getObjective("dash_max")
    for (const player of world.getAllPlayers()) {
          const dash_score = dash_scoreboard.getScore(player) ?? 0
        const dash_max_score = dash_max_scoreboard.getScore(player) ?? 0
        if(player.isOnGround) {
            dash_scoreboard.setScore(player, dash_max_score)
            dash_scoreboard.setScore(player, 2)
            
    }

}
 });