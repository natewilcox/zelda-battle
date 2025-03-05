/**
 * Create animations for enemies
 * 
 * @param anims 
 */
const createEnemyAnims = (anims: Phaser.Animations.AnimationManager) => {

    //rat
    anims.create({ key: "rat-standing-east", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/stand-right/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "rat-standing-west", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/stand-left/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "rat-walking-west", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/walk-left/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "rat-walking-east", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/walk-right/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "rat-walking-north", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/walk-up/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "rat-walking-south", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "rat/walk-down/rat-", suffix: ".png"}), frameRate: 10, repeat: -1});
    
    //snake
    anims.create({ key: "snake-standing-west", frames: [{ key: "enemies", frame: "snake/stand-left/snake-1.png" }], showOnStart: true });
    anims.create({ key: "snake-standing-east", frames: [{ key: "enemies", frame: "snake/stand-right/snake-1.png" }], showOnStart: true });
    anims.create({ key: "snake-standing-north", frames: [{ key: "enemies", frame: "snake/stand-up/snake-1.png" }], showOnStart: true });
    anims.create({ key: "snake-standing-south", frames: [{ key: "enemies", frame: "snake/stand-down/snake-1.png" }], showOnStart: true });
    anims.create({ key: "snake-walking-west", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "snake/walk-left/snake-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "snake-walking-east", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "snake/walk-right/snake-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "snake-walking-north", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "snake/walk-up/snake-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "snake-walking-south", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "snake/walk-down/snake-", suffix: ".png"}), frameRate: 10, repeat: -1});

    //skeleton
    anims.create({ key: "skeleton-standing-west", frames: [{ key: "enemies", frame: "skeleton/stand-left/skeleton-1.png" }], showOnStart: true });
    anims.create({ key: "skeleton-standing-east", frames: [{ key: "enemies", frame: "skeleton/stand-right/skeleton-1.png" }], showOnStart: true });
    anims.create({ key: "skeleton-standing-north", frames: [{ key: "enemies", frame: "skeleton/stand-up/skeleton-1.png" }], showOnStart: true });
    anims.create({ key: "skeleton-standing-south", frames: [{ key: "enemies", frame: "skeleton/stand-down/skeleton-1.png" }], showOnStart: true });
    anims.create({ key: "skeleton-walking-west", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "skeleton/walk-left/skeleton-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "skeleton-walking-east", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "skeleton/walk-right/skeleton-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "skeleton-walking-north", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "skeleton/walk-up/skeleton-", suffix: ".png"}), frameRate: 10, repeat: -1});
    anims.create({ key: "skeleton-walking-south", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "skeleton/walk-down/skeleton-", suffix: ".png"}), frameRate: 10, repeat: -1});

    //bat
    anims.create({ key: "bat-standing", frames: [{ key: "enemies", frame: "bat/sitting/bat-1.png" }], showOnStart: true });
    anims.create({ key: "bat-flying", frames: anims.generateFrameNames('enemies', {start: 1, end: 2, prefix: "bat/flying/bat-", suffix: ".png"}), frameRate: 15, repeat: -1});
}

export {
    createEnemyAnims
} 