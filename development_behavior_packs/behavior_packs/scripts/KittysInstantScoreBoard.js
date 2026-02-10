// ██╗███╗   ███╗██████╗  ██████╗ ██████╗ ████████╗███████╗
// ██║████╗ ████║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝
// ██║██╔████╔██║██████╔╝██║   ██║██████╔╝   ██║   ███████╗
// ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗   ██║   ╚════██║
// ██║██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║   ██║   ███████║
// ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝                                                       
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Database } from "index.js";
import { Player, world, system } from '@minecraft/server';

// ██╗   ██╗ █████╗ ██████╗ ██╗ █████╗ ██████╗ ██╗     ███████╗███████╗
// ██║   ██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝
// ██║   ██║███████║██████╔╝██║███████║██████╔╝██║     █████╗  ███████╗
// ╚██╗ ██╔╝██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ╚════██║
//  ╚████╔╝ ██║  ██║██║  ██║██║██║  ██║██████╔╝███████╗███████╗███████║
//   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝                                                               
let scoreboard = 'actionbar {"rawtext":[{"rawtext":[{"text": " §4§k44§r§o§4§l Kittys ScoreBoard Addon §4§k44§r\n"},{"text": "§7 Player: §6"},{"selector":"@s"}`'
let MONEY = "Money"
const ranksDb = new Database("Ranks");
const SettingsDb = new Database("Settings");
const Settingslanguage = new Database("language");
const colors = [
    '§f', // White       1
    '§1', // Dark Blue   2
    '§2', // Dark Green  3
    '§3', // Dark Aqua   4
    '§4', // Dark Red    5
    '§5', // Dark Purple 6
    '§6', // Gold        7
    '§7', // Gray        8
    '§8', // Dark Gray   9
    '§9', // Blue        10
    '§a', // Green       11
    '§b', // Aqua        12
    '§c', // Red         13
    '§d', // Pink        14
    '§e', // Yellow      15
];

const translations = {
    English: {
        timePlayed: "Time Played: §2",
        money: "Money: §6$",
        kdr: "KDR: §e",
        killstreak: "Killstreak: §4",
        playerKills: "Player Kills: §4",
        deaths: "Deaths: §4",
        warnings: "Warnings: §4",
        entities: "Entities: §4",
        rank: "Rank: ",
        online: "Online: §4",
        MemberCount: "Member Count: §6",
        blocksBroken: "Blocks Broken: §4",
        blocksPlaced: "Blocks Placed: §6",
        itemsUsed: "Items Used: §a",
        totalXP: "Current XP: §b",
        cps: "CPS: §b",
        realmCode: "Realm Code: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Player: §6"
    },
    French: {
        timePlayed: "Temps joué: §2",
        money: "Argent: §6$",
        kdr: "KDR: §e",
        killstreak: "Killstreak: §4",
        playerKills: "Tués joueurs: §4",
        deaths: "Morts: §4",
        warnings: "Avertissements: §4",
        entities: "Entités: §4",
        rank: "Rang: ",
        online: "En ligne: §4",
        MemberCount: "Nombre de membres : §6",
        blocksBroken: "Blocs cassés: §4",
        blocksPlaced: "Blocs placés: §6",
        itemsUsed: "Objets utilisés: §a",
        totalXP: "XP actuel: §b",
        cps: "CPS: §b",
        realmCode: "Code du royaume: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Joueur: §6"
    },
    German: {
        timePlayed: "Spielzeit: §2",
        money: "Geld: §6$",
        kdr: "KDR: §e",
        killstreak: "Killstreak: §4",
        playerKills: "Spielertötungen: §4",
        deaths: "Tode: §4",
        warnings: "Warnungen: §4",
        entities: "Entitäten: §4",
        rank: "Rang: ",
        online: "Online: §4",
        MemberCount: "Mitgliederanzahl: §6",
        blocksBroken: "Zerbrochene Blöcke: §4",
        blocksPlaced: "Platzierte Blöcke: §6",
        itemsUsed: "Verwendete Items: §a",
        totalXP: "Aktuelles XP: §b",
        cps: "CPS: §b",
        realmCode: "Realm Code: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Spieler: §6"
    },
    Spanish: {
        timePlayed: "Tiempo jugado: §2",
        money: "Dinero: §6$",
        kdr: "KDR: §e",
        killstreak: "Racha de muertes: §4",
        playerKills: "Muertes de jugadores: §4",
        deaths: "Muertes: §4",
        warnings: "Advertencias: §4",
        entities: "Entidades: §4",
        rank: "Rango: ",
        online: "En línea: §4",
        MemberCount: "Cantidad de miembros: §6",
        blocksBroken: "Bloques rotos: §4",
        blocksPlaced: "Bloques colocados: §6",
        itemsUsed: "Objetos utilizados: §a",
        totalXP: "XP actual: §b",
        cps: "CPS: §b",
        realmCode: "Código del reino: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Jugador: §6"
    },
    Italian: {
        timePlayed: "Tempo giocato: §2",
        money: "Denaro: §6$",
        kdr: "KDR: §e",
        killstreak: "Striscia di uccisioni: §4",
        playerKills: "Uccisioni di giocatori: §4",
        deaths: "Morti: §4",
        warnings: "Avvertimenti: §4",
        entities: "Entità: §4",
        rank: "Grado: ",
        online: "Online: §4",
        MemberCount: "Conteggio membri: §6",
        blocksBroken: "Blocchi rotti: §4",
        blocksPlaced: "Blocchi posizionati: §6",
        itemsUsed: "Oggetti usati: §a",
        totalXP: "XP attuale: §b",
        cps: "CPS: §b",
        realmCode: "Codice del regno: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Giocatore: §6"
    },
    Portuguese: {
        timePlayed: "Tempo jogado: §2",
        money: "Dinheiro: §6$",
        kdr: "KDR: §e",
        killstreak: "Matando sequência: §4",
        playerKills: "Kills de jogadores: §4",
        deaths: "Mortes: §4",
        warnings: "Advertências: §4",
        entities: "Entidades: §4",
        rank: "Rank: ",
        online: "Online: §4",
        MemberCount: "Contagem de membros: §6",
        blocksBroken: "Blocos quebrados: §4",
        blocksPlaced: "Blocos colocados: §6",
        itemsUsed: "Itens usados: §a",
        totalXP: "XP atual: §b",
        cps: "CPS: §b",
        realmCode: "Código do reino: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Jogador: §6"
    },
    Dutch: {
        timePlayed: "Speeltijd: §2",
        money: "Geld: §6$",
        kdr: "KDR: §e",
        killstreak: "Killstreak: §4",
        playerKills: "Spelers gedood: §4",
        deaths: "Doden: §4",
        warnings: "Waarschuwingen: §4",
        entities: "Entiteiten: §4",
        rank: "Rang: ",
        online: "Online: §4",
        MemberCount: "Aantal leden: §6",
        blocksBroken: "Gebroken blokken: §4",
        blocksPlaced: "Geplaatste blokken: §6",
        itemsUsed: "Gebruikte items: §a",
        totalXP: "Huidige XP: §b",
        cps: "CPS: §b",
        realmCode: "Realm code: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Speler: §6"
    },
    Russian: {
        timePlayed: "Время игры: §2",
        money: "Деньги: §6$",
        kdr: "KDR: §e",
        killstreak: "Убийства подряд: §4",
        playerKills: "Убийства игроков: §4",
        deaths: "Смерти: §4",
        warnings: "Предупреждения: §4",
        entities: "Сущности: §4",
        rank: "Ранг: ",
        online: "Онлайн: §4",
        MemberCount: "Количество участников: §6",
        blocksBroken: "Разрушенные блоки: §4",
        blocksPlaced: "Размещенные блоки: §6",
        itemsUsed: "Использованные предметы: §a",
        totalXP: "Текущий XP: §b",
        cps: "CPS: §b",
        realmCode: "Код мира: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "Игрок: §6"
    },
    Chinese: {
        timePlayed: "游戏时间: §2",
        money: "金币: §6$",
        kdr: "KDR: §e",
        killstreak: "连杀: §4",
        playerKills: "玩家击杀: §4",
        deaths: "死亡: §4",
        warnings: "警告: §4",
        entities: "实体: §4",
        rank: "排名: ",
        online: "在线: §4",
        MemberCount: "成员数: §6",
        blocksBroken: "破坏的方块: §4",
        blocksPlaced: "放置的方块: §6",
        itemsUsed: "使用的物品: §a",
        totalXP: "当前XP: §b",
        cps: "CPS: §b",
        realmCode: "领域代码: ",
        tikTok: "TikTok: ",
        youtube: "YouTube: ",
        discord: "Discord: ",
        playerName: "玩家: §6"
    }
}


// ███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗  █████╗ ██████╗ ██████╗      ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗██╗██╗   ██╗███████╗███████╗
// ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██║██║   ██║██╔════╝██╔════╝
// ███████╗██║     ██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████║██████╔╝██║  ██║    ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   ██║██║   ██║█████╗  ███████╗
// ╚════██║██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║    ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   ██║╚██╗ ██╔╝██╔══╝  ╚════██║
// ███████║╚██████╗╚██████╔╝██║  ██║███████╗██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝    ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ██║ ╚████╔╝ ███████╗███████║
// ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝╚══════╝

const objectives = [
    'Days', 'Hours', 'Minutes', 'Seconds', 'MSeconds', 'Warning', MONEY, 'deaths',
    'PlayersOn', 'Entites', 'welcomer', 'Members', 'BlocksBroken', 'BlocksPlaced',
    'ItemsUsed', 'PlayerKills', 'KDR', 'KDR0.1', 'KDR0.01', 'Killstreak', 'TotalXP', 'RealmCode', 'CoOwnerOwner',
    'TikTok', 'CPS'
];
objectives.forEach(obj => world.getDimension("overworld").runCommand(`scoreboard objectives add ${obj} dummy`));

// ████████╗██████╗  █████╗  ██████╗██╗  ██╗    ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗      █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
//    ██║   ██████╔╝███████║██║     █████╔╝     ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
//    ██║   ██╔══██╗██╔══██║██║     ██╔═██╗     ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
//    ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
//    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝                                                                                                                                                       
const trackAction = (eventName, objective, entityKey = "player") => {
    world.afterEvents[eventName].subscribe(event => {
        const entity = event[entityKey];
        if (entity instanceof Player) {
            world.getDimension("overworld").runCommand(`scoreboard players add "${entity.name}" ${objective} 1`);
        }
    });
};
trackAction("playerBreakBlock", "BlocksBroken");
trackAction("playerPlaceBlock", "BlocksPlaced");
trackAction("itemUse", "ItemsUsed", "source");

const objDB = {};
function getScore(target, objective) {
    try {
        return (objDB[objective] ??= world.scoreboard.getObjective(objective))?.getScore(target) ?? 0;
    } catch { return 0; }
};

const trackKDR = () => {
    world.getPlayers().forEach(player => {
        const playerKills = getScore(player, "PlayerKills") ?? 0;
        const deaths = getScore(player, "deaths") ?? 0;

        // Calculate KDR (division by 0 is handled by treating it as PlayerKills)
        const kdr = deaths > 0 ? playerKills / deaths : playerKills;

        // Split KDR into integer and decimal parts
        const kdr1 = Math.floor(kdr); // Integer part of KDR
        const kdr0_1 = Math.floor((kdr - kdr1) * 10);  // First decimal place (scaled by 10)
        const kdr0_01 = Math.floor((kdr - kdr1 - kdr0_1 / 10) * 100); // Second decimal place (scaled by 100)

        // Set the scores for each part of the KDR
        player.runCommandAsync(`scoreboard players set @s KDR ${kdr1}`);
        player.runCommandAsync(`scoreboard players set @s KDR0.1 ${kdr0_1}`);
        player.runCommandAsync(`scoreboard players set @s KDR0.01 ${kdr0_01}`);
    });
};

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource: { damagingEntity } }) => {
    if (damagingEntity instanceof Player) {
        if (deadEntity instanceof Player) {
            damagingEntity.runCommandAsync(`scoreboard players add @s PlayerKills 1`);
            damagingEntity.runCommandAsync(`scoreboard players add @s Killstreak 1`);
        }
    }
});

function getPlayerExperienceLevel(player) {
    let minLevel = 0;
    let maxLevel = 24791;
    let distance = maxLevel - minLevel;
    let playerIndex = -1;
    while (minLevel !== maxLevel) {
        playerIndex = [...world.getPlayers({ minLevel, maxLevel })].findIndex((pl) => pl === player);
        if (playerIndex > -1) {
            maxLevel -= Math.round(distance / 2);
        }
        else if (playerIndex === -1) {
            minLevel = maxLevel;
            maxLevel = maxLevel * 2;
        };
        distance = maxLevel - minLevel;
    };

    if (minLevel === 0 && maxLevel === 0 && playerIndex === 0) return 0;
    else return minLevel + 1;
};

const clicks = new Map();
world.afterEvents.entityHitBlock.subscribe(function ({ damagingEntity }) {
    if (!(damagingEntity instanceof Player)) return;
    const clickInfo = { timestamp: Date.now() };
    const playerClicks = clicks.get(damagingEntity) || [];
    playerClicks.push(clickInfo);
    clicks.set(damagingEntity, playerClicks);
    // Update CPS score on scoreboard
    const cps = getPlayerCPS(damagingEntity);
    world.getDimension("overworld").runCommand(
        `scoreboard players set "${damagingEntity.name}" CPS ${cps}`
    );
});

world.afterEvents.entityHitEntity.subscribe(function ({ damagingEntity }) {
    if (!(damagingEntity instanceof Player)) return;
    const clickInfo = { timestamp: Date.now() };
    const playerClicks = clicks.get(damagingEntity) || [];
    playerClicks.push(clickInfo);
    clicks.set(damagingEntity, playerClicks);
    // Update CPS score on scoreboard
    const cps = getPlayerCPS(damagingEntity);
    world.getDimension("overworld").runCommand(
        `scoreboard players set "${damagingEntity.name}" CPS ${cps}`
    );
});

function getPlayerCPS(player) {
    const currentTime = Date.now();
    const playerClicks = clicks.get(player) || [];
    const recentClicks = playerClicks.filter(({ timestamp }) => currentTime - 1000 < timestamp);
    clicks.set(player, recentClicks);
    return recentClicks.length;
};
// ██████╗ ███████╗██████╗ ██╗ ██████╗ ██████╗ ██╗ ██████╗    ███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗  █████╗ ██████╗ ██████╗     ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗███████╗
// ██╔══██╗██╔════╝██╔══██╗██║██╔═══██╗██╔══██╗██║██╔════╝    ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗    ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝
// ██████╔╝█████╗  ██████╔╝██║██║   ██║██║  ██║██║██║         ███████╗██║     ██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████║██████╔╝██║  ██║    ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗  ███████╗
// ██╔═══╝ ██╔══╝  ██╔══██╗██║██║   ██║██║  ██║██║██║         ╚════██║██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║    ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝  ╚════██║
// ██║     ███████╗██║  ██║██║╚██████╔╝██████╔╝██║╚██████╗    ███████║╚██████╗╚██████╔╝██║  ██║███████╗██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝    ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗███████║
// ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝    ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝                                                                                                                                                                                                       
system.runInterval(() => {
    const allRanks = ranksDb.getAll();
    const defaultRank = SettingsDb.get('KittysScoreboardSettings:DefaultRank') || " ";

    allRanks.forEach(DBrank => updateScoreboardForRank(DBrank));
    trackKDR();
    world.getPlayers().forEach(Player => {

        const playerLevel = getPlayerExperienceLevel(Player);
        world.getDimension("overworld").runCommand(`scoreboard players set "${Player.name}" TotalXP ${playerLevel}`);
        world.getDimension("overworld").runCommand(`scoreboard players set @a CPS 0`);
        objectives.forEach(obj => world.getDimension("overworld").runCommand(`scoreboard players add @a ${obj} 0`));

        if (defaultRank && defaultRank !== " " && allRanks.length > 0) {
            let hasRank = false;

            // Check if player already has any rank
            for (const rank of allRanks) {
                if (Player.hasTag(rank)) {
                    hasRank = true;
                    break;
                }
            }
            if (!hasRank) {
                world.getDimension("overworld").runCommand(`tag "${Player.name}" add "${defaultRank}"`);
                Player.sendMessage(`§aYou have been assigned the default rank: §b${defaultRank}`);
            }
        }
    });
}, Math.max(1, Number(SettingsDb.get('KittysScoreboardSettings:ScoreBoardSpeed')) || 1));

// ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ███████╗ █████╗  ██████╗██╗  ██╗    ██████╗  █████╗ ███╗   ██╗██╗  ██╗
// ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██╔══██╗██╔════╝██║  ██║    ██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝
// ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      █████╗  ███████║██║     ███████║    ██████╔╝███████║██╔██╗ ██║█████╔╝ 
// ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██╔══╝  ██╔══██║██║     ██╔══██║    ██╔══██╗██╔══██║██║╚██╗██║██╔═██╗ 
// ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ███████╗██║  ██║╚██████╗██║  ██║    ██║  ██║██║  ██║██║ ╚████║██║  ██╗
//  ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝                                                                                                                      
const updateScoreboardForRank = (DBrank) => {
    const savedSettings = getSavedSettings();
    scoreboard = buildScoreboard(savedSettings, DBrank);
    if (savedSettings.sidebar) {
        world.getDimension("overworld").runCommand(`execute @a[tag="${DBrank}"] ~~~ titleraw @s ${scoreboard}]}`);
    } else {
        world.getDimension("overworld").runCommand(`execute @a ~~~ titleraw @s title {"rawtext":[{"text":" "}]}`);
        world.getDimension("overworld").runCommand(`execute @a[tag="${DBrank}"] ~~~ titleraw @s ${scoreboard}]}`);
    }

    if (savedSettings.Welcome) {
        world.getDimension("overworld").runCommand('execute @a[scores={welcomer=..1}] ~~~ scoreboard players add MemberCounter Members 1');
        world.getDimension("overworld").runCommand('scoreboard players operation @a Members = MemberCounter Members');
        world.getDimension("overworld").runCommand(`execute @a[scores={welcomer=..1}] ~~~ tellraw @a {"rawtext":[{"text":"§d§l[§c§kt§r§d§lWorld Guard§c§kt§r§d§l]§e§l "},{"selector":"@s"},{"text":" ${savedSettings.WelcomeTitle}"},{"score":{"name":"*","objective":"Members"}},{"text":" §dMembers"}]}`);
        world.getDimension("overworld").runCommand('scoreboard players set @a welcomer 5');
    } else { return }
};

// ███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗     ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
// ███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗    ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║   
// ╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║   
// ███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║   
// ╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝                                                                                                                                   
const getSavedSettings = () => {
    const settingsKeys = [
        'bold', 'tiny', 'italic', 'timePlayed', 'money', 'deaths', 'warnings',
        'entities', 'rank', 'online', 'blocksBroken', 'blocksPlaced', 'itemsUsed',
        'playerKills', 'sidebar', 'PlayerName',
        'kdr', 'killstreak', 'totalXP', 'cps', 'Welcome', 'MemberCount'
    ];

    const savedSettings = {
        TitleColor: SettingsDb.get('KittysScoreboardSettings:TitleColor') || '1',
        Scoreboardspeed: SettingsDb.get('KittysScoreboardSettings:ScoreBoardSpeed') || '1',
        OnlineValue: SettingsDb.get('KittysScoreboardSettings:OnlineValue') || '1',
        Title: SettingsDb.get('KittysScoreboardSettings:Title') || 'SkyGen',
        WelcomeTitle: SettingsDb.get('KittysScoreboardSettings:WelcomeTitle') || "\\n§r§o§7-------------------------------------\\n§bIs Joining For The First Time!!\\n§6Enjoy Your Stay And Have Fun!!! :D§d\\nWe Now Have:§c ",
        Title_Descrption: SettingsDb.get('KittysScoreboardSettings:Title_Descrption') || 'Map By: Example',
        objective_money: SettingsDb.get('KittysScoreboardSettings:Objective_Money') || 'Money',
        Youtube_Descrption: SettingsDb.get('KittysScoreboardSettings:Youtube_Descrption') || 'YT: KittyShizz',
        Discord_Descrption: SettingsDb.get('KittysScoreboardSettings:Discord_Descrption') || 'DC: KittyShizzBuilds!',
        TikTok: SettingsDb.get('KittysScoreboardSettings:TikTok') || 'TikToK: KittyShizzBuilds!',
        RealmCode: SettingsDb.get('KittysScoreboardSettings:RealmCode') || 'Realm Code: Here',
        coOwnerOwner: SettingsDb.get('KittysScoreboardSettings:coOwnerOwner') || 'Owner: KittyShizz',
        DefaultRank: SettingsDb.get('KittysScoreboardSettings:DefaultRank') || '1',
    };

    settingsKeys.forEach(key => {
        savedSettings[key] = SettingsDb.get(`KittysScoreboardSettings:${key}`) === "1";
    });

    return savedSettings;
};

// ███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗  █████╗ ██████╗ ██████╗      ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗
// ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
// ███████╗██║     ██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████║██████╔╝██║  ██║    ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║   
// ╚════██║██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║   
// ███████║╚██████╗╚██████╔╝██║  ██║███████╗██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║   
// ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝                                                                                                                                                                                                                                                                                                                                                   
const buildScoreboard = (settings, DBrank) => {
    const savedLanguage = Settingslanguage.get('KittysScoreboardSettingslanguage') || "English";
    const lang = translations[savedLanguage] || translations["English"];
    MONEY = SettingsDb.get('KittysScoreboardSettings:Objective_Money') || 'Money'
    let OnlineValue = SettingsDb.get('KittysScoreboardSettings:OnlineValue') || '1'
    const onlinevalue = Number(OnlineValue);

    let scoreboard = 'actionbar {"rawtext":[';
    if (settings.sidebar) scoreboard = `title {"rawtext":[`;

    // Title and formatting
    if (settings.bold) scoreboard += `{"text": "§l"},`;
    if (settings.tiny) scoreboard += `{"text": "✨"},`;
    if (settings.italic) scoreboard += `{"text": "§o"},`;
    if (settings.TitleColor) {
        const selectedColor = colors[settings.TitleColor - 1];
        scoreboard += `{"text": "${selectedColor}"},`;
    }

    if (settings.Title && settings.Title.trim() !== "") {
        scoreboard += `{"text": "${settings.Title.trim()}"},`;
    }
    if (settings.Title_Descrption && settings.Title_Descrption.trim() !== "") {
        scoreboard += `{"text": "§7\n ${settings.Title_Descrption.trim()}"},`;
    }

    // Co-Owner/Owner
    if (settings.coOwnerOwner && settings.coOwnerOwner.trim() !== "") {
        scoreboard += `{"text": "§7\n ${settings.coOwnerOwner.trim()}"},`;
    }

    // Scoreboard details
    if (settings.timePlayed)
        scoreboard += `{"text": "§7\n ${lang.timePlayed}"}, {"score":{"name":"*","objective":"Days"}},{"text":"D "},{"score":{"name":"*","objective":"Hours"}},{"text":"H "},{"score":{"name":"*","objective":"Minutes"}},{"text":"M "},{"score":{"name":"*","objective":"Seconds"}},{"text":"S"},`;
    if (settings.money)
        scoreboard += `{"text": "§7\n ${lang.money}"}, {"score":{"name":"*","objective":"${MONEY}"}},`;
    if (settings.kdr)
        scoreboard += `{"text": "§7\n ${lang.kdr}"}, {"score":{"name":"*","objective":"KDR"}}, {"text": "."},{"score":{"name":"*","objective":"KDR0.1"}}, {"score":{"name":"*","objective":"KDR0.01"}},`;
    if (settings.killstreak)
        scoreboard += `{"text": "§7\n ${lang.killstreak}"}, {"score":{"name":"*","objective":"Killstreak"}},`;
    if (settings.playerKills)
        scoreboard += `{"text": "§7\n ${lang.playerKills}"}, {"score":{"name":"*","objective":"PlayerKills"}},`;
    if (settings.deaths)
        scoreboard += `{"text": "§7\n ${lang.deaths}"}, {"score":{"name":"*","objective":"deaths"}},`;
    if (settings.warnings)
        scoreboard += `{"text": "§7\n ${lang.warnings}"}, {"score":{"name":"*","objective":"Warning"}},`;
    if (settings.entities)
        scoreboard += `{"text": "§7\n ${lang.entities}"}, {"score":{"name":"*","objective":"Entites"}},`;
    if (settings.rank)
        scoreboard += `{"text": "§7\n ${lang.rank}${DBrank}"},`;
    if (settings.online)
        scoreboard += `{"text": "§7\n ${lang.online}"}, {"score":{"name":"*","objective":"PlayersOn"}},{"text": " / ${onlinevalue}"},`;
    if (settings.MemberCount)
        scoreboard += `{"text": "§7\n ${lang.MemberCount}"}, {"score":{"name":"*","objective":"Members"}},`;
    if (settings.blocksBroken)
        scoreboard += `{"text": "§7\n ${lang.blocksBroken}"}, {"score":{"name":"*","objective":"BlocksBroken"}},`;
    if (settings.blocksPlaced)
        scoreboard += `{"text": "§7\n ${lang.blocksPlaced}"}, {"score":{"name":"*","objective":"BlocksPlaced"}},`;
    if (settings.itemsUsed)
        scoreboard += `{"text": "§7\n ${lang.itemsUsed}"}, {"score":{"name":"*","objective":"ItemsUsed"}},`;
    if (settings.totalXP)
        scoreboard += `{"text": "§7\n ${lang.totalXP}"}, {"score":{"name":"*","objective":"TotalXP"}},`;
    if (settings.cps)
        scoreboard += `{"text": "§7\n ${lang.cps}"}, {"score":{"name":"*","objective":"CPS"}},`;

    // Realm code and social media
    if (settings.RealmCode && settings.RealmCode.trim() !== "") {
        scoreboard += `{"text": "\n§7 ${settings.RealmCode.trim()}"},`;
    }
    if (settings.TikTok && settings.TikTok.trim() !== "") {
        scoreboard += `{"text": "\n§7 ${settings.TikTok.trim()}"},`;
    }
    if (settings.Youtube_Descrption && settings.Youtube_Descrption.trim() !== "") {
        scoreboard += `{"text": "\n§7 ${settings.Youtube_Descrption.trim()}"},`;
    }
    if (settings.Discord_Descrption && settings.Discord_Descrption.trim() !== "") {
        scoreboard += `{"text": "\n§7 ${settings.Discord_Descrption.trim()}"},`;
    }

    // Player name
    if (settings.PlayerName) {
        scoreboard += `{"text": "\n§7 ${lang.playerName}"}, {"selector":"@s"},`;
    }

    scoreboard += `{"text": ""}`;
    return scoreboard;
};

// ██╗   ██╗██╗    ██╗███╗   ██╗████████╗███████╗██████╗  █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██║   ██║██║    ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║   ██║██║    ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝███████║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██║   ██║██║    ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╔╝██║    ██║██║ ╚████║   ██║   ███████╗██║  ██║██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚═════╝ ╚═╝    ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
world.beforeEvents.itemUse.subscribe(data => {
    const player = data.source;
    if (!player || data.itemStack.typeId !== "kittys:scoreboard_menu") return;
    system.run(() => showMainMenu(player));

    function showMainMenu(player) {
        const customUi = new ActionFormData()
            .title("Kittys Scoreboard Main Menu")
            .body("")
            .button("§fScoreboard Settings", "textures/ui/accessibility_glyph_color")
            .button("§fAdd Rank", "textures/ui/icon_best3")
            .button("§fClear Rank", "textures/ui/enable_editor")
            .button("§fSet Language", "textures/ui/gear")
            .button("§fDiscord", "textures/ui/blue_info_glyph")

        customUi.show(player).then(response => {
            if (response.canceled) return;
            switch (response.selection) {

                // ███████╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗  █████╗ ██████╗ ██████╗     ███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗
                // ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝
                // ███████╗██║     ██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║███████║██████╔╝██║  ██║    ███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗
                // ╚════██║██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║    ╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║
                // ███████║╚██████╗╚██████╔╝██║  ██║███████╗██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝    ███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║
                // ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝                                                                                                                                     
                case 0:
                    const savedSettings = getSavedSettings();
                    const titleColorValue = Number(savedSettings.TitleColor);
                    const scoreboardspeedvalue = Number(savedSettings.Scoreboardspeed);
                    const onlinevalue = Number(savedSettings.OnlineValue);

                    // Get all ranks from database
                    const allRanks = ranksDb.getAll();
                    let rankNames = [];
                    if (allRanks.length === 0) {
                        rankNames = ["§cPlease add ranks first!"]; // Fake placeholder
                    } else {
                        rankNames = allRanks;
                    }
                    const savedRank = savedSettings.DefaultRank || "";
                    const currentRankIndex = rankNames.includes(savedRank) ? rankNames.indexOf(savedRank) : 0;

                    const form = new ModalFormData()
                        .title('Kittys Settings Menu')
                        .textField('Add Title:✨\nThis Will Display Above The Scoreboard', 'SkyGen', savedSettings.Title)
                        .slider(`Pick Title Color:✨\n§r1:§f White    §r6:§5 Purple  §r11:§a Green\n§r2:§1 Dk Blue  §r7:§6 Gold    §r12:§b Aqua\n§r3:§2 Dk Green §r8:§7 Gray    §r13:§c Red\n§r4:§3 Dk Aqua  §r9:§8 DK Gray §r14:§d Pink\n§r5:§4 DK Red   §r10:§9 Blue   §r15:§e Yellow\nColor`, 1, 15, 1, titleColorValue)
                        .textField('Add Title Descrption:✨\nThis Will Display Below The Title', 'Map By: Example', savedSettings.Title_Descrption)
                        .textField('Co-Owner/Owner:✨', 'Owner: KittyShizz!', savedSettings.coOwnerOwner)

                        // Use ToggleText for better toggle labels
                        .toggle(ToggleText('Bold Font✨', savedSettings.bold), savedSettings.bold)
                        .toggle(ToggleText('Tiny Font✨', savedSettings.tiny), savedSettings.tiny)
                        .toggle(ToggleText('Italic Font✨', savedSettings.italic), savedSettings.italic)
                        .toggle(ToggleText('Time Played✨', savedSettings.timePlayed), savedSettings.timePlayed)
                        .toggle(ToggleText('Money✨', savedSettings.money), savedSettings.money)
                        .textField('Money Objective:✨\nChange The Objective Used To Display Money', 'Money', savedSettings.objective_money)
                        .toggle(ToggleText('KDR✨', savedSettings.kdr), savedSettings.kdr)
                        .toggle(ToggleText('Killstreak✨', savedSettings.killstreak), savedSettings.killstreak)
                        .toggle(ToggleText('Player Kills✨', savedSettings.playerKills), savedSettings.playerKills)
                        .toggle(ToggleText('Deaths✨', savedSettings.deaths), savedSettings.deaths)
                        .toggle(ToggleText('Warnings✨', savedSettings.warnings), savedSettings.warnings)
                        .toggle(ToggleText('Entities✨', savedSettings.entities), savedSettings.entities)
                        .toggle(ToggleText('Rank✨', savedSettings.rank), savedSettings.rank)
                        .toggle(ToggleText('Online✨', savedSettings.online), savedSettings.online)
                        .slider(`Set Max Players Online✨`, 10, 1000, 10, onlinevalue)
                        .toggle(ToggleText('Member Count ✨', savedSettings.MemberCount), savedSettings.MemberCount)
                        .toggle(ToggleText('Blocks Broken✨', savedSettings.blocksBroken), savedSettings.blocksBroken)
                        .toggle(ToggleText('Blocks Placed✨', savedSettings.blocksPlaced), savedSettings.blocksPlaced)
                        .toggle(ToggleText('Items Used✨', savedSettings.itemsUsed), savedSettings.itemsUsed)
                        .toggle(ToggleText('Current XP✨', savedSettings.totalXP), savedSettings.totalXP)
                        .toggle(ToggleText('CPS Counter✨', savedSettings.cps), savedSettings.cps)
                        .toggle(ToggleText('Set To SideBar✨', savedSettings.sidebar), savedSettings.sidebar)
                        .slider(`Set Score Board Update Speed \n(Smaller Number Faster Updates)✨`, 1, 1000, 10, scoreboardspeedvalue)

                        .textField('Add Youtube✨\nThis Will Display Below The Scoreboard', 'YT: KittyShizz', savedSettings.Youtube_Descrption)
                        .textField('Add Discord✨\nThis Will Display Below The Scoreboard', 'DC: KittyShizzBuilds!', savedSettings.Discord_Descrption)
                        .textField('Add TikTok✨\nThis Will Display Below The Scoreboard', 'TikToK: KittyShizzBuilds!', savedSettings.TikTok)
                        .textField('Add Realm Code✨\nThis Will Display Below The Scoreboard', 'Realm Code: Here', savedSettings.RealmCode)

                        .toggle(ToggleText('Player Name ✨', savedSettings.PlayerName), savedSettings.PlayerName)
                        .toggle(ToggleText('Player Welcome Message: ON/OFF ✨', savedSettings.Welcome), savedSettings.Welcome)
                        .textField('Edit Welcome Message:✨\nThis Will Display When A New Player Joins!', '\\n§r§o§7-------------------------------------\\n§bIs Joining For The First Time!!\\n§6Enjoy Your Stay And Have Fun!!! :D§d\\nWe Now Have:§c ', savedSettings.WelcomeTitle)
                        .dropdown("Set The Default Rank:✨", rankNames, currentRankIndex)

                    // Function to generate toggle text dynamically
                    function ToggleText(label, toggleValue) {
                        const status = toggleValue ? 'Enabled' : 'Disabled';
                        const colorCode = toggleValue ? '§a' : '§c'; // Green for Enabled, Red for Disabled
                        return `${colorCode}[${status}] ${label}`;
                    }


                    form.show(player).then(response => {
                        if (response.canceled) {
                            showMainMenu(player);
                            return;
                        }
                        const [
                            Title,                // TextField: Title
                            TitleColor,           // Slider: Title Color
                            Title_Descrption,     // TextField: Title Description
                            coOwnerOwner,         // TextField: Co-Owner/Owner
                            bold,                 // Toggle: Bold Font
                            tiny,                 // Toggle: Tiny Font
                            italic,               // Toggle: Italic Font
                            timePlayed,           // Toggle: Time Played
                            money,                // Toggle: Money
                            objective_money,      // Toggle: Money Objective
                            kdr,                  // Toggle: KDR
                            killstreak,           // Toggle: Killstreak
                            playerKills,          // Toggle: Player Kills
                            deaths,               // Toggle: Deaths
                            warnings,             // Toggle: Warnings
                            entities,             // Toggle: Entities
                            rank,                 // Toggle: Rank
                            online,               // Toggle: Online 
                            onlinevalue,          // Toggle: Online Value
                            MemberCount,          // Toggle: Member Count
                            blocksBroken,         // Toggle: Blocks Broken
                            blocksPlaced,         // Toggle: Blocks Placed
                            itemsUsed,            // Toggle: Items Used
                            totalXP,              // Toggle: Current XP
                            cps,                  // Toggle: CPS Counter
                            sidebar,              // Toggle: Set to Sidebar
                            scoreboardspeed,      // Slider: Set to Sidebar
                            Youtube_Descrption,   // TextField: YouTube Description
                            Discord_Descrption,   // TextField: Discord Description
                            tiktok,               // TextField: TikTok
                            realmCode,            // TextField: Realm Code
                            PlayerName,            // Toggle: Player Name
                            Welcome,               // Toggle: Player Welcome Message
                            WelcomeTitle,               // Edit: Player Welcome Message
                            DefaultRankIndex       // Dropdown: Default Rank
                        ] = response.formValues;

                        const selectedRank = (!rankNames[DefaultRankIndex] || rankNames[DefaultRankIndex] === "§cPlease add ranks first!") ? " " : rankNames[DefaultRankIndex];

                        SettingsDb.set('KittysScoreboardSettings:Title', Title.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:TitleColor', `${TitleColor}`);
                        SettingsDb.set('KittysScoreboardSettings:ScoreBoardSpeed', `${scoreboardspeed}`);
                        SettingsDb.set('KittysScoreboardSettings:OnlineValue', `${onlinevalue}`);
                        SettingsDb.set('KittysScoreboardSettings:Title_Descrption', Title_Descrption.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:Objective_Money', objective_money.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:Youtube_Descrption', Youtube_Descrption.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:Discord_Descrption', Discord_Descrption.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:TikTok', tiktok.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:RealmCode', realmCode.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:coOwnerOwner', coOwnerOwner.trim() || ' ');
                        SettingsDb.set('KittysScoreboardSettings:WelcomeTitle', WelcomeTitle.trim() || '\\n§r§o§7-------------------------------------\\n§bIs Joining For The First Time!!\\n§6Enjoy Your Stay And Have Fun!!! :D§d\\nWe Now Have:§c ');
                        SettingsDb.set('KittysScoreboardSettings:DefaultRank', selectedRank.trim() || ' ');
                        if (objective_money.trim() !== "Money") {
                            world.getDimension("overworld").runCommand(`scoreboard objectives add ${objective_money} dummy`);
                            MONEY = objective_money
                        }
                        if (allRanks.length === 0) {
                            world.sendMessage("§cMake Sure To Add A Rank And Tag Yourself With The Rank To See The ScoreBoard!");
                        }

                        const settings = {
                            bold, tiny, italic, timePlayed, money, kdr, killstreak,
                            playerKills, deaths, warnings, entities, rank, online, blocksBroken,
                            blocksPlaced, itemsUsed, totalXP, cps, sidebar, PlayerName, Welcome, MemberCount
                        };

                        Object.keys(settings).forEach(key => {
                            SettingsDb.set(`KittysScoreboardSettings:${key}`, settings[key] ? "1" : "0");
                        });

                    });
                    break;


                //  █████╗ ██████╗ ██████╗     ██████╗  █████╗ ███╗   ██╗██╗  ██╗███████╗
                // ██╔══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝██╔════╝
                // ███████║██║  ██║██║  ██║    ██████╔╝███████║██╔██╗ ██║█████╔╝ ███████╗
                // ██╔══██║██║  ██║██║  ██║    ██╔══██╗██╔══██║██║╚██╗██║██╔═██╗ ╚════██║
                // ██║  ██║██████╔╝██████╔╝    ██║  ██║██║  ██║██║ ╚████║██║  ██╗███████║
                // ╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝                                                                     
                case 1:
                    (async () => {
                        const form = new ModalFormData()
                            .title('Kittys Add Ranks Menu')
                            .textField('Add Ranks\nThis Will Display Above The Scoreboard✨', '§l§6Member§r, §dVip');
                        const response = await form.show(player);
                        if (response.canceled || !response.formValues[0]) return showMainMenu(player);
                        try {
                            ranksDb.new(response.formValues[0]);
                            world.sendMessage(`Rank added: ${response.formValues[0]}`);
                            world.sendMessage(`§cMake Sure To Tag Yourself With The Rank: §6${response.formValues[0]}\n§cIf You Want To See That ScoreBoard!\n§2/tag @s add "${response.formValues[0]}"`);
                        } catch (error) {
                            world.sendMessage(`Failed to add rank: ${error.message}`);
                        } finally {
                            showMainMenu(player);
                        }
                    })();
                    break;

                // ██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗    ██████╗  █████╗ ███╗   ██╗██╗  ██╗███████╗
                // ██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝    ██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝██╔════╝
                // ██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗      ██████╔╝███████║██╔██╗ ██║█████╔╝ ███████╗
                // ██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝      ██╔══██╗██╔══██║██║╚██╗██║██╔═██╗ ╚════██║
                // ██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗    ██║  ██║██║  ██║██║ ╚████║██║  ██╗███████║
                // ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝                                                                                            
                case 2:
                    (async () => {
                        const allRanks = ranksDb.getAll();
                        if (allRanks.length === 0) {
                            world.sendMessage("No ranks to remove.");
                            return;
                        }
                        let page = 0;
                        const totalPages = Math.ceil(allRanks.length / 5); // Total pages
                        while (true) {
                            const start = page * 4;
                            const end = start + 4;

                            const form = new ActionFormData()
                                .title("Kittys Remove Ranks Menu")
                                .body(`Select a Rank to Remove:\nPage: ${page + 1} of ${totalPages}✨`);
                            allRanks.slice(start, end).forEach((rank) => {
                                form.button(` §l§cRemove:\n §l§r[ ${rank} ]✨`, "textures/ui/anvil_icon");
                            });
                            if (page > 0) {
                                form.button(` §o§1Last Page\n §3[ Page: ${page} ]✨`, "textures/ui/generic_dpad_left");
                            }
                            if (end < allRanks.length) {
                                form.button(` §o§1Next Page\n §3[ Page: ${page + 2} ]✨`, "textures/ui/generic_dpad_right");
                            }
                            form.button("§l§cMain\nMenu✨", "textures/ui/icon_map");
                            const response = await form.show(player);

                            if (response.canceled) {
                                showMainMenu(player);
                                return;
                            }
                            const selectedRankIndex = response.selection;
                            const totalButtonsOnPage = allRanks.slice(start, end).length;
                            const hasPreviousButton = page > 0 ? 1 : 0;
                            const hasNextButton = end < allRanks.length ? 1 : 0;
                            if (selectedRankIndex === totalButtonsOnPage + hasPreviousButton + hasNextButton) {
                                showMainMenu(player);
                                return;
                            }
                            if (page > 0 && selectedRankIndex === totalButtonsOnPage) {
                                page--;
                                continue; // Go to the previous page
                            }
                            if (end < allRanks.length && selectedRankIndex === totalButtonsOnPage + hasPreviousButton) {
                                page++;
                                continue; // Go to the next page
                            }
                            const rankToRemove = allRanks[start + selectedRankIndex];
                            if (!rankToRemove) {
                                return;
                            }
                            try {
                                const ConfirmForm = new ActionFormData()
                                    .title('Confirm Removal')
                                    .body(`Are you sure you want to remove the rank: §l${rankToRemove}§r?✨`)
                                    .button("§fGo Back\n✨", "textures/ui/icon_map")
                                    .button(`§fRemove: §l${rankToRemove}§r?✨`, "textures/ui/anvil_icon")

                                const confirmResponse = await ConfirmForm.show(player);

                                if (confirmResponse.selection === 1) {
                                    try {
                                        ranksDb.del(rankToRemove);
                                        world.sendMessage(`Rank removed: ${rankToRemove}`);
                                        return

                                    } catch (error) {
                                        console.warn(error);
                                        world.sendMessage("Error occurred while removing rank.");
                                        return
                                    }
                                }
                                showMainMenu(player);
                            } catch (error) {
                                world.sendMessage("Error occurred while showing the confirmation dialog.");
                            }
                        }
                    })();
                    break;
                // ██╗      █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗  ██████╗ ███████╗    ███╗   ███╗███████╗███╗   ██╗██╗   ██╗
                // ██║     ██╔══██╗████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔════╝ ██╔════╝    ████╗ ████║██╔════╝████╗  ██║██║   ██║
                // ██║     ███████║██╔██╗ ██║██║  ███╗██║   ██║███████║██║  ███╗█████╗      ██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║
                // ██║     ██╔══██║██║╚██╗██║██║   ██║██║   ██║██╔══██║██║   ██║██╔══╝      ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║
                // ███████╗██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║╚██████╔╝███████╗    ██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝
                // ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ 
                case 3:
                    (async () => {
                        // Get the stored language name, default to "English" if not set
                        const savedLanguage = Settingslanguage.get('KittysScoreboardSettingslanguage') || "English";
                        const languages = [
                            "English",
                            "French",
                            "German",
                            "Spanish",
                            "Italian",
                            "Portuguese",
                            "Dutch",
                            "Russian",
                            "Chinese"
                        ];
                        const languageIndex = languages.indexOf(savedLanguage);

                        const form = new ModalFormData()
                            .title('Kittys Set Language Menu')
                            .dropdown("Language", languages, languageIndex);

                        const response = await form.show(player);
                        if (response.canceled || response.formValues[0] === undefined) return showMainMenu(player);

                        try {
                            const selectedLanguageIndex = response.formValues[0]; // Get the selected language index
                            const selectedLanguage = languages[selectedLanguageIndex];

                            Settingslanguage.set('KittysScoreboardSettingslanguage', selectedLanguage); // Store the language name
                            world.sendMessage(`Language Changed: ${selectedLanguage}`);
                        } catch (error) {
                            console.warn(`Failed to change language: ${error.message}`);
                        }
                    })();
                    break;
                // ██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗     ███╗   ███╗███████╗███╗   ██╗██╗   ██╗
                // ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗    ████╗ ████║██╔════╝████╗  ██║██║   ██║
                // ██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║    ██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║
                // ██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║    ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║
                // ██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝    ██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝
                // ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝             
                case 4:
                    (async () => {
                        try {
                            // Getting the player name, default to "Guest" if undefined.
                            const playerName = player.name || "Guest";

                            // First ActionForm: Discord invitation
                            const result = await new ActionFormData()
                                .title("Kittys Discord!")
                                .body(`§l§o§aHello, ${playerName}!\nJoin our community on Discord! Wohoo!!\n§5/dsc.gg/KittysBuilds✨\nCheck Out The Build Bot For Realms!!\nWith Over 600+ Builds!`)
                                .button("§l§cCredits✨", "textures/ui/absorption_effect") // Index 1
                                .show(player);

                            // Check the player's selection
                            if (!result) {
                                showMainMenu(player);
                                return;
                            }

                            //  ██████╗██████╗ ███████╗██████╗ ██╗████████╗███████╗    ███╗   ███╗███████╗███╗   ██╗██╗   ██╗
                            // ██╔════╝██╔══██╗██╔════╝██╔══██╗██║╚══██╔══╝██╔════╝    ████╗ ████║██╔════╝████╗  ██║██║   ██║
                            // ██║     ██████╔╝█████╗  ██║  ██║██║   ██║   ███████╗    ██╔████╔██║█████╗  ██╔██╗ ██║██║   ██║
                            // ██║     ██╔══██╗██╔══╝  ██║  ██║██║   ██║   ╚════██║    ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║
                            // ╚██████╗██║  ██║███████╗██████╔╝██║   ██║   ███████║    ██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝
                            //  ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝                         
                            switch (result.selection) {
                                case 0:
                                    // Credits button
                                    const creditsResult = await new ActionFormData()
                                        .title("Credits!!")
                                        .body(`§l§o§6Credits: \n§dKitty Shizz Addon's\nWith Over 575 Builds!!\n§dKitty Shizz §b[Dev]\n§dShuit §b[Dev], §dShwp §b[Dev]\n§dDeter §b[Dev], §cPuggo §6[Tester],\n§cs0ar_dizzy §6[Ideas] Thank You, ${player.name}! \nAnd To Everyone Else Too!✨`)
                                        .button("§l§cMain Menu✨", "textures/ui/icon_map")
                                        .show(player);

                                    // If the player clicks the main menu button in the credits
                                    if (creditsResult) {
                                        showMainMenu(player);
                                    }
                                    break;

                                default:
                                    showMainMenu(player);
                                    break;
                            }
                        } catch (error) {
                            console.error("An error occurred in the form handling:", error);
                        }
                    })();
                    break;
            }
        });
    }
});

// 888    d8P  d8b 888    888                   .d8888b.  888      d8b                        888888b.            d8b 888      888               888
// 888   d8P   Y8P 888    888                  d88P  Y88b 888      Y8P                        888  "88b           Y8P 888      888               888
// 888  d8P        888    888                  Y88b.      888                                 888  .88P               888      888               888
// 888d88K     888 888888 888888 888  888       "Y888b.   88888b.  888 88888888 88888888      8888888K.  888  888 888 888  .d88888 .d8888b       888
// 8888888b    888 888    888    888  888          "Y88b. 888 "88b 888    d88P     d88P       888  "Y88b 888  888 888 888 d88" 888 88K           888
// 888  Y88b   888 888    888    888  888            "888 888  888 888   d88P     d88P        888    888 888  888 888 888 888  888 "Y8888b.      Y8P
// 888   Y88b  888 Y88b.  Y88b.  Y88b 888      Y88b  d88P 888  888 888  d88P     d88P         888   d88P Y88b 888 888 888 Y88b 888      X88       "
// 888    Y88b 888  "Y888  "Y888  "Y88888       "Y8888P"  888  888 888 88888888 88888888      8888888P"   "Y88888 888 888  "Y88888  88888P'      888
//                                    888
//                               Y8b d88P
//                                "Y88P"                                                                                                             