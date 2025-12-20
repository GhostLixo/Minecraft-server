import { world, system } from "@minecraft/server";
system.run(() => {
    const Lista_de_JogadoresAtivos = world.getAllPlayers();
    world.afterEvents.playerJoin.subscribe(() => {
        if (Lista_de_JogadoresAtivos.length > 0) {
            // Ativa quando tem mais de 1 jogador
            Lista_de_JogadoresAtivos[0].onScreenDisplay.setTitle("Hello World");
            Lista_de_JogadoresAtivos[0].onScreenDisplay.updateSubtitle("Welcome to the server!");
        }
        world.sendMessage("Quantidade de jogadores = " + Lista_de_JogadoresAtivos[0]);
        console.log("jogadores ativos = " + Lista_de_JogadoresAtivos[0] + " " + Lista_de_JogadoresAtivos.length);
    });
    world.afterEvents.playerLeave.subscribe(() => {
        world.sendMessage("Numero de jogadores = " + Lista_de_JogadoresAtivos[0]);
        console.log("jogadores ativos = " + Lista_de_JogadoresAtivos[0] + " " + Lista_de_JogadoresAtivos.length);
        console.log("tets");
    });
});
//# sourceMappingURL=main.js.map