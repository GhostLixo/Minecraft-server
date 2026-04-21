import {world, system, CommandPermissionLevel, CustomCommandStatus, Entity, CustomCommandSource, CustomCommandOrigin } from "@minecraft/server";
import { ClaName } from "./Sistema_De_Clan"

 
 




// Bloco de teste



system.beforeEvents.startup.subscribe((init) => {
    const AceitarConvitedeClan = { //criando uma variavel objeto e definindo suas propriedades
        name: "clan:aceitarconvite", // nome do comando 
        description: "Você foi convidado para um clã", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
        permissionLevel: CommandPermissionLevel.Any };// Niveis de permissão 

    init.customCommandRegistry.registerCommand(AceitarConvitedeClan, (origin) => {
        if (!origin.sourceEntity.getDynamicProperty("temconvite?")){
            origin.sourceEntity.sendMessage("Você não recebeu nenhum convite!"); 
            return { status: 0};
        }
        else {
                origin.sourceEntity.setDynamicProperty("doclan", ClaName);
                    origin.sourceEntity.setDynamicProperty("nivelClan", 1);
                        origin.sourceEntity.sendMessage("Parabens! Você agora faz parte do clã --> " + ClaName);
                            origin.sourceEntity.setDynamicProperty("temconvite?", false);
                                return { status: 1};
        }
    });


    // const definirRegras = {
    //     name: "clan:criarregras",
    //     description: "Definir REGRAS do clã",
    //     permissionLevel: CommandPermissionLevel.Any
    // };
    // init.customCommandRegistry.registerCommand(definirRegras, )
    

    
    const comandoPersonalizado2 = { //criando uma variavel objeto e definindo suas propriedades
        name: "clan:painel2", // nome do comando 
        description: "teste", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
        permissionLevel: CommandPermissionLevel.Any };// Niveis de permissão 

    init.customCommandRegistry.registerCommand(comandoPersonalizado2, comandinho);
  // param 1 recebe as informações do objeto
  // param 2 você deve passar uma função para o segundo parametro
  // é obrigatorio criar uma função para executar o que você deseja
    const sairdoclan = { 
        name: "clan:sairdoclan", 
        description: "teste", 
        permissionLevel: CommandPermissionLevel.Any };
    init.customCommandRegistry.registerCommand(sairdoclan, Sairclan);
    

    // const AceitarConvitedeClan = { //criando uma variavel objeto e definindo suas propriedades
    //     name: "clan:aceitarconvite", // nome do comando 
    //     description: "teste", // Descrevendo o que ele faz por exemplo --> Abrir painel do clan
    //     permissionLevel: CommandPermissionLevel.Any };// Niveis de permissão 

    // init.customCommandRegistry.registerCommand(AceitarConvitedeClan, AceitarConvite);
});

// function AceitarConvite(){

// }

function comandinho() {
    system.run(() => {
        const fabricio = world.getAllPlayers().filter((player) => player.name == "Fabricio7560");
        fabricio[0].setDynamicProperty("nivelClan", 3);
        fabricio[0].setDynamicProperty("doclan", "werew");
        
    });
    return {
        status: CustomCommandStatus.Success
    };
}

function Sairclan(){
    system.run(() => {
        const fabricio = world.getAllPlayers().filter((player) => player.name == "Fabricio7560");
        fabricio[0].setDynamicProperty("nivelClan", 0);
        fabricio[0].setDynamicProperty("doclan", "civil");});
    return {
        status: CustomCommandStatus.Success
    };

}

