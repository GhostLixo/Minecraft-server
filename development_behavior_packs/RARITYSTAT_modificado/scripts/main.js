import {
    world,
    system,
    EquipmentSlot,
    GameMode,
    ItemStack,
    MoonPhase,
    EntityDamageCause,
    CustomCommandStatus,
    CommandPermissionLevel,
    CustomCommandParamType
} from "@minecraft/server";
import {
    ActionFormData,
    ModalFormData,
    FormCancelationReason,
    uiManager
} from "@minecraft/server-ui";
import { 
    allWeapons, 
    allArmor, 
    meleeWeapons,
    rangedWeapons,
    tools,
    allItems,
    RARITY,
    blackList,
    TagMapping,
    MaterialRarity,
    ModMaterialRarity
} from './mainLib.js';
import {
    stats
} from './statsLib.js';
import {
    skills
} from './skillsLib.js';
import {
    passives
} from './passivesLib.js';
import { 
    EQUIPMENT_POWER, 
    EFFECTS, 
    MOB_LEVELS,
    DIVINE_TIER_DROPS
} from './divineMobs.js';
import {
    DIVINE_STATS
} from './divineStats.js';
import {
    DIVINE_SKILLS
} from './divineSkills.js';
import {
    DIVINE_PASSIVES
} from './divinePassives.js';
//=====================================CONFIGURATION & CONSTANTS===========================================

let BOOST_COEF = 10;
let RR_BASE = RARITY.COMMON; // default common

const DIVINE_LEVEL_MARKER = "§d§v§n§m§r";

const RRS_MARKER = "§r§r§s§v§e§r§t";

const ATRIBUTES_MARKER_START = "§8Attributes";
const ATRIBUTES_MARKER_END = "§a§t§b§e§n§d§r";

const SKILLS_MARKER_START = "§8Skill";
const SKILLS_MARKER_END = "§s§k§l§e§n§d§r";

const PASSIVES_MARKER_START = "§8Passive ability";
const PASSIVES_MARKER_END = "§p§v§a§e§n§d§r";

const DIVINE_LEVEL_TAG_ENTITY_MARKER = "dvn_lvl_";

// Global difficulty variable
let LOCAL_DIFFICULTY_RRS = 1;

let MOB_DIFFICULTY_SPEED = 500;

// Equipment slots mapping
const SLOT_MAPPINGS = {
    head: "slot.armor.head",
    chest: "slot.armor.chest", 
    legs: "slot.armor.legs",
    feet: "slot.armor.feet",
    mainhand: "slot.weapon.mainhand",
    offhand: "slot.weapon.offhand"
};

const DIVINE_LEVEL_BAR = [
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', ''
];

const DIVINE_STATS_UPGRADE_BAR = [
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "",
    ""
];

// XP Level costs for reforge and evolution (indexed by current rarity id - 1)
const LEVEL_COST_MAP = [0, 1, 3, 5, 6, 7, 8]; // Custo de XP

const LEVEL_COST_MAP_EVO = [2, 6, 8, 10, 15, 16, 17]; // Upar Raridade

// Resource costs for reforge (indexed by current rarity id - 1)  
const RESOURCE_MAP = [3, 5, 6, 7, 8, 9, 10]; // Custo de Ametista

// Evolution success chances (indexed by current rarity id - 1)
const EVOLUTION_CHANCES = [
    0.9,   // Common → Uncommon (100%)
    0.8,   // Uncommon → Rare (100%)
    0.7,   // Rare → Epic (100%)
    0.6,   // Epic → Legendary (100%)
    0.5,   // Legendary → Mythic (100%)
    0.07,  // Mythic → Divine (7%)
    0.0    // Divine → ??? (impossible)
];

// Static predefined scoreboards - load early to prevent timing issues
const PREDEFINED_SCOREBOARDS = [{
        name: "rrsdamage",
        displayName: "Damage"
    },
    {
        name: "rrsdamagepercent",
        displayName: "Damage percent bonus"
    },
    {
        name: "rrsdefense",
        displayName: "Defense"
    },
    {
        name: "rrshealth",
        displayName: "Health"
    },
    {
        name: "rrsspeed",
        displayName: "Speed"
    },
    {
        name: "rrsregeneration",
        displayName: "Regeneration"
    },
    {
        name: "rrscritchance",
        displayName: "Crit Chance"
    },
    {
        name: "rrscritdamage",
        displayName: "Crit Damage"
    },
    {
        name: "rrslifesteal",
        displayName: "Life steal"
    },
    {
        name: "rrshealthpercent",
        displayName: "Health percent bonus"
    },
    {
        name: "rrsstoredentityhealth",
        displayName: "Health mob tracker"
    }
];

const COOLDOWN_PREDEFINED_SCOREBOARDS = [{
        name: "smashleap",
        displayName: "Smash Leap"
    },
    {
        name: "spinstrike",
        displayName: "Spin Strike"
    },
    {
        name: "explosivemining",
        displayName: "Explosive Mining"
    },
    {
        name: "rayminer",
        displayName: "Ray Miner"
    },
    {
        name: "excavator",
        displayName: "Excavator"
    },
    {
        name: "flamearc",
        displayName: "Flame Arc"
    },
    {
        name: "shadowdash",
        displayName: "Shadow Dash"
    },
    {
        name: "voidpierce",
        displayName: "Void Pierce"
    },
    {
        name: "frosttouch",
        displayName: "Frost Touch"
    },
    {
        name: "lightningstrike",
        displayName: "lightning Strike"
    },
    {
        name: "enderarrow",
        displayName: "Ender Arrow"
    },
    {
        name: "vampiric",
        displayName: "Vampiric"
    },
    {
        name: "berserker",
        displayName: "Berserker"
    },
    {
        name: "poisonblade",
        displayName: "Poison Blade"
    },
    {
        name: "explosivearrows",
        displayName: "Explosive Arrows"
    },
    {
        name: "dragonarmor",
        displayName: "Dragon Armor"
    },
    {
        name: "aegis",
        displayName: "Aegis"
    }
    
];

const DROP_CONFIG = {
    // Material 1: 17% chance
    material1: {
        item: "rrs:tier1_upgrade",
        chance: 17
    },
    // Material 2: 5% chance  
    material2: {
        item: "rrs:tier2_upgrade",
        chance: 5
    },
    // Material 3: 1% chance
    material3: {
        item: "rrs:tier3_upgrade", 
        chance: 1
    }
};

const AFFECTED_ENTITIES = [
    "minecraft:zombie",
    "minecraft:skeleton", 
    "minecraft:creeper",
    "minecraft:spider",
    "minecraft:stray",
    "minecraft:husk",
    "minecraft:drowned",
    "minecraft:wither_skeleton",
    "minecraft:blaze",
    "minecraft:ghast",
    "minecraft:magma_cube",
    "minecraft:slime",
    "minecraft:phantom",
    "minecraft:witch",
    "minecraft:vindicator",
    "minecraft:evoker",
    "minecraft:pillager",
    "minecraft:ravager",
    "minecraft:enderman",
    "minecraft:shulker",
    "minecraft:guardian",
    "minecraft:elder_guardian",
    "minecraft:wither",
    "minecraft:endermite",
    "minecraft:silverfish",
    "minecraft:zoglin",
    "minecraft:piglin_brute"
];

const POSSIBLE_TO_DIVINE_ENTITY = [
    "minecraft:zombie",
    "minecraft:skeleton", 
    "minecraft:creeper",
    "minecraft:spider",
    "minecraft:stray",
    "minecraft:husk",
    "minecraft:drowned",
    "minecraft:wither_skeleton",
    "minecraft:blaze",
    "minecraft:ghast",
    "minecraft:magma_cube",
    "minecraft:slime",
    "minecraft:phantom",
    "minecraft:witch",
    "minecraft:vindicator",
    "minecraft:evoker",
    "minecraft:pillager",
    "minecraft:ravager",
    "minecraft:enderman",
    "minecraft:shulker",
    "minecraft:guardian",
    "minecraft:elder_guardian",
    "minecraft:wither",
    "minecraft:endermite",
    "minecraft:silverfish",
    "minecraft:zoglin",
    "minecraft:piglin_brute"
];

const POSSIBLE_TO_STRONG_ENTITY = [
    "minecraft:zombie",
    "minecraft:skeleton", 
    "minecraft:creeper",
    "minecraft:spider",
    "minecraft:stray",
    "minecraft:husk",
    "minecraft:drowned",
    "minecraft:wither_skeleton",
    "minecraft:blaze",
    "minecraft:ghast",
    "minecraft:magma_cube",
    "minecraft:slime",
    "minecraft:phantom",
    "minecraft:witch",
    "minecraft:vindicator",
    "minecraft:evoker",
    "minecraft:pillager",
    "minecraft:ravager",
    "minecraft:enderman",
    "minecraft:shulker",
    "minecraft:guardian",
    "minecraft:elder_guardian",
    "minecraft:wither",
    "minecraft:endermite",
    "minecraft:silverfish",
    "minecraft:zoglin",
    "minecraft:piglin_brute"
];

const POSSIBLE_TO_EQUIPMENT_ENTITY = [
    "minecraft:zombie",
    "minecraft:skeleton", 
    "minecraft:stray",
    "minecraft:husk",
    "minecraft:drowned",
    "minecraft:wither_skeleton",
    "minecraft:vindicator",
    "minecraft:evoker",
    "minecraft:pillager",
    "minecraft:piglin_brute"
];

let DIVINE_ENTITY_SPAWN_CHANCE = 0.17;
let STRONG_ENTITY_SPAWN_CHANCE = 0.65;

const DIVINE_ITEM_POINTS_ICONS = {
    stats: "",
    passive: "", 
    skill: "", 
    ascending: "" 
};

const DIVINE_POINTS_MARKER = "§d§v§n§p§s§r§b";

const DIVINE_DATA_MARKER = "§d§v§n§d§t";
const DIVINE_DATA_MARKER_END = "§d§v§n§d§t§e§n§d";

const DIVINE_DATA_STRING_BASE = "§0§-§0§_§0§-§0§_§0§-§0§_§0§-§0§_§0§-§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0§_§0";

let ForceRarity = true; // Set to true for more items support

let REFORGE_GUARANT_BOOST = 15; // 15%

const newStatsPriceMap = [
    {
        newId: 0,
        cores: 0,
        points: 0,
        reroll: 1
    },
    {
        newId: 1,
        cores: 3,
        points: 5,
        reroll: 2
    },
    {
        newId: 2,
        cores: 5,
        points: 7,
        reroll: 3
    },
    {
        newId: 3,
        cores: 10,
        points: 10,
        reroll: 5
    },
    {
        newId: 4,
        cores: 22,
        points: 15,
        reroll: 7
    }
];

const GENERAL_DIVINE_UPGRADES_PRICE = {
    cores: 15,
    points: 5,
    reroll: 1
};
//=====================================UTILITY FUNCTIONS===========================================

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    if (!scoreboardObj) {
        console.warn(`Scoreboard '${scoreboard}' not found`);
        return 0;
    }
    try {
        const scoreboardValue = scoreboardObj.getScore(player);
        return scoreboardValue;
    } catch (error) {
        console.warn(`Error getting score for ${player.name} from scoreboard '${scoreboard}':`, error);
        return 0;
    }
}

function insertSmartLineBreaks(text, maxLength = 35, colorCode = '7', breakLongWords = true) {
    if (!text || typeof text !== 'string') return '';
    
    const colorPrefix = `§${colorCode}`;
    const textF = colorPrefix + text;
    const words = textF.split(/(\s+)/); // Split but keep whitespace
    const lines = [];
    let currentLine = '';
    
    // Helper function to calculate visible length
    function getVisibleLength(str) {
        return str
            // Remove color codes (§ followed by any character)
            .replace(/§./g, '')
            // Convert double %% to single % (counts as 1 character)
            .replace(/%%/g, '%')
            .length;
    }
    
    for (const word of words) {
        // Handle whitespace
        if (/^\s+$/.test(word)) {
            if (getVisibleLength(currentLine + word) <= maxLength) {
                currentLine += word;
            } else {
                lines.push(currentLine);
                currentLine = '';
            }
            continue;
        }
        
        // Handle long words
        const wordVisibleLength = getVisibleLength(word);
        if (wordVisibleLength > maxLength && breakLongWords) {
            // Add current line if it has content
            if (currentLine.trim()) {
                lines.push(currentLine);
                currentLine = '';
            }
            
            // Break the long word into chunks based on visible length
            let remainingWord = word;
            while (remainingWord) {
                let chunk = '';
                let visibleCount = 0;
                let i = 0;
                
                while (i < remainingWord.length && visibleCount < maxLength) {
                    const char = remainingWord[i];
                    
                    if (char === '§' && i + 1 < remainingWord.length) {
                        // Add color code (doesn't count toward visible length)
                        chunk += remainingWord.slice(i, i + 2);
                        i += 2;
                    } else if (char === '%' && i + 1 < remainingWord.length && remainingWord[i + 1] === '%') {
                        // Add double %% (counts as 1 visible character)
                        chunk += '%%';
                        visibleCount++;
                        i += 2;
                    } else {
                        // Regular character
                        chunk += char;
                        visibleCount++;
                        i++;
                    }
                }
                
                lines.push(chunk);
                remainingWord = remainingWord.slice(i);
            }
        } else {
            // Check if adding the word would exceed the max length
            if (getVisibleLength(currentLine + word) > maxLength && currentLine.trim()) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += word;
            }
        }
    }
    
    // Add the last line if it exists
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines.join(`\n${colorPrefix}`);
}

function countItemInInventory(player, itemId) {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return 0;

    let total = 0;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.typeId === itemId) {
            total += item.amount;
        }
    }

    return total;
}

function parseTags(itemId = "minecraft:apple") {
    // Check blacklist first
    for (const blItem of blackList) {
        if (itemId == blItem) {
            return {
                rarity: false
            };
        }
    }

    // Split the itemId by underscores and colons to get individual words
    const itemWords = itemId.toLowerCase().split(/[_:]/);

    // Check each tag category
    for (const [tagKey, tagValues] of Object.entries(TagMapping)) {
        // Check if any word from itemId matches any value in the tag array
        for (const word of itemWords) {
            if (tagValues.includes(word)) {
                return {
                    rarity: true,
                    data: tagKey
                };
            }
        }
    }

    // No match found
    return {
        rarity: false
    };
}

function parseMaterial(itemId = "minecraft:apple") {
    const itemWords = itemId.toLowerCase().split(/[_:]/);
    for (const word of itemWords) {
        const material = MaterialRarity.find(material => material.materials.includes(word));
        if (material && material.hasOwnProperty("chance")) return material;
    }
    return false;
}

function moddedMaterialParse(itemId = "minecraft:apple") {
    const itemWords = itemId.toLowerCase().split(/[_:]/);
    for (const word of itemWords) {
        const material = ModMaterialRarity.find(material => material.alias.includes(word));
        if (material && material.hasOwnProperty("chance")) return material;
    }
    return false;
}

function testCooldown(player, name, object = skills) {
    let Obj = Object.values(object).find(s => s.name == name);
    
    if (!Obj) {
        console.warn(`Skill/Passive '${name}' not found`);
        Obj = Object.values(DIVINE_SKILLS).find(s => s.name == name);
    }
    
    if (!Obj) {
        console.warn(`Skill/Passive '${name}' not found`);
        Obj = Object.values(DIVINE_PASSIVES).find(s => s.name == name);
    }
    
    if (!Obj) {
        console.warn(`Skill/Passive '${name}' not found`);
        return { obj: null, time: 0 };
    }

    const scoreboardObj = world.scoreboard.getObjective(Obj.scoreboard);
    if (!scoreboardObj) {
        console.warn(`Scoreboard '${Obj.scoreboard}' not found for ${name}`);
        return { obj: null, time: 0 };
    }
    
    try {
        const scoreboardValue = scoreboardObj.getScore(player);
        return {
            obj: scoreboardObj,
            time: scoreboardValue
        };
    } catch (error) {
        console.warn(`Error getting cooldown for ${name}:`, error);
        return { obj: scoreboardObj, time: 0 };
    }
}

function rni(listName) {
    const ridfl = listName[Math.floor((Math.random()) * listName.length)];
    return ridfl;
}

function updateCooldown() {
    const players = world.getPlayers();

    for (const obj of COOLDOWN_PREDEFINED_SCOREBOARDS) {
        const scoreboard = world.scoreboard.getObjective(obj.name);
        if (!scoreboard) continue;

        for (const player of players) {
            const cd = scoreboard.getScore(player);
            if (cd >= 0) {
                scoreboard.addScore(player, -1);
            }
            if (cd === 0) {
                player.runCommand(`title @s actionbar §aSkill §l${obj.displayName}§r§a is off cooldown and ready!`);
            }
        }
    }
}


function initializeScoreboards() {
    console.log("Initializing static scoreboards...");
    for (const scoreboard of PREDEFINED_SCOREBOARDS) {
        try {
            const existing = world.scoreboard.getObjective(scoreboard.name);
            if (!existing) {
                world.scoreboard.addObjective(scoreboard.name, scoreboard.displayName);
                console.log(`Scoreboard '${scoreboard.name}' (${scoreboard.displayName}) added.`);
            }
        } catch (e) {
            console.warn(`Failed to add scoreboard '${scoreboard.name}':`, e.message);
        }
    }

    for (const scoreboard of COOLDOWN_PREDEFINED_SCOREBOARDS) {
        try {
            const existing = world.scoreboard.getObjective(scoreboard.name);
            if (!existing) {
                world.scoreboard.addObjective(scoreboard.name, scoreboard.displayName);
                console.log(`Scoreboard '${scoreboard.name}' (${scoreboard.displayName}) added.`);
            }
        } catch (e) {
            console.warn(`Failed to add scoreboard '${scoreboard.name}':`, e.message);
        }
    }
    console.log("Static scoreboards initialization complete.");
}
//=======================================UI MENU=========================================================
function hideString(str, marker = DIVINE_DATA_MARKER) {
    let encoded = '';
    for (const char of str) {
        encoded += `§${char}`;
    }
    encoded += '§r';
    return marker + encoded;
}

function revealString(hidden, marker = DIVINE_DATA_MARKER) {
    if (!hidden.startsWith(marker)) return null;
    let data = hidden.slice(marker.length).replace(/§r$/, '');
    const chars = [...data.matchAll(/§(.)/g)].map(match => match[1]);
    return chars.join('');
}

function statsMainMenu(player) {
    const menu = new ActionFormData()
        .title('SELECT OPTION')
        .button('STATS', 'textures/ui/gamerpic');

    menu.show(player).then((r) => {
        if (!r.canceled) {
            switch (r.selection) {
                case 0:
                    showStatsForm(player, true);
                    break;
            }
        }
    });
}

function showStatsForm(player) {
    const stats = {
        damage: getScoreboardValue("rrsdamage", player),
        damagepercent: getScoreboardValue("rrsdamagepercent", player),
        defense: getScoreboardValue("rrsdefense", player),
        health: getScoreboardValue("rrshealth", player) + 20,
        speed: getScoreboardValue("rrsspeed", player),
        regeneration: getScoreboardValue("rrsregeneration", player),
        critchance: getScoreboardValue("rrscritchance", player) + 5,
        critdamage: getScoreboardValue("rrscritdamage", player) + 50,
        lifesteal: getScoreboardValue("rrslifesteal", player),
        healthpercent: getScoreboardValue("rrshealthpercent", player)
    };

    const form = new ActionFormData()
        .title("§l§aYour Stats")
        .body(
            `§7Damage: §f${stats.damage}\n` +
            `§7Damage: §f${stats.damagepercent}%%\n` +
            `§7Defense: §f${stats.defense}%%\n` +
            `§7Health: §f${stats.health}\n` +
            `§7Speed: §f${stats.speed}\n` +
            `§7Regeneration: §f${stats.regeneration}\n` +
            `§7Crit Chance: §f${stats.critchance}%%\n` +
            `§7Crit Damage: §f${stats.critdamage}%%\n` +
            `§7Lifesteal: §f${stats.lifesteal}%%\n` +
            `§7Health: §f${stats.healthpercent}%%`
        )
        .button("§aOK");

    form.show(player);
}

function upgradeMenu(player) {
    const menu = new ActionFormData()
        .title('§6§lHEAVY ANVIL')
        .body('menu.invisible.rrs')
        .button('', 'textures/ui/up_medium_arrow_blue')
        .button('', 'textures/ui/smithing_icon');

    menu.show(player).then((r) => {
        if (!r.canceled) {
            switch (r.selection) {
                case 0:
                    openStatsUpgradeForm(player);
                    break;
                case 1:
                    // Access the blocking function (item reforge)
                    accessItemReforge(player);
                    break;
            }
        }
    });
}

function applySign(signStr, value) {
    signStr = signStr.trim(); // Remove spaces

    if (signStr === "" || signStr === "-") return -Math.abs(value);
    return Math.abs(value); // For "+" or anything else, treat as positive
}

function openStatsUpgradeForm(player) {
    //general first checks
    const equippable = player.getComponent("minecraft:equippable");
    const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);

    const loreArray = itemStack.getLore();
    if (!itemStack || loreArray.length == 0 || loreArray.includes("§bDivine")) {
        system.runTimeout(() => {
            player.sendMessage("You can't change stats of this item");
        }, 5);
        return;
    }
    //initialization of important variables
    const upgradeBar = [
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', ''
    ];
    
    // Use global upgrade materials config
    const upgradeMaterials = [
        {
            id: "rrs:tier1_upgrade",
            name: "Tier 1 upgrade",
            icon: '',
            amount: 1,
            tag: "7",
            ix: 0
        },
        {
            id: "rrs:tier1_upgrade",
            name: "Tier 1 upgrade",
            icon: '',
            amount: 2,
            tag: "a",
            ix: 0
        },
        {
            id: "rrs:tier2_upgrade",
            name: "Tier 2 upgrade",
            icon: '',
            amount: 1,
            tag: "9",
            ix: 1
        },
        {
            id: "rrs:tier2_upgrade",
            name: "Tier 2 upgrade",
            icon: '',
            amount: 2,
            tag: "5",
            ix: 1
        },
        {
            id: "rrs:tier3_upgrade",
            name: "Tier 3 upgrade",
            icon: '',
            amount: 1,
            tag: "6",
            ix: 2
        },
        {
            id: "rrs:tier3_upgrade",
            name: "Tier 3 upgrade",
            icon: '',
            amount: 2,
            tag: "c",
            ix: 2
        },
    ];
    //secondary test
    const attributes = parseLoreToStats(equippable, EquipmentSlot.Mainhand);
    if (attributes.length == 0) {
        system.runTimeout(() => {
            player.sendMessage("There is no stats on item");
        }, 5);
        return;
    }
    
    //retrive all stats data
    let statsL = [];
    //result.push(`${newStat.name}§w ${sign}§w${newStatValue}§w${measure}`);
    for (const attribute of attributes) {
        const params = attribute.split("§w");
        
        const STAT = stats.find(r => r.name === params[0]);
        
        if (!STAT) {
            system.runTimeout(() => {
                player.sendMessage(`§cUnknown stat type: ${params[0]}`);
            }, 5);
            continue;
        }
        
        statsL.push({
            name: params[0],
            sign: params[1],
            value: applySign(params[1], Number(params[2].trim())),
            measure: params[3],
            maxValue: Math.round(STAT.max * 1.25),
            minValue: STAT.min,
            fString: attribute
        });
    }
    
    //Check for upgrade materials
    const resources = [
        countItemInInventory(player, upgradeMaterials[0].id),
        countItemInInventory(player, upgradeMaterials[2].id),
        countItemInInventory(player, upgradeMaterials[4].id)
    ];

    // Number of upgrade buttons (more descriptive variable name)
    const numUpgradeButtons = statsL.length;
    
    //create base of ui menu
    const statsCurString = `Upgrade materials: ${upgradeMaterials[0].icon}${resources[0]}  ${upgradeMaterials[2].icon}${resources[1]}  ${upgradeMaterials[4].icon}${resources[2]}\n`;
    let progressBars = [];
    for (const stat of statsL) {
        const range = stat.maxValue - stat.minValue;
        const relativeValue = stat.value - stat.minValue;
        const percent = Math.max(0, Math.min(81, Math.floor((relativeValue / range) * 81)));
        
        //create max value of stat progress bar with proper % display
        const displayString = stat.fString.replace(/%/g, "%%");
        progressBars.push(`${displayString} ${upgradeBar[81 - percent]}`);
    }

    const upgradeForm = new ActionFormData()
        .title('§a§lSTATS UPGRADE')
        .body('menu.invisible.rrs');
    
    // Button 0 - Display/reopen menu button
    upgradeForm.button(`${statsCurString.replace(/%/g, "%%")}`, 'textures/ui/invisible');

    //create upgrade buttons for each stat (buttons 1 to numUpgradeButtons), also count max stats
    let statsAboveThreshold = 0;
    let statsUpgradeStatus = [];
    for (let i = 0; i < statsL.length; i++) {
        const stat = statsL[i];
        const range = stat.maxValue - stat.minValue;
        const relativeValue = stat.value - stat.minValue;
        
        const tag = stat.name.charAt(1);
        const materialData = upgradeMaterials.find(item => item.tag == tag);
        
        if (!materialData) {
            // Handle case where material data is not found
            statsUpgradeStatus.push({
                status: false,
                amount: 0,
                id: "unknown"
            });
            upgradeForm.button(`§l§c[UPGRADE] §r${stat.name} §8No material`, 'textures/ui/smithing_icon');
            continue;
        }
        
        const result = (materialData.amount <= resources[materialData.ix])? { color: "§a", status: true } : { color: "§c", status: false };
        statsUpgradeStatus.push({
            status: result.status,
            amount: materialData.amount,
            id: materialData.id
        });
        
        upgradeForm.button(`${progressBars[i]} §l${result.color}${materialData.amount}${materialData.icon}`, 'textures/ui/color_plus');
        if (stat.value >= stat.maxValue * 0.9) {
            statsAboveThreshold++;
        }
    }
    
    //create evolution button at index numUpgradeButtons + 1 if all stats are above threshold
    const hasEvolutionButton = (statsAboveThreshold == statsL.length);
    if (hasEvolutionButton) {
        // Add XP requirements for evolution (use global config)
        const levelCostMap = LEVEL_COST_MAP_EVO;
        const dNamePosition = findInsertIndex(loreArray);
        const currentRarity = Object.values(RARITY).find(r => r.dName === loreArray[dNamePosition]);
        const nextRarity = Object.values(RARITY).find(r => r.id === currentRarity.id + 1);
        
        if (nextRarity) {
            const xpCost = levelCostMap[currentRarity.id - 1] || 10;
            const playerLevel = player.level;
            const xpStatusColor = (playerLevel >= xpCost) ? "§a" : "§c";
            const evolutionChance = EVOLUTION_CHANCES[currentRarity.id - 1] || 0;
            
            let buttonText = `§b§l[EVOLVE] - increase rarity ${xpStatusColor}${xpCost}`;
            if (evolutionChance < 1.0) {
                buttonText += ` §e(${Math.round(evolutionChance * 100)}%%)`;
            }
            
            upgradeForm.button(buttonText, 'textures/ui/invisible');
        } else {
            upgradeForm.button("§b§l[EVOLVE] - increase rarity §bMax rarity", 'textures/ui/invisible');
        }
    }
    
    //main upgrade logic
    upgradeForm.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen menu
                openStatsUpgradeForm(player);
            } else if (r.selection >= 1 && r.selection <= numUpgradeButtons) {
                // Buttons 1 to numUpgradeButtons - Upgrade buttons
                const statIndex = r.selection - 1; // Convert button index to stat array index
                const stat = statsUpgradeStatus[statIndex];
                
                if (stat && stat.status) {
                    //get new random value
                    const newStatValue = rnb(statsL[statIndex].minValue, statsL[statIndex].maxValue);
                    
                    let newStats = [];
                    for (let i = 0; i < statsL.length; i++) {
                        if (i !== statIndex) {
                            newStats.push(statsL[i].fString);
                        } else {
                            const newStat = statsL[i];
                            const sign = newStatValue >= 0 ? "+" : "";
                            newStats.push(`${newStat.name}§w ${sign}§w${newStatValue}§w${newStat.measure}`);
                        }
                    }
                    
                    const startIndex = loreArray.indexOf(ATRIBUTES_MARKER_START);
                    const endIndex = loreArray.indexOf(ATRIBUTES_MARKER_END);
                    
                    // Replace the content in between, ensuring markers are present
                    let updated;
                    if (startIndex !== -1 && endIndex !== -1) {
                        // Both markers exist, replace content between them
                        updated = [
                            ...loreArray.slice(0, startIndex + 1),
                            ...newStats,
                            ...loreArray.slice(endIndex)
                        ];
                    } else {
                        // Missing markers, add them
                        const insertIndex = loreArray.findIndex(line => line.includes("§8") || line.includes("§a") || line.includes("§9") || line.includes("§5") || line.includes("§6") || line.includes("§c")) + 1;
                        updated = [
                            ...loreArray.slice(0, insertIndex),
                            ATRIBUTES_MARKER_START,
                            ...newStats,
                            ATRIBUTES_MARKER_END,
                            ...loreArray.slice(insertIndex)
                        ];
                    }
                    
                    const newItem = itemStack.clone();
                    newItem.setLore(updated);
                    
                    equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                    //upgrade effects
                    player.runCommand("playsound random.anvil_use @s");
                    player.runCommand(`clear @s ${stat.id} 0 ${stat.amount}`);
                } else {
                    system.runTimeout(() => player.sendMessage("§cNot enough resources for upgrade"), 5);
                    return;
                }
                
                //reopen menu after upgrade
                openStatsUpgradeForm(player);
            } else if (r.selection === numUpgradeButtons + 1 && hasEvolutionButton) {
                // Button at index numUpgradeButtons + 1 - Evolution button
                const levelCostMap = LEVEL_COST_MAP_EVO;
                const dNamePosition = findInsertIndex(loreArray);
                const currentRarity = Object.values(RARITY).find(r => r.dName === loreArray[dNamePosition]);
                const nextRarity = Object.values(RARITY).find(r => r.id === currentRarity.id + 1);
                
                if (!nextRarity) {
                    system.runTimeout(() => player.sendMessage("§cItem is already at maximum rarity"), 5);
                    return;
                }
                
                const xpCost = levelCostMap[currentRarity.id - 1] || 10;
                const playerLevel = player.level;
                
                if (playerLevel < xpCost) {
                    system.runTimeout(() => player.sendMessage(`§cNot enough XP levels for evolution. Need ${xpCost} levels.`), 5);
                    return;
                }
                
                // Check evolution success chance
                const evolutionChance = EVOLUTION_CHANCES[currentRarity.id - 1] || 0;
                const success = Math.random() <= evolutionChance;
                
                // Always consume XP levels (whether success or failure)
                player.addLevels(-xpCost);
                
                if (!success) {
                    player.sendMessage(`§cEvolution failed! ${(evolutionChance * 100)}% chance. Lost ${xpCost} XP levels.`);
                    player.runCommand("playsound block.anvil.land @s");
                    openStatsUpgradeForm(player);
                    return;
                }
                
                //create new upgraded lore
                const Tags = parseTags(itemStack.typeId);
                const clearedLore = clearLore(loreArray);
                
                const skill = randomSkill(nextRarity.sid, Tags.data);
                const passive = randomPassiveAbility(nextRarity.sid, Tags.data);
                
                let statsEvo = [];
                
                for (const stat of statsL) {
                    statsEvo.push(nextRarity.color + stat.fString.slice(2));
                }
                
                let newLore;
                if (nextRarity.id < 7) {
                    newLore = [...clearedLore, nextRarity.dName, ATRIBUTES_MARKER_START, ...statsEvo, ATRIBUTES_MARKER_END, ...skill, ...passive, RRS_MARKER];
                } else if (nextRarity.id === 7) {
                    let dName = nextRarity.dName 
                    let dNameLevel = `${DIVINE_LEVEL_MARKER}0${DIVINE_LEVEL_BAR[DIVINE_LEVEL_BAR.length - 1]} §b0/20 xp`;
                    newLore = [...clearedLore, dName, dNameLevel, RRS_MARKER];
                }
                const newItem = itemStack.clone();
                newItem.setLore(newLore);
                
                equippable.setEquipment(EquipmentSlot.Mainhand, newItem);
                
                // Play evolution sound effect
                //player.runCommand("playsound block.enchantment_table.use @s");
                
                //reopen menu after evolution
                openStatsUpgradeForm(player);
            } else {
                // Invalid selection or other menu
                upgradeMenu(player);
                return;
            }
        }
    });
}

function accessItemReforge(player) {
    // This function provides access to the block function (item reforge)
    // Check if player has an item to reforge
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack) {
        player.sendMessage("§cYou must hold an item to reforge.");
        upgradeMenu(player); // Return to upgrade menu
        return;
    }

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) {
        player.sendMessage("§cThis item cannot be reforged.");
        upgradeMenu(player); // Return to upgrade menu
        return;
    }

    // Call the block function (item reforge UI)
    blockUiAnvil(player);
}

function blockUiAnvil(player) {
    const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!itemStack) {
        player.sendMessage("§cYou must hold an item to reforge.");
        return;
    }

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) {
        player.sendMessage("§cThis item cannot be reforged.");
        return;
    }
    
    const dNamePosition = findInsertIndex(loreArray);
    
    const rarity = Object.values(RARITY).find(r => r.dName === loreArray[dNamePosition]);
    if (!rarity) {
        player.sendMessage("§cUnknown rarity. Cannot reforge this item.");
        return;
    }

    const lore = loreArray.filter(line => (line != ATRIBUTES_MARKER_END || line != SKILLS_MARKER_END || line != PASSIVES_MARKER_END)).join("\n").replace(/%/g, "%%");
    const resourceMap = RESOURCE_MAP;
    const levelCostMap = LEVEL_COST_MAP;
    
    const upgradeResource = countItemInInventory(player, "minecraft:amethyst_shard");
    
    const resourceAmount = resourceMap[rarity.id - 1];
    const level = player.level;
    const amountStatusColorA = (upgradeResource < resourceAmount) ? "§c" : "§a";
    const amountStatusColorL = (level < levelCostMap[rarity.id - 1]) ? "§c" : "§a";

    const reforgeMenu = new ActionFormData()
        .title("§6§lREFORGE")
        .body('menu.invisible.rrs')
        .button(`§a\n\n\n\n\n${amountStatusColorA}${resourceAmount}  ${amountStatusColorL}${levelCostMap[rarity.id - 1]}`, 'textures/ui/smithing_icon')
        .button(`You have: ${upgradeResource} and ${level}\n\n§f${lore}`, 'textures/ui/invisible');

    reforgeMenu.show(player).then((r) => {
        if (r.canceled) return;

        switch (r.selection) {
            case 0:
                if (upgradeResource >= resourceAmount && level >= levelCostMap[rarity.id - 1]) {
                    player.runCommand(`clear @s minecraft:amethyst_shard 0 ${resourceAmount}`);
                    player.addLevels((-1) * levelCostMap[rarity.id - 1]);
                    rarityItemTest(itemStack, player, rarity.sid, false);
                    player.runCommand("playsound random.anvil_use @s")
                    blockUiAnvil(player); // refresh the UI
                } else {
                    player.sendMessage("§cNot enough amethyst shards or XP to reforge.");
                }
                break;
            case 1:
                blockUiAnvil(player);
                break;
        }
    });
}

//======================DIVINE LOGIC========

function divineMenu(player) {
    const menu = new ActionFormData()
        .title('§b§lDIVINE FORGE')
        .body('menu.invisible.rrs');
        
    //create level button
    const equipment = player.getComponent("minecraft:equippable");
    const itemStack = equipment?.getEquipment(EquipmentSlot.Mainhand);
    const loreArray = itemStack?.getLore();
    if (!equipment || !itemStack || !loreArray || !loreArray.some(line => line.includes(DIVINE_LEVEL_MARKER))) {
        player.sendMessage("You need to hold divine item");
        return;
    }
    
    
    let divineLevelBar = "";
    for (const line of loreArray) {
        if (line.includes(DIVINE_LEVEL_MARKER)) {
            divineLevelBar = line.slice(DIVINE_LEVEL_MARKER.length).replace(" ", "\n");
            break;
        }
    }
    menu.button(divineLevelBar, "textures/ui/invisible");
    
    menu.button("", "textures/ui/divine_stats_button");
    menu.button("", "textures/ui/divine_skills_button");
    menu.button("", "textures/ui/divine_passives_button");
    menu.button("", "textures/ui/divine_ascending_button");
    menu.button("", "textures/ui/divine_signature_button");
    

    menu.show(player).then((r) => {
        if (!r.canceled) {
            switch (r.selection) {
                case 1:
                    openDivineStats(player, equipment, itemStack, loreArray);
                    break;
                case 2:
                    openDivineSkills(player, equipment, itemStack, loreArray);
                    break;
                case 3: 
                    openDivinePassives(player, equipment, itemStack, loreArray);
                    break;
                case 4:
                    openDivineAscending(player, equipment, itemStack, loreArray);
                    break;
                case 5:
                    openSignatureWeapons(player, equipment, itemStack, loreArray);
                    break;
            }
        }
    });
}

function openDivineStats(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    
    const progressBarAscending = REVERSED_DIVINE_LEVEL_BAR[divineData.ascending.stageBoostBarId];
    let divinePointsData = `§b${divineUpgradePoints.stats}${DIVINE_ITEM_POINTS_ICONS.stats}   ${divineCores}  ${progressBarAscending}`;
    const ascendingBonus = 1 + (divineData.ascending.bonus.maxStat / 100);
    
    const upgradeForm = new ActionFormData()
        .title('§b§lDIVINE STATS')
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
        
    const availableDivineStats = divineData.stats.stats.map((stat, index) => {
        const statData = DIVINE_STATS.find(s => s.id === stat.id);
        if (!statData) return null;
    
        // boosted cap with ascension bonus
        const maxValue = Math.min(statData.max * ascendingBonus, statData.maxPossibleValue);
    
        // +20% of base max each upgrade
        const increment = statData.max * 0.25;
        const newUpgradeValue = Number((Math.min(stat.value + increment, maxValue)).toFixed(1));
    
        // price scaling (linear from 1 → 40 based on base max)
        const progress = stat.value / statData.maxPossibleValue;
        const basePrice = Math.max(1, Math.ceil(progress * 20));
    
        return {
            id: stat.id,
            allData: statData,
            value: stat.value,
            measure: statData.measure || "",
            maxValue: maxValue,
            newUpgradeValue: newUpgradeValue,
            price: {
                cores: basePrice
            }
        };
    }).filter(Boolean);
    
    for (const divineStat of availableDivineStats) {
        const percent = Math.max(0, Math.min(81, Math.floor(divineStat.value / divineStat.maxValue * 81)));
        let progressBar = DIVINE_STATS_UPGRADE_BAR[percent];
        upgradeForm.button(`${divineStat.allData.name}  ${divineStat.value}${divineStat.allData.measure?.replace("%", "%%") ?? ""} ${progressBar} §b${divineStat.price.cores}`, 'textures/ui/color_plus');
    }
    
    if (availableDivineStats.length < 5) {
        upgradeForm.button("§b§lNEW STAT", 'textures/ui/color_plus');
    }
    
    
    upgradeForm.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen menu
                openDivineStats(player, equipment, itemStack, loreArray);
            } else if (r.selection == availableDivineStats.length + 1) {
                // Last Button new stat
                openDivineStatsNew(player, equipment, itemStack, loreArray);
            } else {
                const buttonId = r.selection - 1;
                const upgradedStat = availableDivineStats[buttonId];
                
                if (divineCores >= upgradedStat.price.cores) {//check cores
                    if (upgradedStat.value < upgradedStat.maxValue) {//check max upgrade value
                        divineData.stats.stats[buttonId].value = upgradedStat.newUpgradeValue;
                        player.runCommand("clear @s rrs:divine_core 0 " + upgradedStat.price.cores);
                        let dataLine = parseDivineDataToLore(divineData);
                        let newLore = [...loreArray];
                        const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                        newLore[dataLineIndex] = dataLine;
                        
                        newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                        let newItem = itemStack.clone();
                        newItem.setLore(newLore);
                        //update item
                        equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                        const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                        const updatedLore = updatedItem.getLore();
                        openDivineStats(player, equipment, updatedItem, updatedLore);
                    } else {
                        player.sendMessage("Max level reached. Try using ascending to increase limit");
                    }
                } else {
                    player.sendMessage("Not enough divine cores");
                }
            }
        }
    });
}

function openDivineStatsNew(player, equipment, itemStack, loreArray) {
    //get all important data
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    const divinePointsData = `§bSTATS ${divineUpgradePoints.stats}${DIVINE_ITEM_POINTS_ICONS.stats}   ${divineCores}`;
    
    //create base menu
    const newStats = new ActionFormData()
        .title("§l§bDIVINE SELECTION")
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
    
    //check new available stats from divine data
    let rerolledStatsData = divineData.stats.rerollId;
    if (rerolledStatsData.includes(0)) rerolledStatsData = rerollStatsDivine(parseTags(itemStack.typeId).data);
    
    //add buttons for new stats
    let activeStats = 0;
    for (const ast of divineData.stats.stats) {
        if (ast.id > 0) activeStats++;
    }
    
    const newStatsPrice = newStatsPriceMap.find(priceLvl => priceLvl.newId == activeStats);
    // 3 buttons, id 1-3
    for (const rerolledStat of rerolledStatsData) {
        const DIVINE_STAT_REROLLED = DIVINE_STATS.find(divineStat => divineStat.id === rerolledStat);
        newStats.button(`${DIVINE_STAT_REROLLED.name} ${DIVINE_STAT_REROLLED.measure?.replace("%", "%%") ?? ""}\n\n\n\n\n\n${newStatsPrice.cores}   ${newStatsPrice.points}${DIVINE_ITEM_POINTS_ICONS.stats}`, 'textures/ui/invisible');
    }
    
    newStats.button(`§b§lReroll stats    ${newStatsPrice.reroll}${DIVINE_ITEM_POINTS_ICONS.stats}`, 'textures/ui/invisible');
    
    // show form
    newStats.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen menu
                divineData.stats.rerollId = rerolledStatsData;
                let dataLine = parseDivineDataToLore(divineData);
                let newLore = [...loreArray];
                const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                newLore[dataLineIndex] = dataLine;
                     
                newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                let newItem = itemStack.clone();
                newItem.setLore(newLore);
                //update item
                equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                const updatedLore = updatedItem.getLore();
                openDivineStats(player, equipment, updatedItem, updatedLore);
            } else if (r.selection === 4) {
                // Reroll stats
                if (divineUpgradePoints.stats >= newStatsPrice.reroll) {
                    divineData.stats.rerollId = rerollStatsDivine(parseTags(itemStack.typeId).data);
                    
                    let newItem = spendItemPoints(equipment, itemStack, newStatsPrice.reroll, 0, 0, 0).clone();
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    //update item
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivineStatsNew(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough stat points");
                }
            } else {
                const buttonId = r.selection - 1;
                const upgradedStat = rerolledStatsData[buttonId];
                
                if (divineCores >= newStatsPrice.cores && divineUpgradePoints.stats >= newStatsPrice.points) {//check cores and points
                    divineData.stats.stats[activeStats].id = upgradedStat;
                    divineData.stats.stats[activeStats].value = DIVINE_STATS.find(dStat => dStat.id == upgradedStat).min;
                    divineData.stats.rerollId = rerollStatsDivine(parseTags(itemStack.typeId).data);
                    
                    let newItem = spendItemPoints(equipment, itemStack, newStatsPrice.points, 0, 0, 0).clone();
                    player.runCommand("clear @s rrs:divine_core 0 " + newStatsPrice.cores);
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    //update item
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivineStats(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough divine cores or stat points");
                }
            }
        } else {
            divineData.stats.rerollId = rerolledStatsData;
            let dataLine = parseDivineDataToLore(divineData);
            let newLore = [...loreArray];
            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
            newLore[dataLineIndex] = dataLine;
                 
            newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            //update item
            equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
        }
    });
}

function openDivineAscending(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    
    const progressBarAscending = REVERSED_DIVINE_LEVEL_BAR[divineData.ascending.stageBoostBarId];
    let divinePointsData = `§b${divineUpgradePoints.ascending}${DIVINE_ITEM_POINTS_ICONS.ascending}  ${progressBarAscending}`;
    
    
    // ascending base form
    const ascendingForm = new ActionFormData()
        .title('§b§lASCENDING')
        .body('menu.invisible.rrs')
        //todo replace progressBar
        .button(divinePointsData, 'textures/ui/invisible')
        .button("", 'textures/ui/color_plus') //stats
        .button("", 'textures/ui/color_plus') //skills
        .button("", 'textures/ui/color_plus') //passives
        // ^ upgrade buttons
        // Stats
        .button(insertSmartLineBreaks(`Your current bonus for maximum stats value is §4${divineData.ascending.bonus.maxStat}%%.§0 Current level §4${divineData.ascending.bonus.maxStat / 200}.§0 You can upgrade max bonus to §4${divineData.ascending.bonus.maxStat + 200}%%.`, 17, "0"), 'textures/ui/divine_stats_button')
        // Skills
        .button(insertSmartLineBreaks(`Your current bonus for maximum skills value is §4${divineData.ascending.bonus.maxSkill}%%.§0 Current level §4${divineData.ascending.bonus.maxSkill / 200}.§0 You can upgrade max bonus to §4${divineData.ascending.bonus.maxSkill + 200}%%.`, 17, "0"), 'textures/ui/divine_skills_button')
        // Passives
        .button(insertSmartLineBreaks(`Your current bonus for maximum passives value is §4${divineData.ascending.bonus.maxPassive}%%.§0 Current level §4${divineData.ascending.bonus.maxPassive / 200}.§0 You can upgrade max bonus to §4${divineData.ascending.bonus.maxPassive + 200}%%.`, 17, "0"), 'textures/ui/divine_passives_button');
        // ^ details buttons
    let selectionValues = {
        stats: {
            lvl: divineData.ascending.bonus.maxStats / 200,
            textures: [
            
            ]
        },
        skill: {
            lvl: divineData.ascending.bonus.maxSkill / 200,
            textures: [
                
            ]
        },
        passive: {
            lvl: divineData.ascending.bonus.maxPassive / 200,
            textures: [
            
            ]
        }
    };
    ascendingForm.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection >= 4) {
                openDivineAscending(player, equipment, itemStack, loreArray);
            } else {
                if (divineUpgradePoints.ascending >= 1) {
                    let newItem = spendItemPoints(equipment, itemStack, 0, 0, 0, 1).clone();
                    // get all keys of the object
                    let keys = Object.keys(divineData.ascending.bonus);
                    // find the key
                    let key = keys[r.selection - 1];
                    // update the original object value
                    divineData.ascending.bonus[key] += 200;
                    divineData.ascending.stageBoostBarId += 4;
                    divineData.ascending.stage += 1;
                    
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    //update item
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivineAscending(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough points for upgrade");
                }
            }
        }
    });
}

function openDivineSkills(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    
    const progressBarAscending = REVERSED_DIVINE_LEVEL_BAR[divineData.ascending.stageBoostBarId];
    let divinePointsData = `SKILLS §b${divineUpgradePoints.skill}${DIVINE_ITEM_POINTS_ICONS.skill}   ${divineCores}  ${progressBarAscending}`;
    const ascendingBonus = 1 + (divineData.ascending.bonus.maxSkill / 100);
    
    const upgradeForm = new ActionFormData()
        .title('§b§lDIVINE POWERS')
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
    
    // Current skill data
    const currentSkill = divineData.skill;
    const skillData = DIVINE_SKILLS.find(s => s.id === currentSkill.id);
    
    let basePrice = 1;
    if (skillData && currentSkill.id > 0) {
        // boosted cap with ascension bonus
        const maxValue = Math.min(skillData.max * ascendingBonus, skillData.maxPossibleValue);
        
        // +20% of base max each upgrade
        const increment = skillData.max * 0.20;
        const newUpgradeValue = Number((Math.min(currentSkill.value + increment, maxValue)).toFixed(1));
        
        // price scaling
        const progress = currentSkill.value / skillData.maxPossibleValue;
        basePrice = Math.max(1, Math.ceil(progress * 30));
        
        const percent = Math.max(0, Math.min(81, Math.floor(currentSkill.value / maxValue * 81)));
        let progressBar = DIVINE_STATS_UPGRADE_BAR[percent];
        
        // Upgrade button
        upgradeForm.button(`${progressBar}\n§b${basePrice}`, 'textures/ui/up_medium_arrow_blue');
        
        // Change skill button
        upgradeForm.button("§b§lCHANGE SKILL", 'textures/ui/refresh_hover');
        
        // Description button
        const description = `${skillData.name} ${currentSkill.value}${skillData.measure?.replace("%", "%%") ?? ""}\n\n§0${skillData.description.replace('{value}', '§b' + currentSkill.value + (skillData.measure || '') + '§0')}`;
        const formattedDescription = insertSmartLineBreaks(description, 40, "0");
        upgradeForm.button(formattedDescription, 'textures/ui/invisible');
    } else {
        upgradeForm.button("", 'textures/ui/invisible');
        
        upgradeForm.button("§b§lSELECT SKILL", "textures/ui/refresh_hover");
        
        upgradeForm.button("", "textures/ui/invisible");
    }
    
    upgradeForm.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen menu
                openDivineSkills(player, equipment, itemStack, loreArray);
            } else if (r.selection === 1) {
                // Button 1 - Upgrade skill
                if (skillData && currentSkill.id > 0) {
                    const maxValue = Math.min(skillData.max * ascendingBonus, skillData.maxPossibleValue);
                    const increment = skillData.max * 0.20;
                    const newUpgradeValue = Number((Math.min(currentSkill.value + increment, maxValue)).toFixed(1));
                    
                    if (divineCores >= basePrice) {
                        if (currentSkill.value < maxValue) {
                            divineData.skill.value = newUpgradeValue;
                            player.runCommand("clear @s rrs:divine_core 0 " + basePrice);
                            
                            let dataLine = parseDivineDataToLore(divineData);
                            let newLore = [...loreArray];
                            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                            newLore[dataLineIndex] = dataLine;
                            
                            newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                            let newItem = itemStack.clone();
                            newItem.setLore(newLore);
                            equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                            
                            const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                            const updatedLore = updatedItem.getLore();
                            openDivineSkills(player, equipment, updatedItem, updatedLore);
                        } else {
                            player.sendMessage("Max level reached. Try using ascending to increase limit");
                        }
                    } else {
                        player.sendMessage("Not enough divine cores");
                    }
                } else {
                    // No skill/passive - does nothing
                }
            } else if (r.selection === 2) {
                // Button 2 - Reroll skill/passive menu
                openDivineSkillsNew(player, equipment, itemStack, loreArray);
            } else if (r.selection === 3) {
                // Button 3 - Reopen menu
                openDivineSkills(player, equipment, itemStack, loreArray);
            }
        }
    });
}

function openDivinePassives(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    
    const progressBarAscending = REVERSED_DIVINE_LEVEL_BAR[divineData.ascending.stageBoostBarId];
    let divinePointsData = `§bPASSIVES ${divineUpgradePoints.passive}${DIVINE_ITEM_POINTS_ICONS.passive}   ${divineCores}  ${progressBarAscending}`;
    const ascendingBonus = 1 + (divineData.ascending.bonus.maxPassive / 100);
    
    const upgradeForm = new ActionFormData()
        .title('§b§lDIVINE POWERS')
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
    
    // Current passive data
    const currentPassive = divineData.passive;
    const passiveData = DIVINE_PASSIVES.find(p => p.id === currentPassive.id);
    let basePrice = 1;
    if (passiveData && currentPassive.id > 0) {
        // boosted cap with ascension bonus
        const maxValue = Math.min(passiveData.max * ascendingBonus, passiveData.maxPossibleValue);
        
        // +20% of base max each upgrade
        const increment = passiveData.max * 0.20;
        const newUpgradeValue = Number((Math.min(currentPassive.value + increment, maxValue)).toFixed(1));
        
        // price scaling
        const progress = currentPassive.value / passiveData.maxPossibleValue;
        basePrice = Math.max(1, Math.ceil(progress * 30));
        
        const percent = Math.max(0, Math.min(81, Math.floor(currentPassive.value / maxValue * 81)));
        let progressBar = DIVINE_STATS_UPGRADE_BAR[percent];
        
        // Upgrade button
        upgradeForm.button(`${progressBar}\n§b${basePrice}`, 'textures/ui/up_medium_arrow_blue');
        
        // Change passive button
        upgradeForm.button("§b§lCHANGE PASSIVE", 'textures/ui/refresh_hover');
        
        // Description button
        const description = `${passiveData.name}  ${currentPassive.value}${passiveData.measure?.replace("%", "%%") ?? ""}\n\n§0${passiveData.description.replace('{value}', '§b' + currentPassive.value + (passiveData.measure || '') + '§0')}`;
        const formattedDescription = insertSmartLineBreaks(description, 40, "0");
        upgradeForm.button(formattedDescription, 'textures/ui/invisible');
    } else {
        upgradeForm.button("", 'textures/ui/invisible');
        
        upgradeForm.button("§b§lSELECT PASSIVE", "textures/ui/refresh_hover");
        
        upgradeForm.button("", "textures/ui/invisible");
    }
    
    upgradeForm.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen menu
                openDivinePassives(player, equipment, itemStack, loreArray);
            } else if (r.selection === 1) {
                // Button 1 - Upgrade passive
                if (passiveData && currentPassive.id > 0) {
                    const maxValue = Math.min(passiveData.max * ascendingBonus, passiveData.maxPossibleValue);
                    const increment = passiveData.max * 0.20;
                    const newUpgradeValue = Number((Math.min(currentPassive.value + increment, maxValue)).toFixed(1));
                    
                    if (divineCores >= basePrice) {
                        if (currentPassive.value < maxValue) {
                            divineData.passive.value = newUpgradeValue;
                            player.runCommand("clear @s rrs:divine_core 0 " + basePrice);
                            
                            let dataLine = parseDivineDataToLore(divineData);
                            let newLore = [...loreArray];
                            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                            newLore[dataLineIndex] = dataLine;
                            
                            newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                            let newItem = itemStack.clone();
                            newItem.setLore(newLore);
                            equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                            
                            const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                            const updatedLore = updatedItem.getLore();
                            openDivinePassives(player, equipment, updatedItem, updatedLore);
                        } else {
                            player.sendMessage("Max level reached. Try using ascending to increase limit");
                        }
                    } else {
                        player.sendMessage("Not enough divine cores");
                    }
                } else {
                    // No skill/passive - does nothing
                }
            } else if (r.selection === 2) {
                // Button 2 - Reroll skill/passive menu
                openDivinePassivesNew(player, equipment, itemStack, loreArray);
            } else if (r.selection === 3) {
                // Button 3 - Reopen menu
                openDivinePassives(player, equipment, itemStack, loreArray);
            }
        }
    });
}

function openDivineSkillsNew(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    const divinePointsData = `§bSKILLS ${divineUpgradePoints.skill}${DIVINE_ITEM_POINTS_ICONS.skill}   ${divineCores}`;
    
    const newSkills = new ActionFormData()
        .title("§l§bDIVINE SELECTION")
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
    
    // Get rerolled skills or generate new ones - FIXED: Handle as array like stats
    let rerolledSkillsData = divineData.skill.rerollId;
    if (rerolledSkillsData.includes(0)) {
        rerolledSkillsData = rerollSkillDivine(parseTags(itemStack.typeId).data, 3);
    }
    
    // Add buttons for new skills (3 options)
    for (const rerolledSkill of rerolledSkillsData) {
        const DIVINE_SKILL_REROLLED = DIVINE_SKILLS.find(divineSkill => divineSkill.id === rerolledSkill);
        newSkills.button(`${DIVINE_SKILL_REROLLED.name?.replace("%", "%%")} ${DIVINE_SKILL_REROLLED.measure?.replace("%", "%%") ?? ""}\n${GENERAL_DIVINE_UPGRADES_PRICE.cores}   ${GENERAL_DIVINE_UPGRADES_PRICE.points}${DIVINE_ITEM_POINTS_ICONS.skill}`, 'textures/ui/invisible');
    }
    
    newSkills.button(`§b§lReroll skills    ${GENERAL_DIVINE_UPGRADES_PRICE.reroll}${DIVINE_ITEM_POINTS_ICONS.skill}`, 'textures/ui/invisible');
    
    newSkills.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen skills menu
                divineData.skill.rerollId = rerolledSkillsData;
                let dataLine = parseDivineDataToLore(divineData);
                let newLore = [...loreArray];
                const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                newLore[dataLineIndex] = dataLine;
                     
                newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                let newItem = itemStack.clone();
                newItem.setLore(newLore);
                equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                const updatedLore = updatedItem.getLore();
                openDivineSkills(player, equipment, updatedItem, updatedLore);
            } else if (r.selection === 4) {
                // Reroll skills
                if (divineUpgradePoints.skill >= GENERAL_DIVINE_UPGRADES_PRICE.reroll) {
                    divineData.skill.rerollId = rerollSkillDivine(parseTags(itemStack.typeId).data, 3);
                    
                    let newItem = spendItemPoints(equipment, itemStack, 0, GENERAL_DIVINE_UPGRADES_PRICE.reroll, 0, 0).clone();
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                    
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivineSkillsNew(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough skill points");
                }
            } else {
                // Select skill (buttons 1-3)
                const buttonId = r.selection - 1;
                const selectedSkill = rerolledSkillsData[buttonId];
                
                if (divineCores >= GENERAL_DIVINE_UPGRADES_PRICE.cores && divineUpgradePoints.skill >= GENERAL_DIVINE_UPGRADES_PRICE.points) {
                    const currentSkillData = DIVINE_SKILLS.find(divineSkill => divineSkill.id == divineData.skill.id);
                    const currentUpgradePercent = (currentSkillData.hasOwnProperty("maxPossibleValue"))? Math.floor(divineData.skill.value / currentSkillData.maxPossibleValue * DIVINE_SKILLS.find(divineSkill => divineSkill.id == selectedSkill).maxPossibleValue) : DIVINE_SKILLS.find(divineSkill => divineSkill.id == selectedSkill).min;
                    
                    // Set new skill, preserve upgrade percentage
                    divineData.skill.id = selectedSkill;
                    divineData.skill.value = currentUpgradePercent;
                    divineData.skill.rerollId = rerollSkillDivine(parseTags(itemStack.typeId).data, 3);
                    
                    let newItem = spendItemPoints(equipment, itemStack, 0, GENERAL_DIVINE_UPGRADES_PRICE.points, 0, 0).clone();
                    player.runCommand("clear @s rrs:divine_core 0 " + GENERAL_DIVINE_UPGRADES_PRICE.cores);
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivineSkills(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough divine cores or skill points");
                }
            }
        } else {
            divineData.skill.rerollId = rerolledSkillsData;
            let dataLine = parseDivineDataToLore(divineData);
            let newLore = [...loreArray];
            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
            newLore[dataLineIndex] = dataLine;
                 
            newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
        }
    });
}

function openDivinePassivesNew(player, equipment, itemStack, loreArray) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    const divinePointsData = `§bPASSIVES ${divineUpgradePoints.passive}${DIVINE_ITEM_POINTS_ICONS.passive}   ${divineCores}`;
    
    const newPassives = new ActionFormData()
        .title("§l§bDIVINE SELECTION")
        .body('menu.invisible.rrs')
        .button(divinePointsData, 'textures/ui/invisible');
    
    // Get rerolled passives or generate new ones - FIXED: Handle as array like stats
    let rerolledPassivesData = divineData.passive.rerollId;
    if (rerolledPassivesData.includes(0)) {
        rerolledPassivesData = rerollPassiveDivine(parseTags(itemStack.typeId).data, 3);
    }
    
    // Add buttons for new passives (3 options)
    for (const rerolledPassive of rerolledPassivesData) {
        const DIVINE_PASSIVE_REROLLED = DIVINE_PASSIVES.find(divinePassive => divinePassive.id === rerolledPassive);
        newPassives.button(`${DIVINE_PASSIVE_REROLLED.name?.replace("%", "%%")} ${DIVINE_PASSIVE_REROLLED.measure?.replace("%", "%%") ?? ""}\n${GENERAL_DIVINE_UPGRADES_PRICE.cores}   ${GENERAL_DIVINE_UPGRADES_PRICE.points}${DIVINE_ITEM_POINTS_ICONS.passive}`, 'textures/ui/invisible');
    }
    
    newPassives.button(`§b§lReroll passives    ${GENERAL_DIVINE_UPGRADES_PRICE.reroll}${DIVINE_ITEM_POINTS_ICONS.passive}`, 'textures/ui/invisible');
    
    newPassives.show(player).then((r) => {
        if (!r.canceled) {
            if (r.selection === 0) {
                // Button 0 - Reopen passives menu
                divineData.passive.rerollId = rerolledPassivesData;
                let dataLine = parseDivineDataToLore(divineData);
                let newLore = [...loreArray];
                const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                newLore[dataLineIndex] = dataLine;
                     
                newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                let newItem = itemStack.clone();
                newItem.setLore(newLore);
                equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                const updatedLore = updatedItem.getLore();
                openDivinePassives(player, equipment, updatedItem, updatedLore);
            } else if (r.selection === 4) {
                // Reroll passives
                if (divineUpgradePoints.passive >= GENERAL_DIVINE_UPGRADES_PRICE.reroll) {
                    divineData.passive.rerollId = rerollPassiveDivine(parseTags(itemStack.typeId).data, 3);
                    
                    let newItem = spendItemPoints(equipment, itemStack, 0, 0, GENERAL_DIVINE_UPGRADES_PRICE.reroll, 0).clone();
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                    
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivinePassivesNew(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough passive points");
                }
            } else {
                // Select passive (buttons 1-3)
                const buttonId = r.selection - 1;
                const selectedPassive = rerolledPassivesData[buttonId];
                
                if (divineCores >= GENERAL_DIVINE_UPGRADES_PRICE.cores && divineUpgradePoints.passive >= GENERAL_DIVINE_UPGRADES_PRICE.points) {
                    const currentPassiveData = DIVINE_PASSIVES.find(divinePassive => divinePassive.id == divineData.passive.id);
                    const currentUpgradePercent = (currentPassiveData.hasOwnProperty("maxPossibleValue"))? Math.floor(divineData.passive.value / currentPassiveData.maxPossibleValue * DIVINE_PASSIVES.find(divinePassive => divinePassive.id == selectedPassive).maxPossibleValue) : DIVINE_PASSIVES.find(divinePassive => divinePassive.id == selectedPassive).min;
                    
                    
                    // Set new passive, preserve upgrade percentage
                    divineData.passive.id = selectedPassive;
                    divineData.passive.value = currentUpgradePercent;
                    divineData.passive.rerollId = rerollPassiveDivine(parseTags(itemStack.typeId).data, 3);
                    
                    let newItem = spendItemPoints(equipment, itemStack, 0, 0, GENERAL_DIVINE_UPGRADES_PRICE.points, 0).clone();
                    player.runCommand("clear @s rrs:divine_core 0 " + GENERAL_DIVINE_UPGRADES_PRICE.cores);
                    let dataLine = parseDivineDataToLore(divineData);
                    let newLore = [...newItem.getLore()];
                    const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                    newLore[dataLineIndex] = dataLine;
                        
                    newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                    newItem.setLore(newLore);
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        
                    const updatedItem = equipment.getEquipment(EquipmentSlot.Mainhand);
                    const updatedLore = updatedItem.getLore();
                    openDivinePassives(player, equipment, updatedItem, updatedLore);
                } else {
                    player.sendMessage("Not enough divine cores or passive points");
                }
            }
        } else {
            divineData.passive.rerollId = rerolledPassivesData;
            let dataLine = parseDivineDataToLore(divineData);
            let newLore = [...loreArray];
            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
            newLore[dataLineIndex] = dataLine;
                 
            newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
            let newItem = itemStack.clone();
            newItem.setLore(newLore);
            equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
        }
    });
}

const SIGNATURE_WEAPONS = [
    /* {   
        itemId: "rrs:razor_signature_weapon",
        texture: "textures/items/rrs_razor_signature_weapon",
        requirements: {
            text: "10 redstone",
            items: [
                {id: "minecraft:redstone", amount: 10}
            ],
            ascendingTier: 1
        },
        skill: 12001,
        passive: 12001,
        lore: []
    },
    {
        itemId: "rrs:oreman_signature_weapon",
        texture: "textures/items/rrs_oreman_signature_weapon",
        requirements: {
            text: "Figth §4swordsman 2",
            items: [
                {id: "minecraft:redstone", amount: 10}
            ],
            ascendingTier: 1
        },
        skill: 12002,
        passive: 12002,
        lore: []
    } */
];

function openSignatureWeapons(player, equipment, itemStack, loreArray, selection = 0) {
    const divineUpgradePoints = parsePointsFromLore(loreArray);
    const divineCores = countItemInInventory(player, "rrs:divine_core") ?? 0;
    let divineData = parseLoreToDivineData(loreArray);
    
    const tags = parseTags(itemStack.typeId);
    if (!meleeWeapons.includes(tags.data)) {
        player.sendMessage("This item don't have any signature forms");
        return;
    } else {
        const SIGNATURE_SKILL = DIVINE_SKILLS.find(divineSkill => divineSkill.id == SIGNATURE_WEAPONS[selection].skill);
        const SIGNATURE_PASSIVE = DIVINE_PASSIVES.find(divinePassive => divinePassive.id == SIGNATURE_WEAPONS[selection].passive);
                    
                    
                    
        const newValue = {
            skill: (SIGNATURE_SKILL.hasOwnProperty("maxPossibleValue"))? Math.floor(divineData.skill.value / SIGNATURE_SKILL.maxPossibleValue * DIVINE_SKILLS.find(divineSkill => divineSkill.id == SIGNATURE_WEAPONS[selection].skill).maxPossibleValue) : DIVINE_SKILLS.find(divineSkill => divineSkill.id == SIGNATURE_WEAPONS[selection].skill).min,
            passive: (SIGNATURE_PASSIVE.hasOwnProperty("maxPossibleValue"))? Math.floor(divineData.passive.value / SIGNATURE_PASSIVE.maxPossibleValue * DIVINE_PASSIVES.find(divinePassive => divinePassive.id == SIGNATURE_WEAPONS[selection].passive).maxPossibleValue) : DIVINE_PASSIVES.find(divinePassive => divinePassive.id == SIGNATURE_WEAPONS[selection].passive).min
        };
        
        const signatureForm = new ActionFormData()
            .title("§b§lSIGNATURE WEAPONS")
            .body("menu.invisible.rrs")
            // Left panel placeholder
            .button("", "textures/ui/arrow_left")
            // Skills + Passives placeholders
            .button(insertSmartLineBreaks(`§bSKILL\n${SIGNATURE_SKILL.name}§7${SIGNATURE_SKILL.description.replace(/{value}/g, newValue.skill)}${(SIGNATURE_SKILL.hasOwnProperty("measure"))? SIGNATURE_SKILL.measure.replace(/%/g, "%%") : ""}`), "textures/ui/invisible")
            .button(insertSmartLineBreaks(`§bPASSIVE\n${SIGNATURE_PASSIVE.name}§7${SIGNATURE_PASSIVE.description.replace(/{value}/g, newValue.passive)}${(SIGNATURE_PASSIVE.hasOwnProperty("measure"))? SIGNATURE_PASSIVE.measure.replace(/%/g, "%%") : ""}`), "textures/ui/invisible")
            // Requirements + Select placeholders
            .button(SIGNATURE_WEAPONS[selection].requirements.text, SIGNATURE_WEAPONS[selection].texture)
            .button("Select", "textures/ui/invisible")
            // Right panel placeholder
            .button("", "textures/ui/arrow_right");
        
        let allMaterials = true;
        for (const item of SIGNATURE_WEAPONS[selection].requirements.items) {
            if (countItemInInventory(player, item.id) < item.amount) {
                allMaterials = false;
                break;
            }
        }
        if (allMaterials && SIGNATURE_WEAPONS[selection].requirements.ascendingTier > divineData.ascending.stage)  allMaterials = false;
            
        signatureForm.show(player).then((r) => {
            if (!r.canceled) {
                if (r.selection == 0 || r.selection == 5) {
                    openSignatureWeapons(player, equipment, itemStack, loreArray, (r.selection == 0)? ((selection == 0)? SIGNATURE_WEAPONS.length - 1 : selection - 1) : ((selection == SIGNATURE_WEAPONS.length - 1)? 0 : selection + 1));
                } else if (r.selection == 4) {
                    if (allMaterials) {
                        divineData.skill.value = newValue.skill;
                        divineData.passive.value = newValue.passive;
                        
                        divineData.skill.id = SIGNATURE_SKILL.id;
                        divineData.passive.id = SIGNATURE_PASSIVE.id;
                        
                        for (const item of SIGNATURE_WEAPONS[selection].requirements.items) {
                            player.runCommand(`clear @s ${item.id} 0 ${item.amount}`);
                        }
                        
                        let newItem = new ItemStack(SIGNATURE_WEAPONS[selection].itemId);
                        
                        let dataLine = parseDivineDataToLore(divineData);
                        let newLore = [...SIGNATURE_WEAPONS[selection].lore, ...loreArray];
                        const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                        newLore[dataLineIndex] = dataLine;
                             
                        newLore = replaceArrayBetweenMarkers(newLore, DIVINE_DATA_MARKER, DIVINE_DATA_MARKER_END, parseDivineDataToVisibleLore(divineData));
                        newItem.setLore(newLore);
                        equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        player.playSound("beacon.activate");
                    } else {
                        player.sendMessage("You need to complete all requirements");
                    }
                } else {
                    openSignatureWeapons(player, equipment, itemStack, loreArray, selection)
                }
            }
        });
    }
}
//==========================================================
function rerollStatsDivine(tag, statsRoll = 3) {
    let rerollData = [];
    const AVAILABLE_DIVINE_STATS = DIVINE_STATS.filter(divineStat => divineStat.type.includes(tag));
    while (rerollData.length < statsRoll) {
        const randomStat = rni(AVAILABLE_DIVINE_STATS);
        if (randomStat.id > 0) rerollData.push(randomStat.id);
    }
    return rerollData;
}

function rerollSkillDivine(tag, skillRoll = 3) {
    let rerollData = [];
    const AVAILABLE_DIVINE_SKILLS = DIVINE_SKILLS.filter(divineSkill => divineSkill.type.includes(tag));
    while (rerollData.length < skillRoll) {
        const randomSkill = rni(AVAILABLE_DIVINE_SKILLS);
        if (randomSkill.id > 0) rerollData.push(randomSkill.id);
    }
    return rerollData;
}

function rerollPassiveDivine(tag, passiveRoll = 3) {
    let rerollData = [];
    const AVAILABLE_DIVINE_PASSIVES = DIVINE_PASSIVES.filter(divinePassive => divinePassive.type.includes(tag));
    while (rerollData.length < passiveRoll) {
        const randomPassive = rni(AVAILABLE_DIVINE_PASSIVES);
        if (randomPassive.id > 0) rerollData.push(randomPassive.id);
    }
    return rerollData;
}

function parseDivineDataToVisibleLore(divineData) {
    const loreArray = [];
    
    // Add stats section
    if (divineData.stats && divineData.stats.stats) {
        const validStats = divineData.stats.stats.filter(stat => stat.id && stat.id !== 0 && stat.value);
        
        if (validStats.length > 0) {
            loreArray.push("§bAttributes");
            validStats.forEach(stat => {
                // FIXED: Use .find() to match by id instead of array index
                const statInfo = DIVINE_STATS.find(s => s.id === stat.id);
                if (statInfo) {
                    // Format: "Stat Name: +value"
                    loreArray.push(`${statInfo.name} +${stat.value}${statInfo.measure ?? ""}`);
                }
            });
        }
    }
    
    // Add passive section
    if (divineData.passive && divineData.passive.id && divineData.passive.id !== 0 && divineData.passive.value) {
        // FIXED: Use .find() to match by id instead of array index
        const passiveInfo = DIVINE_PASSIVES.find(p => p.id === divineData.passive.id);
        if (passiveInfo) {
            loreArray.push(""); // Empty line for spacing
            loreArray.push("§bPassive");
            loreArray.push(`${passiveInfo.name}`);
            
            // Format passive description with value
            let description = passiveInfo.description || "";
            if (description.includes("{value}")) {
                description = insertSmartLineBreaks(description).replace("{value}", `§b${divineData.passive.value}§7`);
            } else {
                description += ` (${divineData.passive.value})`;
            }
            loreArray.push(`§7${description}`);
        }
    }
    
    // Add skill section
    if (divineData.skill && divineData.skill.id && divineData.skill.id !== 0 && divineData.skill.value) {
        // FIXED: Use .find() to match by id instead of array index
        const skillInfo = DIVINE_SKILLS.find(s => s.id === divineData.skill.id);
        if (skillInfo) {
            loreArray.push(""); // Empty line for spacing
            loreArray.push("§bSkill");
            loreArray.push(`${skillInfo.name}`);
            
            // Format skill description with value
            let description = skillInfo.description || "";
            if (description.includes("{value}")) {
                description = insertSmartLineBreaks(description).replace("{value}", `§b${divineData.skill.value}§7`);
            } else {
                description += ` (Level ${divineData.skill.value})`;
            }
            loreArray.push(`§7${description}`);
        }
    }
    
    return loreArray;
}

function replaceArrayBetweenMarkers(array, startMarker, endMarker, replacement) {
    // Find the indices of start and end markers
    const startIndex = array.findIndex(item => 
        item.includes(startMarker)
    );
    const endIndex = array.findIndex(item => 
        item.includes(endMarker)
    );
    
    // If markers not found, return original array
    if (startIndex === -1 || endIndex === -1) {
        console.warn('Markers not found in array');
        return [...array];
    }
    
    // If start marker comes after end marker, return original array
    if (startIndex >= endIndex) {
        console.warn('Start marker must come before end marker');
        return [...array];
    }
    
    // Create new array with replacement
    const result = [
        ...array.slice(0, startIndex + 1), // Keep everything up to and including start marker
        ...replacement,                     // Insert replacement content
        ...array.slice(endIndex)           // Keep from end marker onwards
    ];
    
    return result;
}

function parseLoreToDivineData(loreArray, marker = DIVINE_DATA_MARKER) {
    const dataArray = revealString(loreArray.find(line => line.includes(DIVINE_DATA_MARKER)), DIVINE_DATA_MARKER).split("_");

    return {
        stats: {
            stats: [
                {id: Number(dataArray[0].split("-")[0]) || 0, value: Number(dataArray[0].split("-")[1]) || 0},
                {id: Number(dataArray[1].split("-")[0]) || 0, value: Number(dataArray[1].split("-")[1]) || 0},
                {id: Number(dataArray[2].split("-")[0]) || 0, value: Number(dataArray[2].split("-")[1]) || 0},
                {id: Number(dataArray[3].split("-")[0]) || 0, value: Number(dataArray[3].split("-")[1]) || 0},
                {id: Number(dataArray[4].split("-")[0]) || 0, value: Number(dataArray[4].split("-")[1]) || 0}
            ],
            rerollId: [
                Number(dataArray[5]) || 0,
                Number(dataArray[6]) || 0,
                Number(dataArray[7]) || 0
            ]
        },
        passive: {
            id: Number(dataArray[8]) || 0,
            value: Number(dataArray[9]) || 0,
            // FIXED: Use correct indices for passive rerollId array
            rerollId: [
                Number(dataArray[10]) || 0,
                Number(dataArray[11]) || 0,
                Number(dataArray[12]) || 0
            ]
        },
        skill: {
            id: Number(dataArray[13]) || 0,
            value: Number(dataArray[14]) || 0,
            // FIXED: Use correct indices for skill rerollId array
            rerollId: [
                Number(dataArray[15]) || 0,
                Number(dataArray[16]) || 0,
                Number(dataArray[17]) || 0
            ]
        },
        ascending: {
            stage: Number(dataArray[18]) || 0,
            bonus: {
                maxStat: Number(dataArray[19]) || 0,
                maxPassive: Number(dataArray[20]) || 0,
                maxSkill: Number(dataArray[21]) || 0,
            },
            geoId: Number(dataArray[22]) || 0,
            stageBoostBarId: Number(dataArray[23]) || 0
        }
    };
}

function parseDivineDataToLore(divineData, marker = DIVINE_DATA_MARKER) {
    // Ensure arrays/objects exist to avoid runtime errors
    divineData = divineData || {};
    divineData.stats = divineData.stats || {};
    divineData.stats.stats = divineData.stats.stats || [];
    divineData.stats.rerollId = divineData.stats.rerollId || [0,0,0];
    divineData.passive = divineData.passive || {};
    divineData.passive.rerollId = divineData.passive.rerollId || [0,0,0]; // FIXED: Ensure array
    divineData.skill = divineData.skill || {};
    divineData.skill.rerollId = divineData.skill.rerollId || [0,0,0]; // FIXED: Ensure array
    divineData.ascending = divineData.ascending || { bonus: {} };
    divineData.ascending.bonus = divineData.ascending.bonus || {};

    // Build the data array from the divine data object
    const dataArray = [
        // Stats (5 stat objects) in format id-value
        `${divineData.stats.stats[0]?.id ?? 0}-${divineData.stats.stats[0]?.value ?? 0}`, // 0
        `${divineData.stats.stats[1]?.id ?? 0}-${divineData.stats.stats[1]?.value ?? 0}`, // 1
        `${divineData.stats.stats[2]?.id ?? 0}-${divineData.stats.stats[2]?.value ?? 0}`, // 2
        `${divineData.stats.stats[3]?.id ?? 0}-${divineData.stats.stats[3]?.value ?? 0}`, // 3
        `${divineData.stats.stats[4]?.id ?? 0}-${divineData.stats.stats[4]?.value ?? 0}`, // 4

        // Stats reroll IDs
        divineData.stats.rerollId[0] ?? 0, // 5
        divineData.stats.rerollId[1] ?? 0, // 6
        divineData.stats.rerollId[2] ?? 0, // 7

        // Passive
        divineData.passive.id ?? 0, // 8
        divineData.passive.value ?? 0, // 9
        
        // FIXED: Passive reroll IDs (3 separate values)
        divineData.passive.rerollId[0] ?? 0, // 10
        divineData.passive.rerollId[1] ?? 0, // 11
        divineData.passive.rerollId[2] ?? 0, // 12

        // Skill
        divineData.skill.id ?? 0, // 13
        divineData.skill.value ?? 0, // 14
        
        // FIXED: Skill reroll IDs (3 separate values)
        divineData.skill.rerollId[0] ?? 0, // 15
        divineData.skill.rerollId[1] ?? 0, // 16
        divineData.skill.rerollId[2] ?? 0, // 17

        // Ascending
        divineData.ascending.stage ?? 0, // 18
        divineData.ascending.bonus.maxStat ?? 0, // 19
        divineData.ascending.bonus.maxPassive ?? 0, // 20
        divineData.ascending.bonus.maxSkill ?? 0, // 21
        divineData.ascending.geoId ?? 0, // 22
        divineData.ascending.stageBoostBarId ?? 0 // 23
    ];

    // Join the data array with underscores
    const dataString = dataArray.join("_");

    // Use hideString to encode the data with the marker (reverse of revealString)
    return hideString(dataString, marker);
}
function rnb(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toTitleCase(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Chat commands
system.beforeEvents.startup.subscribe((init) => {
    init.customCommandRegistry.registerEnum("rrs:Rarity", ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Divine"]);
    
    // RRS Commands
    const enableSkillsCommand = {
        name: "rrs:enableskills",
        description: "Enable skills system",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const disableSkillsCommand = {
        name: "rrs:disableskills",
        description: "Disable skills system",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const enableDisplayCooldownSkillsCommand = {
        name: "rrs:enabledisplaycooldownskills",
        description: "Enable display cooldown for skills",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const disableDisplayCooldownSkillsCommand = {
        name: "rrs:disabledisplaycooldownskills",
        description: "Disable display cooldown for skills",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const enablePassivesCommand = {
        name: "rrs:enablepassives",
        description: "Enable passives system",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const disablePassivesCommand = {
        name: "rrs:disablepassives",
        description: "Disable passives system",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const enableDisplayCooldownPassivesCommand = {
        name: "rrs:enabledisplaycooldownpassives",
        description: "Enable display cooldown for passives",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const disableDisplayCooldownPassivesCommand = {
        name: "rrs:disabledisplaycooldownpassives",
        description: "Disable display cooldown for passives",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const menuCommand = {
        name: "rrs:menu",
        description: "Open main stats menu",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const statsCommand = {
        name: "rrs:stats",
        description: "Show stats form",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const settingsCommand = {
        name: "rrs:settings",
        description: "Open settings menu",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const divineMenuCommand = {
        name: "rrs:dm",
        description: "Abrir Menu Divino",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const upgradeMenuCommand = {
        name: "rrs:upgrade",
        description: "Safe way of upgrading item in mainhand",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const divineTransformCommand = {
        name: "rrs:divinereset",
        description: "Tranform divine item into high grade Mythic and get divine cores",
        permissionLevel: CommandPermissionLevel.Any
    };
    
    const giveItemWithRarityCommand = {
        name: "rrs:setrarity",
        description: "Set rarity on item",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: "rrs:Rarity" }
        ]
    };
    
    const configRRSCommand = {
        name: "rrs:configrrs",
        description: "Open config menu",
        permissionLevel: CommandPermissionLevel.GameDirectors
    };
    init.customCommandRegistry.registerCommand(configRRSCommand, configRRSFunction);
    
    
    // Register all commands
    init.customCommandRegistry.registerCommand(enableSkillsCommand, enableSkillsFunction);
    init.customCommandRegistry.registerCommand(disableSkillsCommand, disableSkillsFunction);
    init.customCommandRegistry.registerCommand(enableDisplayCooldownSkillsCommand, enableDisplayCooldownSkillsFunction);
    init.customCommandRegistry.registerCommand(disableDisplayCooldownSkillsCommand, disableDisplayCooldownSkillsFunction);
    init.customCommandRegistry.registerCommand(enablePassivesCommand, enablePassivesFunction);
    init.customCommandRegistry.registerCommand(disablePassivesCommand, disablePassivesFunction);
    init.customCommandRegistry.registerCommand(enableDisplayCooldownPassivesCommand, enableDisplayCooldownPassivesFunction);
    init.customCommandRegistry.registerCommand(disableDisplayCooldownPassivesCommand, disableDisplayCooldownPassivesFunction);
    init.customCommandRegistry.registerCommand(menuCommand, menuFunction);
    init.customCommandRegistry.registerCommand(statsCommand, statsFunction);
    init.customCommandRegistry.registerCommand(settingsCommand, settingsFunction);
    init.customCommandRegistry.registerCommand(divineMenuCommand, divineMenuFunction);
    init.customCommandRegistry.registerCommand(upgradeMenuCommand, upgradeMenuCommandFunction);
    init.customCommandRegistry.registerCommand(divineTransformCommand, divineTransformFunction);
    init.customCommandRegistry.registerCommand(giveItemWithRarityCommand, giveItemWithRarityFunction);
});

world.afterEvents.worldLoad.subscribe(() => {
    const config = world.getDynamicProperty("rrs_config");
    if (!config) {
        const config = {
            MOB_DIFFICULTY_SPEED,
            DIVINE_ENTITY_SPAWN_CHANCE,
            STRONG_ENTITY_SPAWN_CHANCE,
            ForceRarity,
            REFORGE_GUARANT_BOOST
        };
        
        // Save to world dynamic property
        world.setDynamicProperty("rrs_config", JSON.stringify(config));
        // Optional: Log the new values
        console.log("Configuration updated and saved:", config);
    } else {
        const values = JSON.parse(config);
        MOB_DIFFICULTY_SPEED = values.MOB_DIFFICULTY_SPEED;
        DIVINE_ENTITY_SPAWN_CHANCE = values.DIVINE_ENTITY_SPAWN_CHANCE;
        STRONG_ENTITY_SPAWN_CHANCE = values.STRONG_ENTITY_SPAWN_CHANCE;
        ForceRarity = values.ForceRarity;
        REFORGE_GUARANT_BOOST = values.REFORGE_GUARANT_BOOST;
        console.log("Rarity & stats config loaded");
    }
});

function showConfigurationMenu(player) {
    const form = new ModalFormData();
    
    form.title("Settings");
    
    // Mob Difficulty Speed (100-2000 range)
    form.slider(
        "Mob Difficulty Speed",
        100,
        20000,
        {
            defaultValue: MOB_DIFFICULTY_SPEED,
            valueStep: 100
        }
    );
    
    // Divine Entity Spawn Chance (0-100% as 0-1.0)
    form.slider(
        "Divine Entity Spawn Chance (%%)",
        0,
        100,
        {
            defaultValue: Math.round(DIVINE_ENTITY_SPAWN_CHANCE * 100),
            valueStep: 1
        }
    );
    
    // Strong Entity Spawn Chance (0-100% as 0-1.0)
    form.slider(
        "Strong Entity Spawn Chance (%%)",
        0,
        100,
        {
            defaultValue: Math.round(STRONG_ENTITY_SPAWN_CHANCE * 100),
            valueStep: 1
        }
    );
    
    // Force Rarity toggle
    form.toggle(
        "Force Rarity",
        {
            defaultValue: ForceRarity
        }
    );
    
    // Reforge Guarantee Boost (0-100% range)
    form.slider(
        "Reforge Guarantee Boost (%%)",
        0,
        100,
        {
            defaultValue: REFORGE_GUARANT_BOOST,
            valueStep: 1
        }
    );
    
    form.show(player).then(response => {
        if (response.canceled) {
            player.sendMessage("§cConfiguration canceled.");
            return;
        }
        
        // Destructure the form values array
        const [
            mobDifficultySpeed,
            divineSpawnChance,
            strongSpawnChance,
            forceRarity,
            reforgeBoost
        ] = response.formValues;
        
        // Update variables with form values
        MOB_DIFFICULTY_SPEED = mobDifficultySpeed;
        DIVINE_ENTITY_SPAWN_CHANCE = divineSpawnChance / 100; // Convert percentage back to decimal
        STRONG_ENTITY_SPAWN_CHANCE = strongSpawnChance / 100; // Convert percentage back to decimal
        ForceRarity = forceRarity;
        REFORGE_GUARANT_BOOST = reforgeBoost;
        
        // Create config object
        const config = {
            MOB_DIFFICULTY_SPEED,
            DIVINE_ENTITY_SPAWN_CHANCE,
            STRONG_ENTITY_SPAWN_CHANCE,
            ForceRarity,
            REFORGE_GUARANT_BOOST
        };
        
        // Save to world dynamic property
        world.setDynamicProperty("rrs_config", JSON.stringify(config));
        
        player.sendMessage("§aConfiguration updated successfully!");
        
        // Optional: Log the new values
        console.log("Configuration updated and saved:", config);
        
    });
}

// Command functions
function configRRSFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
    
        showConfigurationMenu(player);
    });
    
    return { status: CustomCommandStatus.Success };
}

function giveItemWithRarityFunction(origin, RARITYSID) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (!player || player.typeId != "minecraft:player") {
            return { status: CustomCommandStatus.Success };
        }
        
        const equippable = player.getComponent("minecraft:equippable");
        const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (itemStack) rarityItemTest(itemStack, player, RARITYSID, true);
    });
    
    return { status: CustomCommandStatus.Success };
}

function enableSkillsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            enableSkills(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function disableSkillsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            disableSkills(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function enableDisplayCooldownSkillsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            enableDisplayCooldownSkills(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function disableDisplayCooldownSkillsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            disableDisplayCooldownSkills(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function enablePassivesFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            enablePassives(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function disablePassivesFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            disablePassives(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function enableDisplayCooldownPassivesFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            enableDisplayCooldownPassives(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function disableDisplayCooldownPassivesFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            disableDisplayCooldownPassives(player);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function menuFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            system.runTimeout(() => statsMainMenu(player), 10);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function statsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            system.runTimeout(() => showStatsForm(player), 10);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function settingsFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            system.runTimeout(() => settings(player), 10);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

function divineMenuFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        if (player) {
            system.runTimeout(() => divineMenu(player), 1);
        }
    });
    
    return { status: CustomCommandStatus.Success };
}

// Core functions
function settings(player) {
    let settingsConfig = {
        "skills": {
            displayName: "Skills",
            tagToCheck: "disabledSkills",
            inverseLogic: true // true means tag exists = setting is OFF
        },
        "displayCooldownSkills": {
            displayName: "Display Cooldown Skills",
            tagToCheck: "disabledCooldownSkills",
            inverseLogic: true
        },
        "passives": {
            displayName: "Passives",
            tagToCheck: "disabledPassives",
            inverseLogic: true
        },
        "displayCooldownPassives": {
            displayName: "Display Cooldown Passives",
            tagToCheck: "showCooldownPassives",
            inverseLogic: false
        }
    };

    // Split object into arrays to ensure consistent index-based access
    const keys = Object.keys(settingsConfig);

    const settingsMenu = new ModalFormData()
        .title("SETTINGS");

    // Add toggle switches based on current tag states
    for (let i = 0; i < keys.length; i++) {
        const setting = settingsConfig[keys[i]];
        const hasTag = player.hasTag(setting.tagToCheck);
        
        // Determine toggle state based on logic
        let toggleState;
        if (setting.inverseLogic) {
            toggleState = !hasTag; // If inverse logic, toggle is ON when tag is absent
        } else {
            toggleState = hasTag; // If normal logic, toggle is ON when tag is present
        }
        
        settingsMenu.toggle(setting.displayName, {defaultValue: toggleState});
    }

    settingsMenu.submitButton("SAVE");

    settingsMenu.show(player).then((r) => {
        if (r.canceled) {
            return; // Exit early if canceled
        }

        // Process toggle values and update tags accordingly
        for (let i = 0; i < keys.length; i++) {
            const setting = settingsConfig[keys[i]];
            const toggleValue = r.formValues[i];
            const shouldHaveTag = setting.inverseLogic ? !toggleValue : toggleValue;
            
            if (shouldHaveTag) {
                if (!player.hasTag(setting.tagToCheck)) {
                    player.addTag(setting.tagToCheck);
                }
            } else {
                if (player.hasTag(setting.tagToCheck)) {
                    player.removeTag(setting.tagToCheck);
                }
            }
        }
    });
}

function enableSkills(player) {
    player.removeTag("disabledSkills");
    player.sendMessage("§aSkills enabled!");
}

function disableSkills(player) {
    player.addTag("disabledSkills");
    player.sendMessage("§cSkills disabled!");
}

function enableDisplayCooldownSkills(player) {
    player.removeTag("disabledCooldownSkills");
    player.sendMessage("§aSkill cooldown display enabled!");
}

function disableDisplayCooldownSkills(player) {
    player.addTag("disabledCooldownSkills");
    player.sendMessage("§cSkill cooldown display disabled!");
}

function enablePassives(player) {
    player.removeTag("disabledPassives");
    player.sendMessage("§aPassives enabled!");
}

function disablePassives(player) {
    player.addTag("disabledPassives");
    player.sendMessage("§cPassives disabled!");
}

function enableDisplayCooldownPassives(player) {
    player.addTag("showCooldownPassives");
    player.sendMessage("§aPassive cooldown display enabled!");
}

function disableDisplayCooldownPassives(player) {
    player.removeTag("showCooldownPassives");
    player.sendMessage("§cPassive cooldown display disabled!");
}

function divineTransformFunction(origin) {
    system.run(() => {
        const player = origin.sourceEntity;
        const equipment = player.getComponent("minecraft:equippable");
        const itemStack = equipment?.getEquipment(EquipmentSlot.Mainhand);
        
        const loreArray = itemStack?.getLore();
        if (!equipment || !itemStack || !loreArray || !loreArray.some(line => line.includes(DIVINE_LEVEL_MARKER))) {
            player.sendMessage("You need to hold divine item");
            return;
        }
        rarityItemTest(itemStack, player, (Math.random() > 0.75)? "Mythic" : "Legendary", true);
        const divineCores = rnb(15, 25);
        player.runCommand("give @s rrs:divine_core " + divineCores);
    });
    
    return { status: CustomCommandStatus.Success };
}


world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const block = ev.block;
    const player = ev.player;
    const itemStack = ev.itemStack;
    if (!itemStack || !block || !player || block.typeId != "rrs:heavy_anvil") return;
    
    // Use system.runTimeout to add tag
    system.runTimeout(() => {
        player.addTag("reforge_ui");
    }, 1);
});

// System interval to handle UI for tagged players
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.hasTag("reforge_ui")) {
            player.removeTag("reforge_ui");
            upgradeMenu(player);
        }
    }
}, 10);

function findInsertIndex(loreArray) {
    const fallbackTags = [ATRIBUTES_MARKER_START, SKILLS_MARKER_START, PASSIVES_MARKER_START, RRS_MARKER];

    for (const tag of fallbackTags) {
        const index = loreArray.indexOf(tag);
        if (index !== -1) {
            return index - 1;
        }
    }

    // If none of the tags are found, return a default like end of array or -1
    return loreArray.length - 1; // or return -1 if you prefer that
}

function upgradeMenuCommandFunction(origin) {
    system.run(() => {
        if (findBlockNear(origin.sourceEntity)) {
            origin.sourceEntity.addTag("reforge_ui");
        } else {
            return { status: CustomCommandStatus.Failure };
        }
    });
    
    return { status: CustomCommandStatus.Success };
}



//=====================================CORE GAME LOGIC===========================================

function randomRarity(RR = RR_BASE, materialData = MaterialRarity[3]) {
    let rarity = RR ?? RARITY.COMMON;
    let currentId = rarity.id ?? 1;

    while (true) {
        const nextRarity = Object.values(RARITY).find(r => r.id === currentId + 1);
        if (!nextRarity) break; // no higher rarity exists

        if (Math.random() <= nextRarity.chance + materialData.chance && currentId < materialData.maxRarity) {
            rarity = nextRarity;
            currentId++;
        } else {
            break;
        }
    }
    return rarity;
}

function weightedRandom(items) {
    const totalWeight = Object.values(items).reduce((sum, obj) => sum + obj.weight, 0);
    let rand = Math.random() * totalWeight;
  
    for (let obj of Object.values(items)) {
        if (rand < obj.weight) {
            return obj.id;
        }
        rand -= obj.weight;
    }
}

function randomStats(rarity, type) {
    // Filter available stats that match the item type
    const availableStats = stats.filter(stat => stat.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);

    if (!availableStats.length) {
        return [];
    }
    // Calculate number of stats to add
    let StatsCounter = Math.floor(Math.random() * (srr.maxStats - srr.minStats + 1) + srr.minStats);

    let result = [];

    if (StatsCounter > 0) {
        result.push(ATRIBUTES_MARKER_START);

        let addedStats = 0;
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loops

        while (addedStats < StatsCounter && attempts < maxAttempts) {
            // Calculate rarity level for this stat
            let statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
            let RR = Object.values(RARITY).find(r => r.id === statRarityLevel);

            if (!RR) continue;

            // Filter stats by rarity
            const validStats = availableStats.filter(s => s.rarity == RR.sid);

            if (validStats.length > 0) {
                const newStat = validStats[Math.floor(Math.random() * validStats.length)];

                const newStatValue = Math.floor(rnb(newStat.min, newStat.max) * BOOST_COEF / 10);
                const measure = newStat.measure ?? "";
                const sign = newStatValue >= 0 ? "+" : "";

                result.push(`${newStat.name}§w ${sign}§w${newStatValue}§w${measure}`);
                addedStats++;
            }

            attempts++;
        }
        result.push(ATRIBUTES_MARKER_END);
    }
    return result;
}

function randomSkill(rarity, type) {
    // Filter available skills that match the item type
    const availableSkills = skills.filter(skill => skill.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);

    if (!availableSkills.length || srr.skillChances.skill < Math.random()) {
        return [];
    }

    let result = [];
    let skillData = null;

    // Generate skill data first
    const statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
    const RR = Object.values(RARITY).find(r => r.id === statRarityLevel);

    if (RR) {
        const validSkills = availableSkills.filter(s => s.rarity == RR.sid);

        if (validSkills.length > 0) {
            const newSkill = validSkills[Math.floor(Math.random() * validSkills.length)];

            const newSkillValue = Math.floor(rnb(newSkill.min, newSkill.max) * BOOST_COEF / 10);
            const newSkillValueST = ("§w" + newSkillValue + "§w");
            const description = insertSmartLineBreaks(newSkill.description.replace(/\{x\}|§x/g, match => match === "{x}" ? newSkillValueST : RR.color));

            skillData = {
                name: newSkill.name,
                description: description,
                cooldown: "§eCooldown: " + Math.floor(newSkill.cooldown / 10) + "s"
            };
        }
    }

    // Push skill section and data if we have valid skill data
    if (skillData) {
        result.push(SKILLS_MARKER_START);
        result.push(skillData.name);
        result.push(skillData.description);
        result.push(skillData.cooldown);
        result.push(SKILLS_MARKER_END);
    }

    return result;
}

function randomPassiveAbility(rarity, type) {
    // Filter available passives that match the item type
    const availablePassives = passives.filter(passive => passive.type.includes(type));
    let srr = Object.values(RARITY).find(r => r.sid === rarity);

    if (!availablePassives.length || srr.skillChances.passive < Math.random()) {
        return [];
    }

    let result = [];
    let passiveData = null;

    // Generate passive data first
    const statRarityLevel = Math.min(6, Math.max(1, srr.id - Math.floor(Math.random() * 2)));
    const RR = Object.values(RARITY).find(r => r.id === statRarityLevel);

    if (RR) {
        const validPassives = availablePassives.filter(s => s.rarity == RR.sid);

        if (validPassives.length > 0) {
            const newPassive = validPassives[Math.floor(Math.random() * validPassives.length)];

            const newPassiveValue = Math.floor(rnb(newPassive.min, newPassive.max) * BOOST_COEF / 10);
            const newPassiveValueST = ("§w" + newPassiveValue + "§w");
            const description = insertSmartLineBreaks(newPassive.description.replace(/\{x\}|§x/g, match => match === "{x}" ? newPassiveValueST : RR.color));

            passiveData = {
                name: newPassive.name,
                description: description,
                cooldown: "§eCooldown: " + Math.floor(newPassive.cooldown / 10) + "s"
            };
        }
    }

    // Push passive section and data if we have valid passive data
    if (passiveData) {
        result.push(PASSIVES_MARKER_START);
        result.push(passiveData.name);
        result.push(passiveData.description);
        result.push(passiveData.cooldown);
        result.push(PASSIVES_MARKER_END);
    }

    return result;
}

function clearLore(lore) {
    const clearedLore = [];
    let inSection = false; // To track if we're within a section to remove

    // Define the rarity strings to remove
    const rarities = [
        "§7Common",
        "§aUncommon",
        "§9Rare",
        "§5Epic",
        "§6Legendary",
        "§cMythic",
        "§bDivine"
    ];

    // Iterate through each entry in the lore array
    for (const line of lore) {
        // Check the starting and ending conditions for each section to clear
        if (line.includes(ATRIBUTES_MARKER_START)) {
            inSection = true; // We are now in the Attributes section
        } else if (line.includes(ATRIBUTES_MARKER_END) && inSection) {
            inSection = false; // End of Attributes section
            continue; // Skip this line
        } else if (line.includes(SKILLS_MARKER_START)) {
            inSection = true; // We are now in the Skill section
        } else if (line.includes(SKILLS_MARKER_END) && inSection) {
            inSection = false; // End of Skill section
            continue; // Skip this line
        } else if (line.includes(PASSIVES_MARKER_START)) {
            inSection = true; // We are now in the Passive ability section
        } else if (line.includes(PASSIVES_MARKER_END) && inSection) {
            inSection = false; // End of Passive ability section
            continue; // Skip this line
        }

        // If we're not in a section to remove and the line doesn't contain unwanted text, add the line
        if (!inSection && !line.includes(RRS_MARKER) && !rarities.some(rarity => line.includes(rarity))) {
            clearedLore.push(line); // Only add lines that shouldn't be removed
        }
    }

    return clearedLore; // Return the cleaned lore
}

function rarityItemTest(itemStack, player, rarityUp = "None", upGuarant = false) {
    // Early validation
    if (!itemStack || !player) return;

    const lore = itemStack.getLore() ?? [];
    
    // Check if item already has our marker using more efficient method
    const hasMyLore = lore.includes(RRS_MARKER);
    
    // Skip processing if item already has lore and no rarity upgrade requested
    if (hasMyLore && rarityUp === "None") return;
    
    const Tags = parseTags(itemStack.typeId);
    let Material = parseMaterial(itemStack.typeId);
    if (!Tags?.rarity) return;
    
    if (!Material) Material = moddedMaterialParse(itemStack.typeId);

    if (!Material && !ForceRarity) return;
    
    if (!Material && ForceRarity) Material = MaterialRarity[3] // default assuming that items material is epic
    
    const clearedLore = clearLore(lore);
    let rarity;

    if (rarityUp === "None") {
        // New item gets random rarity
        rarity = randomRarity(RR_BASE, Material);
    } else {
        // Handle rarity upgrade
        rarity = Object.values(RARITY).find(r => r.sid === rarityUp);
        
        if (!upGuarant && rarity) {
            // Calculate upgrade chance with clamping
            let id = Math.floor(weightedRandom(RARITY) + (rarity.id / 100 * REFORGE_GUARANT_BOOST));
            id = Math.min(Material.maxRarity ?? 1, id);
            
            // 7% chance for divine (id 7) if rolled 6
            if (id >= 6 && Math.random() < RARITY.DIVINE.chance) {
                id = 7;
            }
            
            rarity = Object.values(RARITY).find(r => r.id === id);
        }
    }

    if (!rarity) return;
    let dName = rarity.dName 
    // Handle divine rarity (placeholder)
    let dNameLevel = "";
    if (rarity.id === 7) {
        dNameLevel = `${DIVINE_LEVEL_MARKER}0${DIVINE_LEVEL_BAR[DIVINE_LEVEL_BAR.length - 1]} §b0/20 xp`;
    }

    // Generate item attributes
    const stats = randomStats(rarity.sid, Tags.data);
    const skill = randomSkill(rarity.sid, Tags.data);
    const passive = randomPassiveAbility(rarity.sid, Tags.data);

    // Create new lore
    let newLore = [
        ...clearedLore,
        dName,
        ...stats,
        ...skill,
        ...passive,
        RRS_MARKER
    ];
    if (rarity.id === 7) {
        newLore = [
            ...clearedLore,
            dName,
            dNameLevel,
            ...stats,
            ...skill,
            ...passive,
            RRS_MARKER
        ];
    }

    // Apply changes to item
    try {
        const newItem = itemStack.clone();
        newItem.setLore(newLore);
        
        const equippable = player.getComponent("minecraft:equippable");
        equippable?.setEquipment(EquipmentSlot.Mainhand, newItem);
    } catch (error) {
        console.warn("Error applying rarity:", error);
    }
}


function calculateDamage(player, damage = 0) {
    damage = (damage + getScoreboardValue("rrsdamage", player)) * (1 + (getScoreboardValue("rrsdamagepercent", player) / 100));

    const critChance = getScoreboardValue("rrscritchance", player);
    if ((Math.random() * 100) <= critChance + 5) {
        damage = damage * (1 + (getScoreboardValue("rrscritdamage", player) / 100));
        player.runCommand("title @s actionbar §cCRIT " + damage.toFixed(1));
    }

    return Math.floor(damage);
}

function compileBuffs(player) {
    const equipment = player.getComponent("minecraft:equippable");
    const slots = [
        EquipmentSlot.Mainhand, EquipmentSlot.Offhand,
        EquipmentSlot.Head, EquipmentSlot.Chest,
        EquipmentSlot.Legs, EquipmentSlot.Feet
    ];

    let scoreboardStats = [];

    for (const slot of slots) {
        const attributes = parseLoreToStats(equipment, slot);
        for (let attribute of attributes) {
            const values = attribute.split("§w");
            const StatObj = stats.find(d => d.name === values[0]);
            if (!StatObj) continue;

            scoreboardStats.push({
                sbObj: StatObj.scoreboardTracker,
                valueToAdd: Number(values[2])
            });
        }
        
        //divine logic
        const item = equipment.getEquipment(slot);
        if (!item || !item.getLore().includes(DIVINE_DATA_MARKER_END)) continue;
        const divineAttributes = parseLoreToDivineStats(equipment, slot);
        scoreboardStats.push(...divineAttributes);
    }
    

    // Summing values by scoreboardTracker
    const summedStats = {};
    for (const entry of scoreboardStats) {
        // Use the scoreboard name directly since we have predefined static scoreboards
        const scoreboardName = entry.sbObj;

        if (!summedStats[scoreboardName]) {
            summedStats[scoreboardName] = 0;
        }
        summedStats[scoreboardName] += entry.valueToAdd;
    }

    // Set score to player for each predefined scoreboard
    for (const scoreboardDef of PREDEFINED_SCOREBOARDS) {
        const scoreValue = summedStats[scoreboardDef.name] || 0;
        const objective = world.scoreboard.getObjective(scoreboardDef.name);
        if (objective) {
            objective.setScore(player, Math.floor(scoreValue));
        }
    }
}

function healEntity(entity, value = getScoreboardValue("rrsregeneration", entity)) {
    let cHealth = entity.getComponent("minecraft:health");
    cHealth.setCurrentValue(Math.min((cHealth.currentValue + Math.floor(value)), cHealth.effectiveMax));
}

function setMainStats(player) {
    //get all stats
    let health = Math.floor(getScoreboardValue("rrshealth", player) / 4);
    let defense = Math.floor(Math.min(getScoreboardValue("rrsdefense", player), 80) / 20) - 1;
    let speed = Math.floor(Math.min(getScoreboardValue("rrsspeed", player), 200) / 20) - 1;
    let healthBoost = (getScoreboardValue("rrshealthpercent", player) / 100) + 1;

    health = Math.floor(((health + 5) * healthBoost) - 6);

    if (health >= 0) {
        player.addEffect("health_boost", 62, {
            amplifier: health,
            showParticles: false
        });
    }
    if (defense >= 0) {
        player.addEffect("resistance", 62, {
            amplifier: defense,
            showParticles: false
        });
    }
    if (speed >= 0) {
        player.addEffect("speed", 62, {
            amplifier: speed,
            showParticles: false
        });
    }
}

function findBlockNear(player, blockid = "rrs:heavy_anvil") {
    const playerLocation = player.location;
    const dimension = player.dimension;
    
    let anvilFound = false;
    for (let x = -3; x <= 3; x++) {
        for (let y = -3; y <= 3; y++) {
            for (let z = -3; z <= 3; z++) {
                const checkLocation = {
                    x: playerLocation.x + x,
                    y: playerLocation.y + y,
                    z: playerLocation.z + z
                };
                
                try {
                    const block = dimension.getBlock(checkLocation);
                    if (block && block.typeId === blockid) {
                        return true;
                        break;
                    }
                } catch (error) {
                    // Block might be unloaded or out of bounds
                    continue;
                }
            }
        }
    }
    return false;
}

//=====================================LORE PARSING FUNCTIONS===========================================

function parseLoreToStats(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];

    let attributes = [];
    let ix = 0;
    let addATB = false;

    while (ix < loreArray.length) {
        if (loreArray[ix] === ATRIBUTES_MARKER_START) {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== ATRIBUTES_MARKER_END) {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }

    return attributes;
}

function parseLoreToSkills(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];

    let attributes = [];
    let ix = 0;
    let addATB = false;

    while (ix < loreArray.length) {
        if (loreArray[ix] === SKILLS_MARKER_START) {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== SKILLS_MARKER_END) {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }

    const string = attributes.join(" ");
    const stringVal = string.match(/§w(.*?)§w/);
    const stringCd = string.match(/§eCooldown: (.*?)s/);

    const Skill = {
        name: attributes[0] || "NaS",
        value: stringVal ? Number(stringVal[1]) : 0,
        cooldown: stringCd ? Number(stringCd[1]) : 0
    }

    return Skill;
}

function parseLoreToPassive(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];

    const loreArray = itemStack.getLore();
    if (!loreArray || loreArray.length === 0) return [];

    let attributes = [];
    let ix = 0;
    let addATB = false;

    while (ix < loreArray.length) {
        if (loreArray[ix] === PASSIVES_MARKER_START) {
            addATB = true;
            ix++;
            while (ix < loreArray.length && loreArray[ix] !== PASSIVES_MARKER_END) {
                attributes.push(loreArray[ix]);
                ix++;
            }
            break;
        }
        ix++;
    }

    const string = attributes.join(" ");
    const stringVal = string.match(/§w(.*?)§w/);
    const stringCd = string.match(/§eCooldown: (.*?)s/);

    const Passive = {
        name: attributes[0] || "NaP",
        value: stringVal ? Number(stringVal[1]) : 0,
        cooldown: stringCd ? Number(stringCd[1]) : 0
    }

    return Passive;
}

// Divine parsers
function parseLoreToDivineStats(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack) return [];
    const divineData = parseLoreToDivineData(itemStack.getLore());
    
    let divineAttributes = [];
    for (const divineStat of divineData.stats.stats) {
        if (divineStat.id == 0) continue;
        const statValue = divineStat.value;
        const scoreboard = DIVINE_STATS.find(divineStatObj => divineStatObj.id === divineStat.id).scoreboardTracker;
        divineAttributes.push({
                sbObj: scoreboard,
                valueToAdd: statValue
            });
    }
    
    return divineAttributes;
}

function parseLoreToDivineSkills(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack || !itemStack.getLore().includes(DIVINE_DATA_MARKER_END)) return false;
    const divineData = parseLoreToDivineData(itemStack.getLore());
    
    const divineSkill = DIVINE_SKILLS.find(divineSkillObj => divineSkillObj.id === divineData.skill.id);
    
    const Skill = {
        name: divineSkill.name || "NaDS",
        value: divineData.skill.value || 0,
        cooldown: Math.floor(divineSkill.cooldown / 10) || 0
    }

    return Skill;
}

function parseLoreToDivinePassives(equipment, slot) {
    const itemStack = equipment.getEquipment(slot);
    if (!itemStack || !itemStack.getLore().includes(DIVINE_DATA_MARKER_END)) return false;
    const divineData = parseLoreToDivineData(itemStack.getLore());
    
    const divinePassive = DIVINE_PASSIVES.find(passiveObj => passiveObj.id === divineData.passive.id);
    
    const Passive = {
        name: divinePassive.name || "NaDP",
        value: divineData.passive.value || 0,
        cooldown: Math.floor(divinePassive.cooldown / 10) || 0
    }

    return Passive;
}
//=====================================EVENT LISTENERS & HANDLERS===========================================

// Core game loops
system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        rarityItemTest(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand), player);
        compileBuffs(player);
        setMainStats(player);
    }
}, 20);

system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        try {
            if (!player.hasTag("CYoneStatsVertX")) {//CY - COMPATIBILITY
                healEntity(player);
            }
            //DO NOT DELETE LINE BELLOW, IT NEEDED FOR COMPATIBILITY WITH OTHER ADDONS
            if (!player.hasTag("CYrrsvertX")) player.addTag("CYrrsvertx");
        } catch (error) {
            // Handle the error, e.g., log it to the console
            console.error(`Failed to heal player ${player.name}: ${error.message}`);
        }
    }
}, 200);

system.runInterval(() => {
    updateCooldown();
}, 2);

// Enhanced passive ability triggers with divine passive support
system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        try {
            // Regular passive check
            const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Head);
            if (passive && passive.name && passive.name !== "NaP" && passive.name.slice(2) == "Aegis") {
                passiveAegis(player, passive);
            }

            // Divine passive check
            const divinePassive = parseLoreToDivinePassives(player.getComponent("minecraft:equippable"), EquipmentSlot.Head);
            if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
                switch (divinePassive.name.slice(2)) {
                    case "Aegis":
                        passiveAegis(player, divinePassive);
                        break;
                    // Add other divine passive cases here
                    default:
                        console.log("Unknown divine passive:", divinePassive.name);
                }
            }
        } catch (e) {
            console.log("Error in passive interval:", e);
        }
    }
}, 20);

// Enhanced combat event handlers with divine passive support
world.afterEvents.entityHurt.subscribe((ev) => {
    if (!ev.damageSource.damagingEntity || ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;
    const player = ev.damageSource.damagingEntity;
    const mob = ev.hurtEntity;
    let damage = calculateDamage(player, ev.damage);

    if (meleeWeapons.includes(parseTags(player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId).data)) {

        const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
        const divinePassive = parseLoreToDivinePassives(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);

        // Handle dragon damage with both regular and divine passives
        if (mob.typeId == "minecraft:ender_dragon") {
            if (passive && passive.name.slice(2) == "Dragon slayer") {
                damage = Math.floor(damage * (1 + (passive.value / 100)));
            }
            if (divinePassive && divinePassive.name.slice(2) == "Dragon slayer") {
                damage = Math.floor(damage * (1 + (divinePassive.value / 100)));
            }
            const health = mob.getComponent("minecraft:health");
            health.setCurrentValue(Math.max(0, Math.floor(health.currentValue - damage)));
        } else {
            mob.applyDamage(damage);
        }
        
        healEntity(player, (getScoreboardValue("rrslifesteal", player) / 100) * damage);

        // Regular passive triggers
        if (passive && passive.name && passive.name !== "NaP") {
            switch (passive.name.slice(2)) {
                case 'Frost Touch':
                    passiveFrostTouch(player, passive, mob);
                    break;
                case 'Lightning Strike':
                    passiveLightningStrike(player, passive, mob);
                    break;
                case 'Vampiric':
                    passiveVampiric(player, passive, damage);
                    break;
                case 'Poison Blade':
                    passivePoisonBlade(player, passive, mob);
                    break;
            }
        }

        // Divine passive triggers
        if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
            switch (divinePassive.name.slice(2)) {
                case 'Frost Touch':
                    passiveFrostTouch(player, divinePassive, mob);
                    break;
                case 'Lightning Strike':
                    passiveLightningStrike(player, divinePassive, mob);
                    break;
                case 'Vampiric':
                    passiveVampiric(player, divinePassive, damage);
                    break;
                case 'Poison Blade':
                    passivePoisonBlade(player, divinePassive, mob);
                    break;
                default:
                    console.log("Unknown divine passive:", divinePassive.name);
            }
        }
    }
});

// Enhanced projectile hit entity with divine passive support
world.afterEvents.projectileHitEntity.subscribe((ev) => {
    if (!ev.source || ev.source.typeId !== "minecraft:player" || (!ev.projectile.typeId.includes("arrow") && !ev.projectile.typeId.includes("trident") && !ev.source.hasTag("opFun"))) return;

    const player = ev.source;
    const entityHit = ev.getEntityHit();

    if (!entityHit || !entityHit.entity) return;

    const mob = entityHit.entity;
    
    const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
    const divinePassive = parseLoreToDivinePassives(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
    
    let damage = calculateDamage(player, 6);
    
    if (mob.typeId !== "minecraft:enderman") {
        if (mob.typeId == "minecraft:ender_dragon") {
            if (passive && passive.name.slice(2) == "Dragon slayer") {
                damage = Math.floor(damage * (1 + (passive.value / 100)));
            }
            if (divinePassive && divinePassive.name.slice(2) == "Dragon slayer") {
                damage = Math.floor(damage * (1 + (divinePassive.value / 100)));
            }
            const health = mob.getComponent("minecraft:health");
            health.setCurrentValue(Math.max(0, Math.floor(health.currentValue - damage)));
        } else {
            mob.applyDamage(damage);
        }
        healEntity(player, (getScoreboardValue("rrslifesteal", player) * damage) / 200);
    }
    
    // Regular passive triggers
    if (passive && passive.name && passive.name !== "NaP") {
        switch (passive.name.slice(2)) {
            case 'Ender Arrow':
                passiveEnderArrow(player, passive, mob, damage);
                break;
            case 'Lightning Strike':
                passiveLightningStrike(player, passive, ev);
                break;
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, passive, ev);
                break;
        }
    }

    // Divine passive triggers
    if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
        switch (divinePassive.name.slice(2)) {
            case 'Ender Arrow':
                passiveEnderArrow(player, divinePassive, mob, damage);
                break;
            case 'Lightning Strike':
                passiveLightningStrike(player, divinePassive, ev);
                break;
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, divinePassive, ev);
                break;
            default:
                console.log("Unknown divine passive:", divinePassive.name);
        }
    }
});

// Enhanced projectile hit block with divine passive support
world.afterEvents.projectileHitBlock.subscribe((ev) => {
    if (!ev.source || ev.source.typeId !== "minecraft:player") return;
    const player = ev.source;
    
    const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);
    const divinePassive = parseLoreToDivinePassives(player.getComponent("minecraft:equippable"), EquipmentSlot.Mainhand);

    // Regular passive triggers
    if (passive && passive.name && passive.name !== "NaP") {
        switch (passive.name.slice(2)) {
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, passive, ev);
                break;
            case 'Lightning Strike':
                passiveLightningStrike(player, passive, ev);
                break;
        }
    }

    // Divine passive triggers
    if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
        switch (divinePassive.name.slice(2)) {
            case 'Explosive Arrows':
                passiveExplosiveArrows(player, divinePassive, ev);
                break;
            case 'Lightning Strike':
                passiveLightningStrike(player, divinePassive, ev);
                break;
            default:
                console.log("Unknown divine passive:", divinePassive.name);
        }
    }
});

// Enhanced player hurt event with divine passive support
world.afterEvents.entityHurt.subscribe((ev) => {
    // Check if player is receiving damage
    if (ev.hurtEntity.typeId === "minecraft:player") {
        const player = ev.hurtEntity;
        
        const slots = [EquipmentSlot.Chest, EquipmentSlot.Head, EquipmentSlot.Legs, EquipmentSlot.Feet];
        
        for (const slot of slots) {
            // Regular passive check
            const passive = parseLoreToPassive(player.getComponent("minecraft:equippable"), slot);
            if (passive && passive.name && passive.name !== "NaP") {
                switch (passive.name.slice(2)) {
                    case 'Dragon Armor':
                        passiveDragonArmor(player, passive, ev);
                        break;
                }
            }

            // Divine passive check
            const divinePassive = parseLoreToDivinePassives(player.getComponent("minecraft:equippable"), slot);
            if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
                switch (divinePassive.name.slice(2)) {
                    case 'Dragon Armor':
                        passiveDragonArmor(player, divinePassive, ev);
                        break;
                    default:
                        console.log("Unknown divine passive:", divinePassive.name);
                }
            }
        }
    }
});

// Enhanced block break event with divine passive support
world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const equipment = player.getComponent("minecraft:equippable");
    const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
    
    for (const slot of slots) {
        // Regular passive triggers
        const passive = parseLoreToPassive(equipment, slot);
        if (passive && passive.name && passive.name !== "NaP") {
            // Add your regular passive block break effects here
            // Examples: bonus drops, experience gain, chance for special effects, etc.
        }

        // Divine passive triggers
        const divinePassive = parseLoreToDivinePassives(equipment, slot);
        if (divinePassive && divinePassive.name && divinePassive.name !== "NaDP") {
            switch (divinePassive.name.slice(2)) {
                // Add divine passive block break effects here
                // Examples: enhanced bonus drops, divine experience gain, etc.
                default:
                    console.log("Unknown divine passive:", divinePassive.name);
            }
        }
    }
});

// Skill activation event handler
world.afterEvents.itemUse.subscribe((ev) => {
    const player = ev.source;
    
    const anvilFound = findBlockNear(player)
    
    
    if ((!player.hasTag("safeSkills") && player.isSneaking) || player.hasTag("disabledSkills") || anvilFound) return;
    const equipment = player.getComponent("minecraft:equippable");

    const skill = parseLoreToSkills(equipment, EquipmentSlot.Mainhand);
    if (skill && skill.name && skill.name !== "NaS") {
        switch (skill.name.slice(2)) {
            case "Smash Leap":
                skillSmashLeap(player, skill);
                break;
            case "Spin Strike":
                skillSpinStrike(player, skill);
                break;
            case "Explosive Mining":
                skillExplosiveMining(player, skill);
                break;
            case "Ray Miner":
                skillRayMiner(player, skill);
                break;
            case "Excavator":
                skillExcavator(player, skill);
                break;
            case "Flame Arc":
                skillFlameArc(player, skill);
                break;
            case "Shadow Dash":
                skillShadowDash(player, skill);
                break;
            case "Void Pierce":
                skillVoidPierce(player, skill);
                break;
            default:
                console.log("Divine skill");
        }
    } else {
        //divine skill activation
        const divineSkill = parseLoreToDivineSkills(equipment, EquipmentSlot.Mainhand);
        if (divineSkill && divineSkill.name && divineSkill.name !== "NaDS") {
            switch (divineSkill.name.slice(2)) {
                case "Smash Leap":
                    skillSmashLeap(player, divineSkill);
                    break;
                case "Spin Strike":
                    skillSpinStrike(player, divineSkill);
                    break;
                case "Explosive Mining":
                    skillExplosiveMining(player, divineSkill);
                    break;
                case "Ray Miner":
                    skillRayMiner(player, divineSkill);
                    break;
                case "Excavator":
                    skillExcavator(player, divineSkill);
                    break;
                case "Flame Arc":
                    skillFlameArc(player, divineSkill);
                    break;
                case "Shadow Dash":
                    skillShadowDash(player, divineSkill);
                    break;
                case "Void Pierce":
                    skillVoidPierce(player, divineSkill);
                    break;
                default:
                    console.log("Skill error");
            }
        }
    }
});

//=====================================INITIALIZATION===========================================

// Initialize scoreboards immediately when the script loads
system.runTimeout(() => {initializeScoreboards()}, 50);



//=====================================SKILLS FUNCTIONALITY===========================================

function checkAndSetCooldown(player, skillName, cooldownValue, object = skills) {
    const ccd = testCooldown(player, skillName, object);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills") && object === skills) {
            player.runCommand(`title @s actionbar ${skillName} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        }
        if (player.hasTag("showCooldownPassives") && object === passives) {
            player.runCommand(`title @s actionbar ${skillName} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        }
        return false;
    }
    if (!ccd.obj) {
        console.warn(`Cannot set cooldown for ${skillName} - scoreboard not found`);
        return false;
    }
    ccd.obj.setScore(player, cooldownValue);
    return true;
}



function skillSmashLeap(player, skill) {
    if (!checkAndSetCooldown(player, skill.name, skill.cooldown * 10)) {
        return;
    }

    // Stun enemies
    player.runCommand(`effect @e[r=${skill.value}] slowness 2 4 true`);
    player.runCommand(`effect @s slowness 0`);
    // Ground impact
    player.runCommand(`particle minecraft:block_dust_stone ~ ~1 ~`);
    player.runCommand(`particle minecraft:smash_ground_particle ~ ~1 ~`);
    player.runCommand(`playsound mace.heavy_smash_ground @s`);
    // Wind leap (only if player has wind charge)
    player.runCommand(`effect @s[hasitem={item=wind_charge}] levitation 1 7 true`);
    player.runCommand(`playsound wind_charge.burst @s[hasitem={item=wind_charge}]`);
    player.runCommand(`execute at @s[hasitem={item=wind_charge}] run particle minecraft:wind_explosion_emitter ~ ~ ~`);
    player.runCommand(`clear @s[hasitem={item=wind_charge}] wind_charge 0 1`);
}

function skillSpinStrike(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const damage = calculateDamage(player, skill.value);

    // Spin attack particles and sound
    player.runCommand(`particle minecraft:critical_hit_emitter ~ ~1 ~`);

    // Hit and damage enemies
    player.addTag("spinStrikeProtection");
    player.runCommand(`damage @e[r=3,tag=!spinStrikeProtection] ${damage}`);
    player.removeTag("spinStrikeProtection");

    // 360 spin visuals
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        player.runCommand(`particle minecraft:critical_hit_emitter ~${x.toFixed(2)} ~1 ~${z.toFixed(2)}`);
    }
}

function skillExplosiveMining(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const size = skill.value;
    player.addEffect("resistance", 50, {
        amplifier: 4
    });
    player.dimension.createExplosion(player.location, size, {
        breaksBlocks: true
    });

    // Explosion effects
    player.runCommand(`particle minecraft:explosion_emitter ~ ~ ~`);
    player.runCommand(`particle minecraft:large_explosion ~ ~ ~`);
    player.runCommand(`playsound entity.generic.explode @s`);
}

function skillRayMiner(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const distance = skill.value;
    let blocksDestroyed = 0;

    player.runCommand(`playsound block.beacon.activate @s`);
    player.runCommand(`particle minecraft:electric_spark_particle ~ ~1 ~`);

    for (let i = 1; i <= distance; i++) {
        player.runCommand(`execute at @s positioned ^^1^${i} run particle minecraft:electric_spark_particle ~ ~ ~`);
        player.runCommand(`execute at @s positioned ^^1^${i} run particle minecraft:scrape ~ ~ ~`);

        const result = player.runCommand(`execute at @s positioned^^1^${i} run testforblock ~ ~ ~ air`);
        if (result.successCount === 0) {
            player.runCommand(`execute at @s positioned^^1^${i} run setblock ~ ~ ~ air destroy`);
            blocksDestroyed++;
        }
    }

    if (blocksDestroyed > 0) {
        const tooleq = player.getComponent("minecraft:equippable");
        const tool = tooleq.getEquipment(EquipmentSlot.Mainhand);
        if (tool?.typeId && tool.hasComponent("minecraft:durability")) {
            const durability = tool.getComponent("minecraft:durability");
            durability.damage += blocksDestroyed;
            tooleq.setEquipment(EquipmentSlot.Mainhand, tool);
        }
    }
}

function skillExcavator(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const depth = skill.value;
    const sandBlocks = ["sand", "gravel", "dirt", "clay", "coarse_dirt", "podzol", "mycelium", "grass_block"];
    let blocksDestroyed = 0;

    player.runCommand(`particle minecraft:falling_dust_sand ~ ~1 ~`);
    player.runCommand(`playsound block.gravel.break @s`);

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            for (let y = 0; y < depth; y++) {
                for (const block of sandBlocks) {
                    const result = player.runCommand(`execute at @s positioned^${x} ^${z + 1} ^${y} run testforblock ~ ~ ~ ${block}`);
                    if (result.successCount > 0) {
                        player.runCommand(`execute at @s positioned^${x} ^${z + 1} ^${y} run setblock ~ ~ ~ air destroy`);
                        blocksDestroyed++;
                        break;
                    }
                }
            }
        }
    }

    if (blocksDestroyed > 0) {
        const tooleq = player.getComponent("minecraft:equippable");
        const tool = tooleq.getEquipment(EquipmentSlot.Mainhand);
        if (tool?.typeId && tool.hasComponent("minecraft:durability")) {
            const durability = tool.getComponent("minecraft:durability");
            durability.damage += blocksDestroyed;
            tooleq.setEquipment(EquipmentSlot.Mainhand, tool);
        }
    }
}

function skillFlameArc(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const damage = calculateDamage(player, skill.value);
    player.runCommand(`particle minecraft:flame ~ ~1 ~`);
    player.runCommand(`playsound item.firecharge.use @s`);

    const arcPositions = [
        "^^^2", "^^^3", "^^^4", "^^^5",
        "^1^^2", "^1^^3", "^1^^4",
        "^-1^^2", "^-1^^3", "^-1^^4"
    ];
    
    player.addTag("flameArcProtection");
    for (const pos of arcPositions) {
        player.runCommand(`execute at @s positioned${pos} run fill ~ ~ ~ ~ ~ ~ fire replace air`);
        player.runCommand(`execute at @s positioned${pos} run particle minecraft:mobflame_single ~ ~ ~`);
        player.runCommand(`execute at @s positioned${pos} run damage @e[r=1,tag=!flameArcProtection] ${damage} fire`);
        player.runCommand(`execute at @s positioned${pos} run effect @e[r=1,tag=!flameArcProtection] slowness 2 2 true`);
    }
    player.removeTag("flameArcProtection")
}

function skillShadowDash(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    let dashDistance = skill.value;
    const groundCheck = player.runCommand(`execute at @s positioned~ ~-11 ~ run testforblock ~ ~ ~ air`);
    if (groundCheck.successCount > 0) dashDistance = Math.floor(dashDistance / 2);

    player.runCommand(`particle minecraft:portal ~ ~1 ~`);
    player.runCommand(`playsound entity.enderman.teleport @s`);

    for (let i = 1; i <= dashDistance; i++) {
        player.runCommand(`execute at @s positioned^^^${i} run particle minecraft:portal ~ ~ ~`);
    }

    player.runCommand(`tp @s ^^^${dashDistance}`);
}

function skillVoidPierce(player, skill) {
    const ccd = testCooldown(player, skill.name);
    if (ccd.time > 0) {
        if (!player.hasTag("disabledCooldownSkills")) player.runCommand(`title @s actionbar ${skill.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, skill.cooldown * 10);

    const damage = calculateDamage(player, skill.value);
    player.runCommand(`particle minecraft:reverse_portal ~ ~1.5 ~`);
    player.runCommand(`playsound entity.wither.shoot @s`);
    
    player.addTag("voidPierceProtection");
    for (let i = 1; i <= 9; i++) {
        player.runCommand(`execute at @s positioned^^1^${i} run particle minecraft:endrod ~ ~ ~`);
        player.runCommand(`execute at @s positioned^^1^${i} run damage @e[r=1,tag=!voidPierceProtection] ${damage} magic`);
        player.runCommand(`execute at @s positioned^^1^${i} if entity @e[r=1,tag=!voidPierceProtection] run playsound entity.arrow.hit @s`);
    }
    player.removeTag("voidPierceProtection");

    player.runCommand(`execute at @s positioned^^1^9 run particle minecraft:dragon_breath_fire ~ ~ ~`);
}




//=====================================PASSIVES FUNCTIONALITY===========================================

/*function hawkEye(player) {
    const range = 6 + (getScoreboardValue("rrshawkeyerange", player) ?? 0);
    const hitData = getEntitiesFromViewDirection();
    const entity = hitData[0].entity;
    const distance = hitData[0].distance;

    if (!entity || !player) return;

    // Health
    const healthComp = entity.getComponent("minecraft:health");
    const currentHealth = healthComp?.currentValue ?? 0;
    const maxHealth = healthComp?.effectiveValue ?? 0;

    // Get nameTag or generate from typeId
    let name = entity.nameTag;
    if (!name || name.trim() === "") {
        // Parse typeId into readable name
        let rawType = entity.typeId.replace("minecraft:", "");
        name = rawType
            .split("_")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    let healthPercent = Math.floor((currentHealth / maxHealth) * 33);
    
    const healthBar = HEALTH_BAR_FONT.charAt(healthPercent);
    
    
    

}*/

function passiveFrostTouch(player, passive, entity) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    entity.addEffect("slowness", passive.value * 20, {amplifier: 2})
    if (Math.random() > 0.95) {
        const posX = entity.location.x;
        const posY = entity.location.y;
        const posZ = entity.location.z;
        entity.runCommand(`setblock ${posX} ${posY - 1} ${posZ} powder_snow`);
    }
}

function passiveLightningStrike(player, passive, event) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    if (Math.random() <= (passive.value / 100)) {
        ccd.obj.setScore(player, passive.cooldown * 10);
        event.dimension.spawnEntity("lightning_bolt", event.location);
    }
}

function passiveEnderArrow(player, passive, entity, damage) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    
    if (entity.typeId == "minecraft:enderman" && Math.random() <= passive.value) {
        entity.applyDamage(damage);
        ccd.obj.setScore(player, passive.cooldown * 10);
    }
}

function passiveVampiric(player, passive, damage) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    if (world.getMoonPhase() == MoonPhase.FullMoon && world.getTimeOfDay() >= 13500) {
        healEntity(player, damage * passive.value / 100);
    }
}

function passivePoisonBlade(player, passive, entity) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    entity.addEffect("poison", passive.value * 20, {amplifier: passive.value});
}

function passiveExplosiveArrows(player, passive, event) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    ccd.obj.setScore(player, passive.cooldown * 10);
    
    event.dimension.createExplosion(event.location, passive.value);
}

function passiveDragonArmor(player, passive, ev) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }
    const damageCause = ev.damageSource.cause;
    if (damageCause == EntityDamageCause.fireTick || damageCause == EntityDamageCause.fire || damageCause == EntityDamageCause.lava) {
        ccd.obj.setScore(player, passive.cooldown * 10);
        player.addEffect("fire_resistance", passive.value * 20);
        player.addEffect("regeneration", 40);
        player.addEffect("resistance", passive.value * 20);
    }
}

// function passiveFrostGuard(player, passive, ev) {
//     if (player.hasTag("disabledPassives")) return;
//     const ccd = testCooldown(player, passive.name, passives);
//     if (ccd.time > 0) {
//         if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
//         return;
//     }
// 
//     const loc = player.location;
//     const block = player.dimension.getBlock(loc);
// 
//     // Place temporary ice block under player if air or water below
//     if (block.typeId === "minecraft:air" || block.typeId === "minecraft:water") {
//         block.setType("minecraft:ice");
//     }
// 
//     // Slow nearby enemies in a 1.5-block radius
//     const nearbyEntities = player.dimension.getEntities({
//         location: loc,
//         maxDistance: 1.5,
//         excludeTypes: ["minecraft:player"]
//     });
//     for (const entity of nearbyEntities) {
//         entity.addEffect("slowness", passive.value * 20, 1);
//     }
// 
//     // Set cooldown
//     ccd.obj.setScore(player, passive.cooldown * 10);
// }

function passiveAegis(player, passive) {
    if (player.hasTag("disabledPassives")) return;
    const ccd = testCooldown(player, passive.name, passives);
    if (ccd.time > 0) {
        if (player.hasTag("showCooldownPassives")) player.runCommand(`title @s actionbar ${passive.name} on cooldown: §e${(ccd.time / 10).toFixed(1)}s`);
        return;
    }

    // Loop through current negative effects
    let effectsRemoved = 0;
    const negativeEffects = ["poison", "wither", "blindness", "slowness", "weakness", "mining_fatigue"];
    for (const effect of player.getEffects()) {
        if (effectsRemoved >= passive.value) break;
        
        if (negativeEffects.includes(effect.displayName)) {
            player.removeEffect(effect.displayName);
        }
    }
    if (effectsRemoved >= 1) {
        ccd.obj.setScore(player, passive.cooldown * 10);
    }
}












//DIVINE THINGS
// Configuration for drop chances (percentages)

/**
 * Get a random number between 1 and 100
 */
function getRandomChance() {
    return Math.floor(Math.random() * 100) + 1;
}

/**
 * Determine which material to drop based on chances
 * Returns null if no drop should occur
 */
function determineDroppedMaterial() {
    const roll = getRandomChance();
    
    if (roll <= DROP_CONFIG.material1.chance) {
        return DROP_CONFIG.material1.item;
    } else if (roll <= DROP_CONFIG.material1.chance + DROP_CONFIG.material2.chance) {
        return DROP_CONFIG.material2.item;
    } else if (roll <= DROP_CONFIG.material1.chance + DROP_CONFIG.material2.chance + DROP_CONFIG.material3.chance) {
        return DROP_CONFIG.material3.item;
    }
    
    return null; // No drop
}

/**
 * Check if entity type should be affected by custom drops
 */
function shouldAffectEntity(entityTypeId) {
    // If no specific entities are configured, affect all
    if (AFFECTED_ENTITIES.length === 0) {
        return true;
    }
    
    return AFFECTED_ENTITIES.includes(entityTypeId);
}

// Register the entity death event listener
world.afterEvents.entityDie.subscribe((eventData) => {
    const { deadEntity, damageSource } = eventData;
    
    // Check if this entity type should be affected
    if (!shouldAffectEntity(deadEntity.typeId)) {
        return;
    }
    
    // Get the entity's location for dropping items
    const location = deadEntity.location;
    const dimension = deadEntity.dimension;
    
    // Determine what material to drop
    const materialToDrop = determineDroppedMaterial();
    
    if (materialToDrop) {
        try {
            // Create and spawn the item
            const itemStack = new ItemStack(materialToDrop, 1);
            
            // Add a small delay to ensure the entity is fully processed
            system.runTimeout(() => {
                dimension.spawnItem(itemStack, location);
                
                // Optional: Add particle effects or sounds
                // dimension.spawnParticle("minecraft:villager_happy", location);
                // dimension.playSound("random.orb", location);
                
            }, 1);
            
        } catch (error) {
            console.warn(`Failed to drop material ${materialToDrop}:`, error);
        }
    }
});

// Fixed parseDivineString function with better error handling
function parseDivineString(str, divine_level_marker = DIVINE_LEVEL_MARKER) {
    console.log("Parsing string:", str);
    
    // Escape special regex characters in the marker
    const escapedMarker = divine_level_marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // More flexible regex that handles various color codes and spacing
    const regex = new RegExp(`^${escapedMarker}(\\d+)(.)\\s*(?:§[0-9a-fklmnor])?(\\d+)\\/(\\d+)\\s*(?:xp)?$`, 'i');
    const match = str.match(regex);

    console.log("Regex:", regex);
    console.log("Match result:", match);

    if (!match) {
        console.error('Failed to parse divine string:', str);
        console.error('Expected format: MARKER + level + barChar + §color + currentXp/requiredXp + xp');
        return null; // Return null instead of throwing
    }

    const result = {
        level: parseInt(match[1], 10),
        barChar: match[2],
        currentXp: parseInt(match[3], 10),
        requiredXp: parseInt(match[4], 10)
    };
    
    console.log("Parsed result:", result);
    return result;
}

const REVERSED_DIVINE_LEVEL_BAR = [...DIVINE_LEVEL_BAR].reverse();

// Function to calculate points gained for leveling up from oldLevel to newLevel
function calculatePointsGained(oldLevel, newLevel) {
    const points = {
        stats: 0,
        passive: 0,
        skill: 0,
        ascending: 0
    };
    
    // Calculate points gained for each level between oldLevel and newLevel
    for (let level = oldLevel + 1; level <= newLevel; level++) {
        // 1 stat point per level
        points.stats += 1;
        
        // 1 passive and 1 skill point every 3 levels
        if (level % 3 === 0) {
            points.passive += 1;
            points.skill += 1;
        }
        
        // 1 ascending point every 10 levels
        if (level % 10 === 0) {
            points.ascending += 1;
        }
    }
    
    return points;
}

// Function to parse lore and extract current point values
function parsePointsFromLore(lore) {
    const pointsLine = lore.find(line => line.includes(DIVINE_POINTS_MARKER));
    
    if (!pointsLine) {
        return { stats: 0, passive: 0, skill: 0, ascending: 0 };
    }
    
    const points = { stats: 0, passive: 0, skill: 0, ascending: 0 };
    
    // Extract numbers following each icon
    const statsMatch = pointsLine.match(new RegExp(`${DIVINE_ITEM_POINTS_ICONS.stats}(\\d+)`));
    const passiveMatch = pointsLine.match(new RegExp(`${DIVINE_ITEM_POINTS_ICONS.passive}(\\d+)`));
    const skillMatch = pointsLine.match(new RegExp(`${DIVINE_ITEM_POINTS_ICONS.skill}(\\d+)`));
    const ascendingMatch = pointsLine.match(new RegExp(`${DIVINE_ITEM_POINTS_ICONS.ascending}(\\d+)`));
    
    if (statsMatch) points.stats = parseInt(statsMatch[1]);
    if (passiveMatch) points.passive = parseInt(passiveMatch[1]);
    if (skillMatch) points.skill = parseInt(skillMatch[1]);
    if (ascendingMatch) points.ascending = parseInt(ascendingMatch[1]);
    
    return points;
}

// Function to add points to existing points
function addPoints(currentPoints, pointsToAdd) {
    return {
        stats: currentPoints.stats + pointsToAdd.stats,
        passive: currentPoints.passive + pointsToAdd.passive,
        skill: currentPoints.skill + pointsToAdd.skill,
        ascending: currentPoints.ascending + pointsToAdd.ascending
    };
}

// Function to subtract points from existing points (for spending)
function subtractPoints(currentPoints, pointsToSubtract) {
    return {
        stats: Math.max(0, currentPoints.stats - pointsToSubtract.stats),
        passive: Math.max(0, currentPoints.passive - pointsToSubtract.passive),
        skill: Math.max(0, currentPoints.skill - pointsToSubtract.skill),
        ascending: Math.max(0, currentPoints.ascending - pointsToSubtract.ascending)
    };
}

// Function to create points display line
function createPointsLine(points) {
    const parts = [];
    
    parts.push(`${DIVINE_ITEM_POINTS_ICONS.stats}${points.stats}`);
    parts.push(`${DIVINE_ITEM_POINTS_ICONS.passive}${points.passive}`);
    parts.push(`${DIVINE_ITEM_POINTS_ICONS.skill}${points.skill}`);
    parts.push(`${DIVINE_ITEM_POINTS_ICONS.ascending}${points.ascending}`);
    
    return `${DIVINE_POINTS_MARKER} ${parts.join(" ")}`;
}

// Function to update item points in lore
function updateItemPoints(equippable, item, newPoints) {
    const itemStack = item.clone();
    const lore = itemStack.getLore();
    const newPointsLine = createPointsLine(newPoints);
    const newLore = [...lore];
    
    console.log("Original lore:", newLore);
    
    let pointsLineIndex = newLore.findIndex(line => line.includes(DIVINE_POINTS_MARKER));
    
    if (pointsLineIndex !== -1) {
        // Update existing points line
        newLore[pointsLineIndex] = newPointsLine;
        console.log("Updated existing points line at index:", pointsLineIndex);
    } else {
        // Add new points line - try to place it after the divine level line
        const divineLevelLineIndex = newLore.findIndex(line => line.includes(DIVINE_LEVEL_MARKER));
        if (divineLevelLineIndex !== -1) {
            newLore.splice(divineLevelLineIndex + 1, 0, newPointsLine);
            pointsLineIndex = divineLevelLineIndex + 1;
            console.log("Added new points line after divine level at index:", pointsLineIndex);
        } else {
            // If no divine level line found, add at the end
            newLore.push(newPointsLine);
            pointsLineIndex = newLore.length - 1;
            console.log("Added new points line at end, index:", pointsLineIndex);
        }
    }
    console.log("Final lore:", newLore);
    itemStack.setLore(newLore);
    equippable.setEquipment(EquipmentSlot.Mainhand, itemStack);
    return itemStack;
}

// Function to spend points on an item (returns true if successful, false if not enough points)
function spendItemPoints(equippable, itemStack, stats = 0, skill = 0, passive = 0, ascending = 0) {
    const currentPoints = parsePointsFromLore(itemStack.getLore());
    const pointsToSpend = {stats, skill, passive, ascending};
    
    // Check if player has enough points
    if (currentPoints.stats < pointsToSpend.stats ||
        currentPoints.passive < pointsToSpend.passive ||
        currentPoints.skill < pointsToSpend.skill ||
        currentPoints.ascending < pointsToSpend.ascending) {
        return false; // Not enough points
    }
    
    // Subtract points and update item
    const newPoints = subtractPoints(currentPoints, pointsToSpend);
    return updateItemPoints(equippable, itemStack, newPoints);
}

// Enhanced main event handler
world.afterEvents.entityDie.subscribe((ev) => {
    const entity = ev.deadEntity;
    const player = ev.damageSource?.damagingEntity;
    
    if (ev.damageSource && player && player.typeId == "minecraft:player") {
        if (entity.hasTag("divine_entity")) {
            const level = Number(entity.getTags().find(tag => tag.startsWith(DIVINE_LEVEL_TAG_ENTITY_MARKER))?.slice(DIVINE_LEVEL_TAG_ENTITY_MARKER.length));
            const levelData = DIVINE_TIER_DROPS.find(tier => tier.id === level);
            
            if (!levelData) {
                console.warn("No level data found for divine entity level:", level);
                return;
            }
            
            if (Math.random() < levelData.chance / 100) {
                const amount = rnb(levelData.min, levelData.max);
                const itemStack = new ItemStack("rrs:divine_core", amount);
                const location = entity.location;
                const dimension = entity.dimension;
                
                dimension.spawnItem(itemStack, location);
            }
            
            const equippable = player.getComponent("minecraft:equippable");
            if (!equippable) {
                console.warn("Player has no equippable component");
                return;
            }
            
            const slots = [EquipmentSlot.Mainhand, EquipmentSlot.Offhand, EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
            
            let equipmentAll = [];
            for (const slot of slots) {
                const itemStack = equippable.getEquipment(slot);
                if (itemStack && itemStack.getLore().some(line => line.includes(DIVINE_LEVEL_MARKER))) {
                    equipmentAll.push({item: itemStack, slot: slot, lore: itemStack.getLore()});
                }
            }
            
            const xp = rnb(levelData.xpMin, levelData.xpMax);
            const equipmentAmount = equipmentAll.length;
            
            console.log(`Processing ${equipmentAmount} divine equipment pieces with ${xp} total XP`);
            
            if (equipmentAmount > 0) {
                const xpPerItem = Math.floor(xp / equipmentAmount);
                
                for (const equipment of equipmentAll) {
                    try {
                        const newItem = equipment.item.clone();
                        
                        // Find the line that contains the divine marker
                        const divineLevelLine = equipment.lore.find(line => line.includes(DIVINE_LEVEL_MARKER));
                        
                        if (!divineLevelLine) {
                            console.warn("No divine level line found despite includes check passing");
                            continue;
                        }
                        
                        console.log("Processing divine line:", divineLevelLine);
                        
                        // Extract the divine part if the marker isn't at the start
                        let divineString = divineLevelLine;
                        if (!divineLevelLine.startsWith(DIVINE_LEVEL_MARKER)) {
                            const markerIndex = divineLevelLine.indexOf(DIVINE_LEVEL_MARKER);
                            divineString = divineLevelLine.substring(markerIndex);
                        }
                        
                        console.log("Divine string to parse:", divineString);
                        
                        const divineLevelData = parseDivineString(divineString);
                        
                        if (!divineLevelData) {
                            console.warn("Failed to parse divine level data from:", divineString);
                            continue;
                        }
                        
                        const lineIndex = equipment.lore.indexOf(divineLevelLine);
                        
                        // Calculate new XP and level
                        let newCurrentXp = divineLevelData.currentXp + xpPerItem;
                        let newLevel = divineLevelData.level;
                        let newRequiredXp = divineLevelData.requiredXp;
                        const oldLevel = divineLevelData.level; // Store original level for points calculation
                        
                        console.log(`Before leveling: Level ${newLevel}, XP ${divineLevelData.currentXp}/${newRequiredXp}, adding ${xpPerItem}`);
                        
                        // Handle level ups (can level up multiple times if enough XP)
                        while (newCurrentXp >= newRequiredXp && newRequiredXp > 0) {
                            newCurrentXp -= newRequiredXp;
                            newLevel++;
                            
                            console.log(`Leveled up to ${newLevel}, remaining XP: ${newCurrentXp}`);
                            
                            // Get XP requirements for the new level with null check
                            const nextLevelData = getDivineXpNext(newLevel);
                            if (!nextLevelData) {
                                console.log("Max level reached");
                                newCurrentXp = newRequiredXp;
                                break;
                            }
                            newRequiredXp = nextLevelData.xp;
                        }
                        
                        console.log(`After leveling: Level ${newLevel}, XP ${newCurrentXp}/${newRequiredXp}`);
                        
                        // Create new divine level line with updated values using REVERSED bar
                        const progressRatio = newRequiredXp > 0 ? newCurrentXp / newRequiredXp : 0;
                        const barIndex = Math.min(REVERSED_DIVINE_LEVEL_BAR.length - 1, Math.max(0, Math.floor(progressRatio * REVERSED_DIVINE_LEVEL_BAR.length)));
                        const barChar = REVERSED_DIVINE_LEVEL_BAR[barIndex];
                        
                        console.log(`Progress: ${progressRatio}, Bar index: ${barIndex}, Bar char: ${barChar}`);
                        
                        let newDivineString = `${DIVINE_LEVEL_MARKER}${newLevel}${barChar} §b${newCurrentXp}/${newRequiredXp} xp`;
                        
                        // If the original line had content before the marker, preserve it
                        let newDivineLevelLine = newDivineString;
                        if (!divineLevelLine.startsWith(DIVINE_LEVEL_MARKER)) {
                            const markerIndex = divineLevelLine.indexOf(DIVINE_LEVEL_MARKER);
                            const prefix = divineLevelLine.substring(0, markerIndex);
                            newDivineLevelLine = prefix + newDivineString;
                        }
                        
                        console.log("New divine line:", newDivineLevelLine);
                        
                        // Handle points system - only if level increased
                        let pointsGained = { stats: 0, passive: 0, skill: 0, ascending: 0 };
                        if (newLevel > oldLevel) {
                            // Get current points from item
                            const currentPoints = parsePointsFromLore(equipment.lore);
                            
                            // Calculate points gained from leveling up
                            pointsGained = calculatePointsGained(oldLevel, newLevel);
                            
                            // Add gained points to current points
                            const newPoints = addPoints(currentPoints, pointsGained);
                            
                            console.log(`Points gained: Stats +${pointsGained.stats}, Passive +${pointsGained.passive}, Skill +${pointsGained.skill}, Ascending +${pointsGained.ascending}`);
                            console.log(`New total points: Stats ${newPoints.stats}, Passive ${newPoints.passive}, Skill ${newPoints.skill}, Ascending ${newPoints.ascending}`);
                        }
                        
                        // Update the lore
                        const newLore = [...equipment.lore];
                        newLore[lineIndex] = newDivineLevelLine;
                        
                        // Handle points line if there was a level up
                        if (newLevel > oldLevel) {
                            const currentPoints = parsePointsFromLore(equipment.lore);
                            const newPoints = addPoints(currentPoints, pointsGained);
                            const newPointsLine = createPointsLine(newPoints);
                            
                            // Find and update or add points line
                            const pointsLineIndex = newLore.findIndex(line => line.includes(DIVINE_POINTS_MARKER));
                            
                            if (pointsLineIndex !== -1) {
                                // Update existing points line
                                newLore[pointsLineIndex] = newPointsLine;
                            } else {
                                // Add new points line right after the divine level line
                                newLore.splice(lineIndex + 1, 0, newPointsLine);
                            }
                            
                            const dataLineIndex = newLore.findIndex(line => line.includes(DIVINE_DATA_MARKER));
                            console.log("Data line search result:", dataLineIndex);
                            
                            if (dataLineIndex === -1) {
                                const newDataLine = `${DIVINE_DATA_MARKER}${DIVINE_DATA_STRING_BASE}`;
                                console.log("Creating new data line:", newDataLine);
                                console.log("Points line index for insertion:", pointsLineIndex);
                                
                                // We know where the points line is now, so add data line right after it
                                if (pointsLineIndex !== -1) {
                                    console.log("Inserting data line at index:", pointsLineIndex + 1);
                                    newLore.splice(pointsLineIndex + 1, 0, newDataLine, "§p", DIVINE_DATA_MARKER_END);
                                    console.log("Lore after data line insertion:", newLore);
                                } else {
                                    // Fallback: add at the end
                                    console.log("Fallback: adding data line at end");
                                }
                            } else {
                                console.log("Data line already exists at index:", dataLineIndex);
                            }
                        }
                        
                        newItem.setLore(newLore);
                        
                        // Re-equip the updated item
                        equippable.setEquipment(equipment.slot, newItem);
                        
                        console.log("Successfully updated and re-equipped item");
                        
                        // Optional: Send level up message to player with points info
                        if (newLevel > oldLevel) {
                            const levelDifference = newLevel - oldLevel;
                            const itemName = newItem.nameTag || newItem.typeId || "Divine Item";
                            
                            let pointsMessage = "";
                            const gainedParts = [];
                            if (pointsGained.stats > 0) gainedParts.push(`${DIVINE_ITEM_POINTS_ICONS.stats}+${pointsGained.stats}`);
                            if (pointsGained.passive > 0) gainedParts.push(`${DIVINE_ITEM_POINTS_ICONS.passive}+${pointsGained.passive}`);
                            if (pointsGained.skill > 0) gainedParts.push(`${DIVINE_ITEM_POINTS_ICONS.skill}+${pointsGained.skill}`);
                            if (pointsGained.ascending > 0) gainedParts.push(`${DIVINE_ITEM_POINTS_ICONS.ascending}+${pointsGained.ascending}`);
                            
                            if (gainedParts.length > 0) {
                                pointsMessage = ` §7[${gainedParts.join(" ")}]`;
                            }
                            
                            player.sendMessage(`§6§l[DIVINE] §r§eYour ${itemName} leveled up ${levelDifference} time(s) to level ${newLevel}!${pointsMessage}`);
                        }
                        
                    } catch (error) {
                        console.error("Error processing divine equipment:", error);
                        console.error("Stack trace:", error.stack);
                    }
                }
            }
        }
    }
});

// Export functions for external use

function addDivineItemPoints(equippable, itemStack, pointsToAdd = {stats: 0, passive: 0, skill: 0, ascending: 0}) {
    const currentPoints = parsePointsFromLore(itemStack.getLore());
    const newPoints = addPoints(currentPoints, pointsToAdd);
    return updateItemPoints(equippable, itemStack, newPoints);
}

function getDivineXpNext(lvl) {
    const xpTable = [
        {
            level: 0,
            xp: 20
        },
        {
            level: 1,
            xp: 20
        },
        {
            level: 2,
            xp: 22
        },
        {
            level: 3,
            xp: 24
        },
        {
            level: 4,
            xp: 26
        },
        {
            level: 5,
            xp: 28
        },
        {
            level: 6,
            xp: 30
        },
        {
            level: 7,
            xp: 33
        },
        {
            level: 8,
            xp: 36
        },
        {
            level: 9,
            xp: 39
        },
        {
            level: 10,
            xp: 43
        },
        {
            level: 11,
            xp: 47
        },
        {
            level: 12,
            xp: 52
        },
        {
            level: 13,
            xp: 57
        },
        {
            level: 14,
            xp: 63
        },
        {
            level: 15,
            xp: 69
        },
        {
            level: 16,
            xp: 76
        },
        {
            level: 17,
            xp: 84
        },
        {
            level: 18,
            xp: 93
        },
        {
            level: 19,
            xp: 103
        },
        {
            level: 20,
            xp: 114
        },
        {
            level: 21,
            xp: 126
        },
        {
            level: 22,
            xp: 139
        },
        {
            level: 23,
            xp: 154
        },
        {
            level: 24,
            xp: 170
        },
        {
            level: 25,
            xp: 188
        },
        {
            level: 26,
            xp: 208
        },
        {
            level: 27,
            xp: 230
        },
        {
            level: 28,
            xp: 254
        },
        {
            level: 29,
            xp: 281
        },
        {
            level: 30,
            xp: 311
        },
        {
            level: 31,
            xp: 344
        },
        {
            level: 32,
            xp: 380
        },
        {
            level: 33,
            xp: 420
        },
        {
            level: 34,
            xp: 464
        },
        {
            level: 35,
            xp: 513
        },
        {
            level: 36,
            xp: 567
        },
        {
            level: 37,
            xp: 627
        },
        {
            level: 38,
            xp: 693
        },
        {
            level: 39,
            xp: 766
        },
        {
            level: 40,
            xp: 846
        },
        {
            level: 41,
            xp: 936
        },
        {
            level: 42,
            xp: 1035
        },
        {
            level: 43,
            xp: 1145
        },
        {
            level: 44,
            xp: 1265
        },
        {
            level: 45,
            xp: 1398
        },
        {
            level: 46,
            xp: 1545
        },
        {
            level: 47,
            xp: 1707
        },
        {
            level: 48,
            xp: 1887
        },
        {
            level: 49,
            xp: 2085
        },
        {
            level: 50,
            xp: 2304
        },
        {
            level: 51,
            xp: 2547
        },
        {
            level: 52,
            xp: 2817
        },
        {
            level: 53,
            xp: 3117
        },
        {
            level: 54,
            xp: 3450
        },
        {
            level: 55,
            xp: 3819
        },
        {
            level: 56,
            xp: 4227
        },
        {
            level: 57,
            xp: 4679
        },
        {
            level: 58,
            xp: 5179
        },
        {
            level: 59,
            xp: 5729
        },
        {
            level: 60,
            xp: 6336
        },
        {
            level: 61,
            xp: 7004
        },
        {
            level: 62,
            xp: 7739
        },
        {
            level: 63,
            xp: 8548
        },
        {
            level: 64,
            xp: 9439
        },
        {
            level: 65,
            xp: 10419
        },
        {
            level: 66,
            xp: 11501
        },
        {
            level: 67,
            xp: 12694
        },
        {
            level: 68,
            xp: 13997
        },
        {
            level: 69,
            xp: 15423
        },
        {
            level: 70,
            xp: 16983
        },
        {
            level: 71,
            xp: 18690
        },
        {
            level: 72,
            xp: 20556
        },
        {
            level: 73,
            xp: 22595
        },
        {
            level: 74,
            xp: 24818
        },
        {
            level: 75,
            xp: 27246
        },
        {
            level: 76,
            xp: 29895
        },
        {
            level: 77,
            xp: 32786
        },
        {
            level: 78,
            xp: 35943
        },
        {
            level: 79,
            xp: 39391
        },
        {
            level: 80,
            xp: 43155
        },
        {
            level: 81,
            xp: 47263
        },
        {
            level: 82,
            xp: 51746
        },
        {
            level: 83,
            xp: 56633
        },
        {
            level: 84,
            xp: 61961
        },
        {
            level: 85,
            xp: 67771
        },
        {
            level: 86,
            xp: 74109
        },
        {
            level: 87,
            xp: 81028
        },
        {
            level: 88,
            xp: 88580
        },
        {
            level: 89,
            xp: 96742
        },
        {
            level: 90,
            xp: 105779
        },
        {
            level: 91,
            xp: 115601
        },
        {
            level: 92,
            xp: 126302
        },
        {
            level: 93,
            xp: 137997
        },
        {
            level: 94,
            xp: 150801
        },
        {
            level: 95,
            xp: 164847
        },
        {
            level: 96,
            xp: 180259
        },
        {
            level: 97,
            xp: 197168
        },
        {
            level: 98,
            xp: 215716
        },
        {
            level: 99,
            xp: 236055
        },
        {
            level: 100,
            xp: 258352
        },
        {
            level: 101,
            xp: 282788
        },
        {
            level: 102,
            xp: 309557
        },
        {
            level: 103,
            xp: 338865
        },
        {
            level: 104,
            xp: 370936
        },
        {
            level: 105,
            xp: 406010
        },
        {
            level: 106,
            xp: 444343
        },
        {
            level: 107,
            xp: 486222
        },
        {
            level: 108,
            xp: 531961
        },
        {
            level: 109,
            xp: 581909
        },
        {
            level: 110,
            xp: 636438
        },
        {
            level: 111,
            xp: 695953
        },
        {
            level: 112,
            xp: 760888
        },
        {
            level: 113,
            xp: 831733
        },
        {
            level: 114,
            xp: 909047
        },
        {
            level: 115,
            xp: 993441
        },
        {
            level: 116,
            xp: 1085141
        },
        {
            level: 117,
            xp: 1185177
        },
        {
            level: 118,
            xp: 1292882
        },
        {
            level: 119,
            xp: 1408880
        },
        {
            level: 120,
            xp: 1533871
        }
    ];
    return xpTable.find(tier => tier.level == lvl + 1);
}







// Difficulty tracking and syncing
function getLocalDifficulty() {
    // Sync to all players' scoreboards
    system.run(() => {
        const players = world.getPlayers();
        let maxDificulty = 0;
        for (const player of players) {
            const loc = player.location;
            const dimension = player.dimension.id;
            const distance = Math.floor(Math.sqrt((loc.x * loc.x) + (loc.z * loc.z)));
            const DIM_MULT = { overworld: 1, nether: 2, end: 4 };
            const multiplier = DIM_MULT[dimension] ?? 1;
            
            const baseDifficulty = Math.floor(distance / MOB_DIFFICULTY_SPEED);
            const diff = Math.min(25, baseDifficulty * multiplier);
            if (diff > maxDificulty) maxDificulty = diff;
        }
        LOCAL_DIFFICULTY_RRS = maxDificulty;
    });
}

// Set up difficulty update interval (every minute)
system.runInterval(() => { getLocalDifficulty() }, 1200);

// Utility Functions
function getMobLevelData(level) {
    return MOB_LEVELS.find(moblvl => moblvl.level === level);
}

function canHaveEquipment(entityTypeId) {
    return POSSIBLE_TO_EQUIPMENT_ENTITY.includes(entityTypeId);
}

function getSlotName(slot) {
    return SLOT_MAPPINGS[slot] || slot;
}

function selectEquipmentByPower(availableItems, targetPower) {
    if (!availableItems || availableItems.length === 0) return null;
    
    // Find items that fit within power budget (allowing slight overflow)
    const suitableItems = availableItems.filter(item => {
        const itemPower = EQUIPMENT_POWER[item] || 0;
        return itemPower <= targetPower * 1.2; // Allow 20% overflow
    });
    
    if (suitableItems.length === 0) return null;
    
    // Select best item within power range
    let bestItem = suitableItems[0];
    let bestPowerDiff = Math.abs((EQUIPMENT_POWER[bestItem] || 0) - targetPower);
    
    suitableItems.forEach(item => {
        const itemPower = EQUIPMENT_POWER[item] || 0;
        const powerDiff = Math.abs(itemPower - targetPower);
        if (powerDiff < bestPowerDiff) {
            bestItem = item;
            bestPowerDiff = powerDiff;
        }
    });
    
    return bestItem;
}

function calculateEffectLevel(effectName, availablePower) {
    const effectData = EFFECTS[effectName];
    if (!effectData) return 0;
    
    const maxPossibleLevel = Math.floor(availablePower / effectData.powerPerLevel);
    return Math.min(maxPossibleLevel, effectData.maxLevel);
}

// Equipment System
function generateEquipmentSet(mobLevelData, totalPowerLevel) {
    const equipmentSlots = ['head', 'chest', 'legs', 'feet', 'mainhand', 'offhand'];
    const equipmentSet = {};
    let usedPower = 0;
    
    // Randomly distribute power across slots
    const slotPowers = {};
    equipmentSlots.forEach(slot => {
        if (mobLevelData[slot] && mobLevelData[slot].length > 0) {
            slotPowers[slot] = rnb(1, Math.floor(totalPowerLevel / equipmentSlots.length * 1.5));
        }
    });
    
    // Select equipment for each slot
    equipmentSlots.forEach(slot => {
        if (slotPowers[slot] && mobLevelData[slot]) {
            const selectedItem = selectEquipmentByPower(mobLevelData[slot], slotPowers[slot]);
            if (selectedItem) {
                equipmentSet[slot] = selectedItem;
                usedPower += EQUIPMENT_POWER[selectedItem] || 0;
            }
        }
    });
    
    return { equipment: equipmentSet, usedPower };
}

function equipEntity(entity, equipmentSet) {
    Object.entries(equipmentSet).forEach(([slot, item]) => {
        const slotName = getSlotName(slot);
        system.run(() => {
            try {
                entity.runCommand(`replaceitem entity @s ${slotName} 0 ${item}`);
            } catch (e) {
                console.warn(`Failed to equip ${item} in ${slot}: ${e}`);
            }
        });
    });
}

// Effects System
function generateEffectsSet(mobLevelData, availablePowerLevel, canEquip) {
    const effectsSet = [];
    let remainingPower = availablePowerLevel;
    
    if (!canEquip) {
        // Use ALL power for effects if can't equip items
        remainingPower = availablePowerLevel;
    }
    
    // Randomly distribute power among available effects
    const availableEffects = mobLevelData.effects || [];
    if (availableEffects.length === 0) return effectsSet;
    
    availableEffects.forEach(effectName => {
        if (remainingPower <= 0) return;
        
        // Allocate random portion of remaining power to this effect
        const powerForEffect = rnb(1, Math.floor(remainingPower / 2) + 1);
        const effectLevel = calculateEffectLevel(effectName, powerForEffect);
        
        if (effectLevel > 0) {
            effectsSet.push({
                name: effectName,
                level: effectLevel,
                powerUsed: effectLevel * (EFFECTS[effectName]?.powerPerLevel || 1)
            });
            remainingPower -= effectLevel * (EFFECTS[effectName]?.powerPerLevel || 1);
        }
    });
    
    return effectsSet;
}

function applyEffects(entity, effectsSet) {
    effectsSet.forEach(effect => {
        system.run(() => {
            try {
                entity.runCommand(`effect @s ${effect.name} infinite ${effect.level} true`);
            } catch (e) {
                console.warn(`Failed to apply effect ${effect.name}: ${e}`);
            }
        });
        
        // Special handling for health boost
        if (effect.name === 'health_boost') {
            handleHealthBoostStorage(entity, effect.level);
        }
    });
}

// Tagging System
function applyDivineTags(entity, level) {
    system.run(() => {
        try {
            entity.addTag('divine_entity');
            entity.addTag(DIVINE_LEVEL_TAG_ENTITY_MARKER + level.toString());
            entity.nameTag = (entity.nameTag && entity.nameTag != entity.typeId.split(":")[1].split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "))? entity.nameTag + " §blvl§l " + level.toString() : "§blvl§l " + level.toString();
        } catch (e) {
            console.warn(`Failed to apply divine tags: ${e}`);
        }
    });
}

function applyStrongTags(entity, level) {
    system.run(() => {
        try {
            entity.addTag(`entity_lvl_${level.toString()}`);
            entity.nameTag = (entity.nameTag && entity.nameTag != entity.typeId.split(":")[1].split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "))? entity.nameTag + " §2lvl " + level.toString() : "§2lvl " + level.toString();
        } catch (e) {
            console.warn(`Failed to apply strong tags: ${e}`);
        }
    });
}

function handleHealthBoostStorage(entity, healthBoostLevel) {
    system.run(() => {
        try {
            const health = entity.getComponent("minecraft:health");
            health.setCurrentValue(health.effectiveMax);
            // Health boost gives 4 extra health points per level
            const baseHealth = health.defaultValue;
            const boostHealth = healthBoostLevel * 4;
            const totalHealth = baseHealth + boostHealth;
            
            // Store in scoreboard
            entity.addTag("recordhealth");
            entity.runCommand(`scoreboard players set @s rrsstoredentityhealth ${totalHealth}`);
        } catch (e) {
            console.warn(`Failed to handle health boost storage: ${e}`);
        }
    });
}

// Main Processing Functions
function processDivineEntity(entity, level, powerLevel) {
    const mobLevelData = getMobLevelData(level);
    if (!mobLevelData) return;
    
    const canEquip = canHaveEquipment(entity.typeId);
    let availablePowerForEffects = powerLevel;
    
    // Handle equipment if possible
    if (canEquip) {
        const { equipment, usedPower } = generateEquipmentSet(mobLevelData, powerLevel);
        equipEntity(entity, equipment);
        availablePowerForEffects = powerLevel - usedPower;
    }
    
    // Generate and apply effects
    const effectsSet = generateEffectsSet(mobLevelData, availablePowerForEffects, canEquip);
    applyEffects(entity, effectsSet);
    
    // Apply divine tags
    applyDivineTags(entity, level);
}

function processStrongEntity(entity, level, powerLevel) {
    const mobLevelData = getMobLevelData(level);
    if (!mobLevelData) return;
    
    const canEquip = canHaveEquipment(entity.typeId);
    let availablePowerForEffects = powerLevel;
    
    // Handle equipment if possible
    if (canEquip) {
        const { equipment, usedPower } = generateEquipmentSet(mobLevelData, powerLevel);
        equipEntity(entity, equipment);
        availablePowerForEffects = powerLevel - usedPower;
    }
    
    // Generate and apply effects
    const effectsSet = generateEffectsSet(mobLevelData, availablePowerForEffects, canEquip);
    applyEffects(entity, effectsSet);
    
    // Apply strong tags
    applyStrongTags(entity, level);
}

// Event Handler
function onEntitySpawn(event) {
    if (LOCAL_DIFFICULTY_RRS == 0) LOCAL_DIFFICULTY_RRS = 1;
    const entity = event.entity;
    
    // Check if entity type is eligible for enhancement
    const canBeDivine = POSSIBLE_TO_DIVINE_ENTITY.includes(entity.typeId);
    let canBeStrong = POSSIBLE_TO_STRONG_ENTITY.includes(entity.typeId);
    
    if (!canBeStrong) canBeStrong = entity.getComponent("minecraft:type_family").hasTypeFamily("monster");
    
    if (!canBeStrong) return;
    // Get mob level data based on current difficulty
    const mobLevelData = getMobLevelData(LOCAL_DIFFICULTY_RRS);
    if (!mobLevelData) return;
    
    // Generate random power level within range
    const powerLevel = rnb(mobLevelData.minPowerLevel, mobLevelData.maxPowerLevel);
    
    // Roll for divine entity first
    if (canBeDivine && Math.random() < DIVINE_ENTITY_SPAWN_CHANCE) {
        processDivineEntity(entity, LOCAL_DIFFICULTY_RRS, powerLevel);
        return;
    }
    
    // If divine failed, roll for strong entity
    if (canBeStrong && Math.random() < STRONG_ENTITY_SPAWN_CHANCE) {
        processStrongEntity(entity, LOCAL_DIFFICULTY_RRS, powerLevel);
    }
}

// Register event listener
world.afterEvents.entitySpawn.subscribe(onEntitySpawn);

// Initialize difficulty on startup
getLocalDifficulty();

// Entity load event - heals entities with "recordhealth" tag to stored health value
world.afterEvents.entityLoad.subscribe((ev) => {
    const entity = ev.entity;
    
    if (entity.hasTag("recordhealth")) {
        try {
            const storedHealth = getScoreboardValue("rrsstoredentityhealth", entity);
            
            if (storedHealth !== null && storedHealth > 0) {
                const healthComponent = entity.getComponent("minecraft:health");
                
                if (healthComponent) {
                    // Set health to stored value, capped by max health
                    const targetHealth = Math.min(storedHealth, healthComponent.effectiveMax);
                    healthComponent.setCurrentValue(targetHealth);
                    
                    console.log(`Restored health for entity ${entity.typeId}: ${targetHealth}/${healthComponent.effectiveMax}`);
                } else {
                    console.warn(`Entity ${entity.typeId} has recordhealth tag but no health component`);
                }
            }
        } catch (error) {
            console.error("Error restoring entity health:", error);
        }
    }
});

// Health recording system - runs every 10 seconds
system.runInterval(() => {
    try {
        const players = world.getPlayers();
        
        for (const player of players) {
            const dimension = player.dimension;
            const entities = dimension.getEntities({
                location: player.location,
                maxDistance: 64
            });
            
            for (const entity of entities) {
                if (entity.hasTag("recordhealth")) {
                    try {
                        const healthComponent = entity.getComponent("minecraft:health");
                        
                        if (healthComponent) {
                            const currentHealth = healthComponent.currentValue;
                            
                            // Update scoreboard with current health value
                            const scoreboard = world.scoreboard.getObjective("rrsstoredentityhealth");
                            if (scoreboard) {
                                scoreboard.setScore(entity, Math.floor(currentHealth));
                            } else {
                                console.warn("Scoreboard 'rrsstoredentityhealth' not found");
                            }
                        }
                    } catch (error) {
                        console.error(`Error recording health for entity ${entity.typeId}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in health recording system:", error);
    }
}, 200); // 200 ticks = 10 seconds

// Force divine mob name display
function setDivineName(entity, level) {
    try {
        entity.nameTag = `§d✦ Divine ${entity.typeId.replace("minecraft:", "")} §7[Lv.${level}]`;
    } catch {}
}
