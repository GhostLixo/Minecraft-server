

// Force divine mob name display
function setDivineName(entity, level) {
    try {
        entity.nameTag = `§d✦ Divine ${entity.typeId.replace("minecraft:", "")} §7[Lv.${level}]`;
    } catch {}
}
