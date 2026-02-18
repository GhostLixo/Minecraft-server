import { world, system } from "@minecraft/server"
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui"
//import { MinecraftEffectTypes } from "./util/vanilla-data.js"
//import {MinecraftEffectTypes} from "vanilla-data"

system.run(() => {
    
    //menu principal
    function abrirMenuPrincipal(player) {
        const main_form = new ActionFormData();
        main_form.title("menu")
        main_form.label(
            `Id [${player.getDynamicProperty("id")}] | name ${player.name}\n`+
            `       idade 18 | sexo M`)
        main_form.button("status")
        main_form.button("clan")
        main_form.button("pay")
        if (player.hasTag("admin")){
             main_form.button("admin")
        }

        main_form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("esta off")
            }
            switch (response.selection) {
                case 0:
                    abrirMenuStatus(player)
                    break;
                case 1:
                    abrirMenuClan(player);
                    break;
                case 2:
                    abrirMenuPay(player)
                    break;
                case 3:
                    abrirMenuAdmin(player)
                    break;
            }
        })
    }
    //////////////////////////////////////

    //menu status
    function abrirMenuStatus(player) {
        const status_form = new ActionFormData();
        status_form.title("status")
        status_form.label(`             bem vindo\n   ${player.name}\n`+
            `   força ${player.getDynamicProperty("strength")}\n`+
            `   velocidade ${player.getDynamicProperty("velocity")}`
        )
        status_form.button("up força")
        status_form.button("up velociade")
        status_form.button("up jump")
        status_form.button("volta")

        status_form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("ola vc saiu")
            }

            switch (response.selection) {
                case 0:

                    break;
                case 1:

                    break;
                case 2:

                    break;
                case 3:
                    abrirMenuPrincipal(player)
                    break;}
        })}
    /////////////////////////////////////////////////
    
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
    
    
    /////////////////////////////////////////// Clan
    function Clan_form_verMembros(player){
        const painelMembro = new ModalFormData();
        painelMembro.label("teste");
        painelMembro.submitButton("voltar")
        
        painelMembro.show(player)
        
    }
    function abrirMenuClan(player){

     const clan_form = new ActionFormData();
     clan_form.title("Painel do clan");
     clan_form.label("Informacoes");

     clan_form.button("Membros do cla");
     clan_form.button("Gerenciar membros");
     clan_form.button("Recrutar civil");

     clan_form.show(player).then((response) =>{
        if (response.canceled){
            //clan_form = null;
        }
        switch (response.selection){
            case 0:
                Clan_form_verMembros(player);
                break;
        }
     })

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
                player.removeEffect("minecraft:invisibility")
                break;
            }
        })
    }

    
    
    
    


    world.afterEvents.playerSpawn.subscribe((ev) => {
        const player = ev.player
        if (ev.initialSpawn === true) {
            player.sendMessage("surgiu")
            if (player.getDynamicProperty("id") === undefined) {
                player.setDynamicProperties({
                    "id": Math.floor(Math.random() * 999999999) + 1,
                    "strength": 0,
                    "velocity": 0,
                    "Clan": "Civil"
                })
            }

        }
    })

    
    world.afterEvents.itemUse.subscribe((ev) => {
        const item = ev.itemStack
        const player = ev.source

        if (item.typeId === "minecraft:compass") {
            abrirMenuPrincipal(player)
            
        }
    })
})


