/**
 * Create animations for npcs
 * 
 * @param anims 
 */
const createNPCAnims = (anims: Phaser.Animations.AnimationManager) => {

    anims.create({
        key: "oldman-standing", 
        frames: [{ key: "npcs", frame: "oldman/standing/man.png" }],
        showOnStart: true
    });

    anims.create({
        key: "agahnim-standing", 
        frames: [{ key: "npcs", frame: "agahnim/standing/idle-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "agahnim-precast", 
        frames: [{ key: "npcs", frame: "agahnim/precast/precast-1.png" }],
        showOnStart: true
    });

    anims.create({ key: "agahnim-casting", frames: anims.generateFrameNames('npcs', {start: 1, end: 2, prefix: "agahnim/casting/casting-", suffix: ".png"}), frameRate: 30, repeat: -1});


    anims.create({
        key: "balu-standing", 
        frames: [{ key: "npcs", frame: "balu/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "jane-standing", 
        frames: [{ key: "npcs", frame: "jane/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "kenzie-standing", 
        frames: [{ key: "npcs", frame: "kenzie/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "becky-standing", 
        frames: [{ key: "npcs", frame: "becky/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "earl-standing", 
        frames: [{ key: "npcs", frame: "earl/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "timmy-standing", 
        frames: [{ key: "npcs", frame: "timmy/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "sammy-standing", 
        frames: [{ key: "npcs", frame: "sammy/standing/npc-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: `mary-standing`, 
        frames: anims.generateFrameNames('npcs', {start: 1, end: 2, prefix: 'mary/standing/npc-', suffix: '.png'}),
        frameRate: 2,
        repeat: -1
    });

    anims.create({
        key: `sally-standing`, 
        frames: anims.generateFrameNames('npcs', {start: 1, end: 2, prefix: 'sally/standing/npc-', suffix: '.png'}),
        frameRate: 2,
        repeat: -1
    });

    anims.create({
        key: `bobby-standing`, 
        frames: anims.generateFrameNames('npcs', {start: 1, end: 4, prefix: 'bobby/standing/npc-', suffix: '.png'}),
        frameRate: 8,
        repeat: -1
    });
}

export {
    createNPCAnims
} 