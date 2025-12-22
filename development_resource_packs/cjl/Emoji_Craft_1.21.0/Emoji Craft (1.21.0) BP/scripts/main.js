import * as MC from '@minecraft/server';

const MDS = '§';
const Lang = {
    'emojis': {
        'list': function (custom = false) {
            let displayList = [];
            Object.keys(Lang.emojis).forEach(key => {
                if (key === 'list') { return; };
                if (custom === false && key.startsWith('c-') === true) { return; };
                if (custom === true && key.startsWith('c-') === false) { return; };
                displayList.push([`${MDS}r${Lang.emojis[key]} ${MDS}7- :@${key}:`]);
            });
            return `${MDS}fEmoji list:\n${displayList.join('\n')}\n§bWorks on signs! §fTo translate a sign hit it.`;

        },
        'heart': '',
        'armor': '',
        'food': '',
        'minecoin': '',
        'token': '',
        'pickaxe': '',
        'sword': '',
        'craft': '',
        'furnace': '',
        'agent': '',
        'craftToggleOn': '',
        'craftToggleOff': '',
        'jump': '',
        'sneak': '',
        'flyUp': '',
        'flyDown': '',
        'dismount': '',
        'sprint': '',
        'place': '',
        'attack': '',
        'joystick': '',
        'star': '',
        'hollowStar': '',
        'circle': '',
        'hollowCircle': '',
        'arrowCurveUp': '',
        'arrowCurveDown': '',
        'arrowLeft': '',
        'arrowRight': '',
        'arrowUp': '',
        'arrowDown': '',
        'mouse': '',
        'leftClick': '',
        'rightClick': '',
        'middleClick': '',
        'smallCircle': '',
        'smallHollowCircle': '',
        'smallArrowCurveUp': '',
        'smallArrowCurveDown': '',
        'smallArrowLeft': '',
        'smallArrowRight': '',
        'smallArrowUp': '',
        'smallArrowDown': '',
        'dots': '',
        'smallMouse': '',
        'smallLeftClick': '',
        'smallRightClick': '',
        'smallMiddleClick': '',
        'xboxA': '',
        'xboxB': '',
        'xboxX': '',
        'xboxY': '',
        'xboxLb': '',
        'xboxRb': '',
        'xboxLt': '',
        'xboxRt': '',
        'xboxShare': '',
        'xboxOptions': '',
        'xboxLs': '',
        'xboxRs': '',
        'xboxDpadUp': '',
        'xboxDpadLeft': '',
        'xboxDpadDown': '',
        'xboxDpadRight': '',
        'psCross': '',
        'psCircle': '',
        'psSquare': '',
        'psTriangle': '',
        'psL1': '',
        'psR1': '',
        'psL2': '',
        'psR2': '',
        'psTouchPad': '',
        'psOptions': '',
        'psL3': '',
        'psR3': '',
        'psDpadUp': '',
        'psDpadLeft': '',
        'psDpadDown': '',
        'psDpadRight': ''
    },
    'translateEmojis': function (string) {
        Object.keys(Lang.emojis).forEach(key => {
            if (key === 'list') { return; };
            string = string.replaceAll(`:@${key}:`, `${Lang.emojis[key]}`);
        });
        return string;
    },
};

//generate custom emojis
for (let i = 14; i < 257; i++) {
    Lang.emojis[`c-${i}`] = String.fromCharCode(parseInt(`0xE1${Number(i).toString(16)}`));
};


MC.world.beforeEvents.chatSend.subscribe(event => {
    event.cancel = true;
    let content = event.message;
    //Commands
    if (content === '#emojis') {
        event.sender.sendMessage(Lang.emojis.list(false));
        return;
    }
    else if (content === '#custom emojis') {
        event.sender.sendMessage(Lang.emojis.list(true));
        return;
    };
    //Emoji Translation
    content = Lang.translateEmojis(content);
    MC.system.run(() => {
        MC.world.sendMessage(`<${event.sender.name}> ${content}`);
    });
});


MC.world.afterEvents.entityHitBlock.subscribe(event => {
    MC.system.run(() => {
        let signComponent = event.hitBlock.getComponent(MC.BlockComponentTypes.Sign);
        if (signComponent !== undefined) {
            let signTextFront = signComponent.getText(MC.SignSide.Front);
            let signTextBack = signComponent.getText(MC.SignSide.Back);
            if (signTextFront !== undefined) { signComponent.setText(Lang.translateEmojis(signTextFront), MC.SignSide.Front); };
            if (signTextBack !== undefined) { signComponent.setText(Lang.translateEmojis(signTextBack), MC.SignSide.Back); };
        };
    });
});