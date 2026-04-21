import { world, system } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { DBCarregarClansName, DBCarregarListaMembros, TextoBilhete, arrayMembros, formconvitarMembro,
         form_ListarMembros, form_sairclan, formcriaclan, arrayclan, MostrarClans,  DeixarBilhete,
         form_VerBilhete, form_MostrarRegras, arrayClanRegras, form_definirouVerRegras,
         form_expulsarMembro}
         from  "./Sistema_De_Clan"



world.afterEvents.itemUse.subscribe((ev) => {
    const item = ev.itemStack;
    const player = ev.source;
    if (item.typeId === "minecraft:compass") { system.run(() => {Form_abrirMenuPrincipal(player);}); }
});

    //menu principal
function Form_abrirMenuPrincipal(player) {
    const main_form = new ActionFormData();
    main_form.title("MENU PRINCIPAL");
    main_form.label(`Clã --> ${player.getDynamicProperty("doclan")}`);

    if (player.getDynamicProperty("doclan") == "civil") 
           { main_form.button("|>>>  Clãs  <<<|");  }
    else   { main_form.button("=--- Meu Clã ---="); }
        
    main_form.button("Banco");
    if (player.hasTag("admin")) { main_form.button("admin");}


    main_form.show(player).then((response) => {
        if (response.canceled) { return; }
        switch (response.selection) {
            case 0:
                abrirMenuClan(player);
                break;
            case 1:
                abrirMenuPay(player);
                break;
            case 2:
                abrirMenuAdmin(player);
                break;
        }
    });
}

    
function abrirMenuPay(player) {
      const money = world.scoreboard.getObjective("money");
      const saldoAtual = money.getScore(player) || 0;
      if (saldoAtual <= 0) {
        player.sendMessage(
          "§cVocê não tem dinheiro suficiente para realizar transferências.",
        );
        return;
      }
      const pay_form = new ModalFormData();
      const player_alvo = world.getAllPlayers().filter((p) => p.name != player.name)
      const player_list = player_alvo.map(p => p.name);
      pay_form.dropdown("players", player_list);
      pay_form.slider("valor", 0, money.getScore(player));

      pay_form.submitButton("transferir");

      pay_form.show(player).then((response) => {
        if (response.canceled) {
          pay_form = null; return;
        } else {
          const [dropdownValue, quantidadeDinheiro] = response.formValues;
          money.addScore(player, -quantidadeDinheiro);
          money.addScore(player_alvo[dropdownValue], quantidadeDinheiro);
          player.sendMessage(`vc trasferiu ${quantidadeDinheiro} para ${player_list[dropdownValue]} `)
          player_alvo[dropdownValue].sendMessage(`vc recebeu ${quantidadeDinheiro} de ${player.name}`)
        }
      });
}
    

    /////////////////////////////////////////// Clan/////////////
function abrirMenuClan(player){
    DBCarregarListaMembros(player.getDynamicProperty("doclan"));// O servidor do banco de dados deve estar ativo
const formMenuClan = new ActionFormData()
    .title("Clan Menu")
    if (player.getDynamicProperty("doclan") != "civil") {
        switch (player.getDynamicProperty("nivelClan")){
            case 1: // O Membro tem os botão
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Bilhetes dos Superiores");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
            case 2: // Os Membros braços tem os botão
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Bilhetes dos Superiores");
                formMenuClan.button("Deixar Bilhete");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("Expulsar Membro");
                formMenuClan.button("Convidar Civil");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
            case 3: // Botões do lider do clã
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Deixar Bilhete");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("Promover Membro");
                formMenuClan.button("Rebaixar Membro");
                formMenuClan.button("Expulsar Membro");
                formMenuClan.button("Convidar Civil");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
        }
    } 
    else { // Botões do Civil
        formMenuClan.button("Criar Clã", "textures/ui/plus.png");
        formMenuClan.button("Ver lista de Clãs");
    }
        

    
    formMenuClan.show(player).then((response) => {
        if (response.canceled) { return; }///////////////////////////////////    Form Civil

        if (player.getDynamicProperty("doclan") == "civil"){
            DBCarregarClansName();
        
            switch (response.selection){
                case 0: // Criar clã
                    if (arrayclan.length < 10){
                        formcriaclan(player);
                    }
                    else {
                        player.sendMessage("O Limite máximo de clãs foi atingido!");
                    }
                    
                    break;
                case 1: // Ver lista de clã
                    console.log("Array --> " +arrayclan);
                    console.log("Array --> " + typeof(arrayclan.toString()));
                    MostrarClans(player, arrayclan);
                    break;
            }
        } 
        else if (player.getDynamicProperty("nivelClan") == 1){ // Membro Comum do clã
            switch (response.selection){
                case 0:// Informação
                    console.log("case0 nicel 1");
                    break;
                case 1:// Regras
                    console.log("case1 nivel 1 ");
                    break;
                case 2:// Bilhetes
                    console.log("case2 nivel 1");
                    if (TextoBilhete.length == 0){
                        form_VerBilhete(player, "Não há bilhetes no momento...");
                        
                    }
                    else {
                        for (let x in TextoBilhete){
                            if (TextoBilhete[x].clanName == player.getDynamicProperty("doclan")){
                                VerBilhete(player, TextoBilhete[x].recado)
                            }else { console.log("Não tem bilhete para voce"); }
                        }
                    }
                console.log("Bilhete 1 --> " ,TextoBilhete.length);
                //VerBilhete(player, TextoBilhete[0].recado);
                break;

                case 3:// Membros
                    console.log("case3 nivel 1");
                    form_membrosclan(player);
                break;
                case 4:// Sair do clã
                    form_sairclan(player);
                    console.log("case4 nivel 1");
                break;
            }
        }
        else if (player.getDynamicProperty("nivelClan") == 3){
            switch (response.selection) {
            case 0:
                console.log("case0 else");
                form_definirouVerRegras(player);

                //formmeuclan(player)
                break;
            case 1:
                if (TextoBilhete.length == 0){
                    const aviso = "Não há bilhetes no momento..."
                    VerBilhete(player, aviso);
                    console.log("simasas");
                }else {
                    for (let x in TextoBilhete){
                        if (TextoBilhete[x].clanName == player.getDynamicProperty("doclan")){
                            VerBilhete(player, TextoBilhete[x].recado)
                    }else {
                        console.log("Não tem bilhete para voce");
                    }

                }
            }
                console.log("Bilhete 1 --> " ,TextoBilhete.length);
                console.log("case1");
                //formlistclans(player)
                break;
            case 2:
                DeixarBilhete(player)
                console.log("case2");
                //formconvitarMembro(player)
                break;
            case 3:
                console.log("case3");
                form_ListarMembros(player, arrayMembros)
                break;
            case 4:
                console.log("case4");
                formconvitarMembro(player);
                break;
            case 5:
                console.log("case5");
                form_sairclan(player);
                break;
            case 6: 
                console.log("Case 6 nivel 3");
                form_expulsarMembro(player);    
            break;
            case 7: 
                console.log("Case 7 nivel 3");
                formconvitarMembro(player);
            break;
            case 8:
                console.log("case 8 nivel 3");
                form_sairclan(player);
            break;
            }
            
        }
        else {
            switch (response.selection){
                case 0:// Informação
                console.log("case0 nivel 2");
                break;
                case 1:// Regra
                console.log("case1 nivel 2");
                break;
                case 2:// Bilhetes
                console.log("case2 nivel 2");
                console.log("Bilhete 1 --> " ,TextoBilhete[0].recado)
                //VerBilhete(player, TextoBilhete[0].recado);
                
                break;
                case 3:// Membros
                console.log("case3 nivel 2");
                form_membrosclan(player);
                break;
                case 4:// Sair do clã
                console.log("case4 nivel 2");
                break;
            }
        }
    });
}

    //////////////////////////////////////////

    function abrirMenuAdmin(player) {
        const admin_form = new ActionFormData();
        admin_form.button("criativo");
        admin_form.button("sobrevivencia");
        admin_form.button("ficar invisivel");
        admin_form.button("aparecer")

        admin_form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("fechou o painel")
            }
            switch (response.selection) {
              case 0:
                player.setGameMode("Creative");
                break;
              case 1:
                player.setGameMode("Survival");
                break;
              case 2:
                // 2000000 é o valor padrão para "infinito" no Minecraft Bedrock
                player.addEffect("minecraft:invisibility", 2000000, {
                  showParticles: false,
                });
                break;
            case 3:
                player.removeEffect("minecraft:invisibility").
                break;
            }
        })
    }

    world.afterEvents.playerSpawn.subscribe((ev) => {
        const player = ev.player;
        if (ev.initialSpawn === true) {
            if (player.getDynamicProperty("doclan") === undefined) {
                player.setDynamicProperty("doclan", "civil");
            }
            if (player.getDynamicProperty("temconvite?") === undefined) {
                player.setDynamicProperty("temconvite?", false);
            }

        }
    });

    
    


