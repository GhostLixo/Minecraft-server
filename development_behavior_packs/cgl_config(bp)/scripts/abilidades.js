 import {world,  system, InputButton, ButtonState} from "@minecraft/server"
 // double_jump_scoreboard do player = 2

world.afterEvents.playerButtonInput.subscribe((ev) =>{
    const double_jump_scoreboard = world.scoreboard.getObjective("double_jump")

    const {player, button, newButtonState} = ev

    const ViewDirection = player.getViewDirection()

    const dash_scoreboard = world.scoreboard.getObjective("dash")
    const dash_score = dash_scoreboard.getScore(player) ?? 0
    const double_jump_score = double_jump_scoreboard.getScore(player) ?? 0
    //verificação se o player apertou o botão de jump
    if (button === InputButton.Jump && newButtonState === ButtonState.Pressed && !player.isOnGround) {
        if (double_jump_score > 0) {
            double_jump_scoreboard.addScore(player, -1)
        }
        if (button === InputButton.Jump && newButtonState === ButtonState.Pressed && double_jump_score === 0 && dash_score > 0) {
            //funçao de dash
            player.applyKnockback(ViewDirection, ViewDirection.y)
            dash_scoreboard.addScore(player, -1)
        }  
    }
    })

system.runInterval(()=>{
    const dash_max_scoreboard = world.scoreboard.getObjective("dash_max")
    const double_jump_scoreboard = world.scoreboard.getObjective("double_jump")
    const dash_scoreboard = world.scoreboard.getObjective("dash")

    for (const player of world.getAllPlayers()) {
        const dash_max_score = dash_max_scoreboard.getScore(player) ?? 0
        if(player.isOnGround) {

            dash_scoreboard.setScore(player, dash_max_score)
            double_jump_scoreboard.setScore(player, 1)
            
    }

}
 });