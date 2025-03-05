/**
 * Create animations for different bullets
 * 
 * @param anims 
 */
 const createBulletAnims = (anims: Phaser.Animations.AnimationManager) => {

    //arrow animations
    anims.create({ 
        key: "arrow-flight", 
        frames: [{ key: "bullets", frame: "Arrow/Flight/arrow-1.png" }], 
        showOnStart: true, 
    });

    anims.create({
        key: `arrow-contact`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 4, prefix: 'Arrow/Contact/arrow-', suffix: '.png'}),
        frameRate: 25,
        repeat: 2
    });

    //magicarrow animations
    anims.create({ 
        key: "magicarrow-flight", 
        frames: [{ key: "bullets", frame: "MagicArrow/Flight/arrow-1.png" }], 
        showOnStart: true, 
    });

    anims.create({
        key: `magicarrow-contact`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 4, prefix: 'MagicArrow/Contact/arrow-', suffix: '.png'}),
        frameRate: 25,
        repeat: 2
    });

    //lightening bolt
    anims.create({ 
        key: "lighteningbolt-flight", 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 5, prefix: 'Lightening Bolt/Flight/bolt-', suffix: '.png'}),
        frameRate: 30,
        hideOnComplete: true
    });

    //fireball
    anims.create({ 
        key: "fireball-flight", 
        frames: [{ key: "bullets", frame: "Fireball/Flight/fire-1.png" }], 
        showOnStart: true, 
    });

    anims.create({
        key: `fireball-contact`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 4, prefix: 'Fireball/Contact/fire-', suffix: '.png'}),
        frameRate: 25,
        hideOnComplete: true
    });

    //light ball
    anims.create({
        key: `large-lightball-flight`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 2, prefix: 'MagicBall/Large/ball-', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `medium-lightball-flight`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 2, prefix: 'MagicBall/Medium/ball-', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `small-lightball-flight`, 
        frames: anims.generateFrameNames('bullets', {start: 1, end: 2, prefix: 'MagicBall/Small/ball-', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });



}

export {
    createBulletAnims
}