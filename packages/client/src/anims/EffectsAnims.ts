/**
 * Create all effects animations
 * 
 * @param anims 
 */
export const createEffectsAnims = (anims: Phaser.Animations.AnimationManager) => {

    anims.create({ 
        key: "grass-wiggling", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 2, prefix: "Grass/Grass-Wiggling/grass-", suffix: ".png"}), 
        frameRate: 15, 
        repeat: 5,
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "leafs-falling", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 8, prefix: "Grass/Leafs-Falling/leaf-", suffix: ".png"}), 
        frameRate: 15, 
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "brownleafs-falling", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 8, prefix: "Grass/BrownLeafs-Falling/leaf-", suffix: ".png"}), 
        frameRate: 15, 
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "grass-moving", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 3, prefix: "Grass/Moving-Through-Grass/Grass-", suffix: ".png"}), 
        showOnStart: true,
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: "grass-standing", 
        frames: [{ key: "effects", frame: "Grass/Standing-In-Grass/Grass-1.png" }],
        showOnStart: true
    });

    anims.create({ 
        key: "splash", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 4, prefix: "Water/Splash/splash-", suffix: ".png"}), 
        frameRate: 15, 
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "poof", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 3, prefix: "Misc/Poof/poof_", suffix: ".png"}), 
        frameRate: 15, 
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "rock-breaking", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 8, prefix: "Rock/Break/break-", suffix: ".png"}), 
        frameRate: 25, 
        showOnStart: true, 
        hideOnComplete: true
    });

    anims.create({ 
        key: "wake", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 3, prefix: "Water/Wakes/wake-", suffix: ".png"}), 
        showOnStart: true, 
        frameRate: 5,
        repeat: -1 
    });

    anims.create({ 
        key: "ora", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 2, prefix: "Misc/Teleport/teleport-", suffix: ".png"}), 
        frameRate: 20,
        repeat: -1
    });

    anims.create({ 
        key: "explosion", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 8, prefix: "Misc/Explosion/explode-", suffix: ".png"}), 
        frameRate: 25,
        hideOnComplete: true
    });

    anims.create({ 
        key: "ice-explosion", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 6, prefix: "Misc/Ice Explosion/explode-", suffix: ".png"}), 
        frameRate: 25,
        hideOnComplete: true
    });
    
    anims.create({ 
        key: "fire-explosion", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 6, prefix: "Misc/Fire Explosion/explode-", suffix: ".png"}), 
        frameRate: 25,
        hideOnComplete: true
    });

    anims.create({ 
        key: "magic-spark", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 2, prefix: "Misc/Magic Spark/spark-", suffix: ".png"}), 
        frameRate: 10,
        repeat: -1
    });

    anims.create({ 
        key: "magic-spawn-intro", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 1, prefix: "Misc/Magic Spawn/intro/spawn-", suffix: ".png"}), 
    });

    anims.create({ 
        key: "magic-spawn-mid", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 2, prefix: "Misc/Magic Spawn/mid/spawn-", suffix: ".png"}),
        frameRate: 10,
        repeat: -1 
    });

    anims.create({ 
        key: "magic-spawn-end", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 1, prefix: "Misc/Magic Spawn/end/spawn-", suffix: ".png"}), 
        frameRate: 10,
    });

    anims.create({ 
        key: "blue-effect", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 6, prefix: "Misc/Magic Effect/Blue Effect/effect-", suffix: ".png"}), 
        frameRate: 15,
    });

    anims.create({ 
        key: "green-effect", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 6, prefix: "Misc/Magic Effect/Green Effect/effect-", suffix: ".png"}), 
        frameRate: 15,
    });

    anims.create({ 
        key: "red-effect", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 6, prefix: "Misc/Magic Effect/Red Effect/effect-", suffix: ".png"}), 
        frameRate: 15,
    });

    anims.create({ 
        key: "death-poof", 
        frames: anims.generateFrameNames('effects', {start: 1, end: 7, prefix: "Misc/Death/death_", suffix: ".png"}), 
        frameRate: 15,
    });
};