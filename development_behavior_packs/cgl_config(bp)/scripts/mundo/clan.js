import {
  world,
  system,
  CommandPermissionLevel,
  CustomCommandStatus,
  StructureSaveMode
} from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((ev) => {
    
    if (ev.message == "clan"){
        world.sendMessage("Clan teste");
    }
});

system.beforeEvents.startup.subscribe((init) => {
    const comandoPersonalizado2 = { //criando um objeto e definindo suas propriedades
        name: "clan:painel2", // nome do comando 
        description: "teste", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
        permissionLevel: CommandPermissionLevel.Any // Niveis de permissão 
    };
    init.customCommandRegistry.registerCommand(comandoPersonalizado2, comandinho);
  // param 1 recebe as informações do objeto
  // param 2 você deve passar uma função para o segundo parametro
  // é obrigatorio criar uma função para executar o que você deseja
    const sairdoclan = { 
        name: "clan:sairdoclan", 
        description: "teste", 
        permissionLevel: CommandPermissionLevel.Any 
    };
    init.customCommandRegistry.registerCommand(sairdoclan, Sairclan);
});


function comandinho() {
    system.run(() => {
        const fabricio = world.getAllPlayers().filter((player) => player.name == "Fabricio7560");
        fabricio[0].setDynamicProperty("nivelClan", 1);
        fabricio[0].setDynamicProperty("doclan", "admin");
        
    });
    return {
        status: CustomCommandStatus.Success,
    };
}

function Sairclan(){
    system.run(() => {
        const fabricio = world.getAllPlayers().filter((player) => player.name == "Fabricio7560");
        fabricio[0].setDynamicProperty("nivelClan", 0);
        fabricio[0].setDynamicProperty("doclan", "civil");});
    return {
        status: CustomCommandStatus.Success,
    };
}

