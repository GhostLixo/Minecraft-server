import { world, system } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { formmeuclan,  formconvitarMembro,
    form_membrosclan, form_expulsarmembro,
    form_promovermembro, form_rebaixarmembro,
    form_sairclan, formcriaclan, arrayclan, MostrarClans} from  "./clan_ex"

system.run(() => {
    world.afterEvents.itemUse.subscribe((ev) => {
        const item = ev.itemStack
        const player = ev.source

        if (item.typeId === "minecraft:compass") {
            abrirMenuPrincipal(player);
            console.log("Do cla -->" + player.getDynamicProperty("doclan"));
            console.log("Valor cla -->" + player.getDynamicProperty("nivelClan") + typeof(player.getDynamicProperty("nivelClan")));
            if (player.getDynamicProperty("nivelClan") >= 3){
                console.log("true");
            }else{
                console.log("false");
            }
            if (player.getDynamicProperty("doclan") != "civil"){
                console.log("Sim é diferente de civil");
            }
        }
    })
})
    
    //menu principal
    function abrirMenuPrincipal(player) {
        const main_form = new ActionFormData();
        main_form.title("menu");
        main_form.label(
            `Id [${player.getDynamicProperty("id")}]\n`+
            `idade 18 | sexo M\nClã --> ${player.getDynamicProperty("doclan")}`);
        main_form.button("status");
        //if (player.getDynamicProperty("clan") == "civil") {main_form.button("clan")};
        if (player.getDynamicProperty("doclan") == "civil") 
              {main_form.button("|>>>  Clãs  <<<|");
        }else {main_form.button("--- Meu Clã ---");}
        
        main_form.button("pay");
        if (player.hasTag("admin")) { main_form.button("admin");}


        main_form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("esta off");
            }
            switch (response.selection) {
                case 0:
                    abrirMenuStatus(player);
                    break;
                case 1:
                    abrirMenuClan(player);
                    break;
                case 2:
                    abrirMenuPay(player);
                    break;
                case 3:
                    abrirMenuAdmin(player);
                    break;
            }
        });
    }
    //////////////////////////////////////

    //menu status
    function abrirMenuStatus(player) {
        const status_form = new ActionFormData();
        status_form.title("status");
        status_form.label(`             bem vindo\n   ${player.name}\n`+
            `   força ${player.getDynamicProperty("strength")}\n`+
            `   velocidade ${player.getDynamicProperty("velocity")}`
        )
        status_form.button("up força");
        status_form.button("up velociade");
        status_form.button("up jump");
        status_form.button("volta");

        status_form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("ola vc saiu");
            }

            switch (response.selection) {
                case 0:

                    break;
                case 1:

                    break;
                case 2:

                    break;
                case 3:
                    abrirMenuPrincipal(player);
                    break;}
        })}
    ///////////////////////////////////////////////////////////////////
    
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
          player.sendMessage("teste54165");
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
const formMenuClan = new ActionFormData()
    .title("Clan Menu")
    if (player.getDynamicProperty("doclan") != "civil") {
        switch (player.getDynamicProperty("nivelClan")){
            case 1:
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Bilhetes dos Superiores");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
            case 2:
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Bilhetes dos Superiores");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
            case 3:
                formMenuClan.button("Informações do Clã");
                formMenuClan.button("Regras do Clã");
                formMenuClan.button("Deixar Bilhete");
                formMenuClan.button("Membros do Clã", "textures/ui/people.png");
                formMenuClan.button("Convidar Civil");
                formMenuClan.button("§cSair do Clã",    "textures/ui/close.png");
                break;
        }
    } else {
        console.log("aqui");
        formMenuClan.button("Criar Clã", "textures/ui/plus.png");
        formMenuClan.button("Ver lista de Clãs");
    }
    // switch(player.getDynamicProperty("nivelClan")){
    //             case 3: 
    //                 formMenuClan.button("membros do Clan", "textures/ui/people.png");
    //                 formMenuClan.button("Clan List",       "textures/ui/list.png");
                    
    //                 formMenuClan.button("convidar membros para o Clan", "textures/ui/plus.png");
    //                 formMenuClan.button("expulsar membros do Clan",     "textures/ui/close.png");
    //                 formMenuClan.button("sair do Clan",    "textures/ui/close.png");
    //                 break;
                
    //             case 1: 
    //                 formMenuClan
    //                 .button("convidar membros para o Clan", "textures/ui/plus.png")
    //                 .button("expulsar membros do Clan", "textures/ui/close.png")
    //             break;
    //             case 2: 
    //                 formMenuClan
    //                 .button("promover membros do Clan", "textures/ui/plus.png")
    //                 .button("rebaixar membros do Clan", "textures/ui/minus.png");
    //             break;
    //             default:
    //                 formMenuClan
    //                 .button("criar Clan", "textures/ui/plus.png")
    //                 .button("Clan List", "textures/ui/list.png");

    //         }
            
    //     //                Nivel 1
    //     if (player.getDynamicProperty("nivelClan") == 1) {formMenuClan
    //         .button("meu Clan", "textures/ui/eye.png")
    //         .button("membros do Clan", "textures/ui/people.png")
    //         .button("Clan List", "textures/ui/list.png")
    //         .button("sair do Clan", "textures/ui/close.png")}
    //     //                Nivel 2 
    //     else if (player.getDynamicProperty("nivelClan") >= 2) {formMenuClan
    //             .button("convidar membros para o Clan", "textures/ui/plus.png")
    //             .button("expulsar membros do Clan", "textures/ui/close.png")}
    //     //                Nivel 3        
    //     else if (player.getDynamicProperty("nivelClan") <= 3) {formMenuClan
    //             .button("promover membros do Clan", "textures/ui/plus.png")
    //             .button("rebaixar membros do Clan", "textures/ui/minus.png");}}
    // else {  formMenuClan
    //         .button("criar Clan", "textures/ui/plus.png")
    //         .button("Clan List", "textures/ui/list.png");
    // }
        
    formMenuClan.show(player).then((response) => {
        if (response.canceled) {
            return;}
        if (player.getDynamicProperty("doclan") == "civil"){
            ///////////////////////////////////    Form Civil
            switch (response.selection){
                case 0:// Criar clã
                    formcriaclan(player);
                    break;
                case 1:// Ver lista de clã
                    console.log("Array --> " +arrayclan);
                    console.log("Array --> " + typeof(arrayclan.toString()));
                    MostrarClans(player, arrayclan);
                    break;
            }
        } else {
            switch (response.selection) {
            case 0:
                console.log("case0 else");
                //formmeuclan(player)
                break;
            case 1:
                console.log("case1");
                //formlistclans(player)
                break;
            case 2:
                console.log("case2");
                //formconvitarMembro(player)
                break;
            case 3:
                console.log("case3");
                //formmembrosclan(player)
                break;
            case 4:
                console.log("case4");
                formconvitarMembro(player)
                break;
            case 5:
                console.log("case5");
                form_sairclan(player);
                break;
            case 6:
                console.log("case6")
                form_rebaixarmembro(player)
                break;
            case 7:
                console.log("case7")
                form_sairclan(player)
                break;
            case 8:
                console.log("case8")
                
                break;
            case 9:
                console.log("case9")
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
            player.sendMessage("surgiu");
            if (player.getDynamicProperty("id") === undefined) {
                player.setDynamicProperties({
                    "id": Math.floor(Math.random() * 999999999) + 1,
                    "strength": 0,
                    "velocity": 0
                });
            }
            if (player.getDynamicProperty("doclan") === undefined) {
                player.setDynamicProperty("doclan", "civil");
            }
        }
    });

    
    


