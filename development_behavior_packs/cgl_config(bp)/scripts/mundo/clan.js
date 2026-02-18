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

// revele re resd /re res
System
system.beforeEvents.startup.subscribe((init) => {
  const comandoPersonalizado = { //criando um objeto e definindo suas propriedades
    name: "clan:painel", // nome do comando 
    description: "teste", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
    permissionLevel: CommandPermissionLevel.Any // Niveis de permissão 
  };
  init.customCommandRegistry.registerCommand(comandoPersonalizado, comandinho);

  
   const comandoPersonalizado2 = { //criando um objeto e definindo suas propriedades
    name: "clan:painel2", // nome do comando 
    description: "teste", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
    permissionLevel: CommandPermissionLevel.Any // Niveis de permissão 
  };
  init.customCommandRegistry.registerCommand(comandoPersonalizado2, comandinho);
  // param 1 recebe as informações do objeto
  // param 2 você deve passar uma função para o segundo parametro
  // é obrigatorio criar uma função para executar o que você deseja
});
function comandinho() {
  world.sendMessage("Fabricio gayyyyyyyyyyyyyyyyyyyyyyy");
  return {
    status: CustomCommandStatus.Success,
  };
}

