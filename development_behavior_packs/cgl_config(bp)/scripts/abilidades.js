import { world, system, InputButton, ButtonState } from "@minecraft/server";

// 1. GATILHO DO DASH (PULO DUPLO)
world.afterEvents.playerButtonInput.subscribe((ev) => {
    const { player, button, newButtonState } = ev; // Definido no topo para evitar erro
    
    const dash_obj = world.scoreboard.getObjective("dash");
    const dj_obj = world.scoreboard.getObjective("double_jump");

    if (!dash_obj || !dj_obj) return;

    // Verifica se apertou Pulo e está no ar
    if (button === InputButton.Jump && newButtonState === ButtonState.Pressed && !player.isOnGround) {
        
        // Reduz o contador de pulos primeiro
        dj_obj.addScore(player, -1);
        const current_dj = dj_obj.getScore(player) ?? 0;
        const current_dash = dash_obj.getScore(player) ?? 0;

        // Se o score de pulo chegou a 1, significa que é o segundo clique no ar
        if (current_dj === 1 && current_dash > 0) {
            const view = player.getViewDirection();
            
            // Aplica o impulso (X, Z, Força_H, Força_V)
            player.applyKnockback(view.x, view.z, 1.5, 0.4);
            
            // Consome 1 de combustível de dash
            dash_obj.addScore(player, -1);
            
            // Efeito sonoro opcional
            player.playSound("mob.enderdragon.flap", { pitch: 1.5 });
        }
    }
});

// 2. SISTEMA DE RECARGA E RESET
system.runInterval(() => {
    const dash_obj = world.scoreboard.getObjective("dash");
    const max_obj = world.scoreboard.getObjective("dash_max");
    const dj_obj = world.scoreboard.getObjective("double_jump");

    if (!dash_obj || !max_obj || !dj_obj) return;

    for (const player of world.getAllPlayers()) {
        if (player.isOnGround) {
            const maxVal = max_obj.getScore(player) ?? 1;
            
            // Reseta o combustível para o valor máximo definido no score
            dash_obj.setScore(player, maxVal);
            
            // Reseta o contador de pulo duplo para 2
            // (2 = Pode pular / 1 = Dash disponível / 0 = Já usou tudo)
            dj_obj.setScore(player, 2);
        }
    }
}, 5);