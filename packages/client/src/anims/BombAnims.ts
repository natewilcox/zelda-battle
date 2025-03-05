/**
 * Create animations for different bombs
 * 
 * @param anims 
 */
 const createBombsAnims = (anims: Phaser.Animations.AnimationManager) => {


    anims.create({
        key: `bomb-ticking`, 
        frames: anims.generateFrameNames('bombs', {start: 1, end: 2, prefix: 'Basic/Ticking/bomb-', suffix: '.png'}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: `bomb-explode`, 
        frames: anims.generateFrameNames('bombs', {start: 1, end: 2, prefix: 'Basic/Explode/explode-', suffix: '.png'}),
        frameRate: 20,
        hideOnComplete: true
    });
}

export {
    createBombsAnims
}