
const createItemAnims = (anims: Phaser.Animations.AnimationManager) => {

    //rupees
    anims.create({ key: "green-rupee-idle", frames: anims.generateFrameNames('items', {start: 1, end: 3, prefix: "GreenRupee/idle/green-", suffix: ".png"}), frameRate: 5, repeat: -1 });
    anims.create({ key: "green-rupee-item", frames: [{ key: "items", frame: "GreenRupee/item/green-1.png" }], showOnStart: true });

    anims.create({ key: "blue-rupee-idle", frames: anims.generateFrameNames('items', {start: 1, end: 3, prefix: "BlueRupee/idle/blue-", suffix: ".png"}), frameRate: 5, repeat: -1 });
    anims.create({ key: "blue-rupee-item", frames: [{ key: "items", frame: "BlueRupee/item/blue-1.png" }], showOnStart: true });

    anims.create({ key: "red-rupee-idle", frames: anims.generateFrameNames('items', {start: 1, end: 3, prefix: "RedRupee/idle/red-", suffix: ".png"}), frameRate: 5, repeat: -1 });
    anims.create({ key: "red-rupee-item", frames: [{ key: "items", frame: "RedRupee/item/red-1.png" }], showOnStart: true });
    
    anims.create({ key: "fifty-rupees-item", frames: [{ key: "items", frame: "FiftyRupees/item/rupees.png" }], showOnStart: true });
    anims.create({ key: "fifty-rupees-idle", frames: [{ key: "items", frame: "FiftyRupees/Idle/rupees.png" }], showOnStart: true });

    //bombs
    anims.create({ key: "ten-bombs-item", frames: [{ key: "items", frame: "TenBombs/Items/bombs.png" }], showOnStart: true });
    anims.create({ key: "ten-bombs-idle", frames: [{ key: "items", frame: "TenBombs/Idle/bombs.png" }], showOnStart: true });

    anims.create({ key: "eight-bombs-item", frames: [{ key: "items", frame: "EightBombs/Item/bombs.png" }], showOnStart: true });
    anims.create({ key: "eight-bombs-idle", frames: [{ key: "items", frame: "EightBombs/Idle/bombs.png" }], showOnStart: true });

    anims.create({ key: "four-bombs-item", frames: [{ key: "items", frame: "FourBombs/Item/bombs.png" }], showOnStart: true });
    anims.create({ key: "four-bombs-idle", frames: [{ key: "items", frame: "FourBombs/Idle/bombs.png" }], showOnStart: true });

    anims.create({ key: "one-bomb-item", frames: [{ key: "items", frame: "OneBomb/Item/bomb.png" }], showOnStart: true });
    anims.create({ key: "one-bomb-idle", frames: [{ key: "items", frame: "OneBomb/Idle/bomb.png" }], showOnStart: true });

    //arrows
    anims.create({ key: "one-arrow-item", frames: [{ key: "items", frame: "OneArrow/Item/arrow.png" }], showOnStart: true });
    anims.create({ key: "one-arrow-idle", frames: [{ key: "items", frame: "OneArrow/Idle/arrow.png" }], showOnStart: true });

    anims.create({ key: "five-arrows-item", frames: [{ key: "items", frame: "FiveArrows/Item/arrows.png" }], showOnStart: true });
    anims.create({ key: "five-arrows-idle", frames: [{ key: "items", frame: "FiveArrows/Idle/arrows.png" }], showOnStart: true });

    anims.create({ key: "ten-arrows-item", frames: [{ key: "items", frame: "TenArrows/Item/arrows.png" }], showOnStart: true });
    anims.create({ key: "ten-arrows-idle", frames: [{ key: "items", frame: "TenArrows/Idle/arrows.png" }], showOnStart: true });

    //hearts
    anims.create({ key: "full-heart-item", frames: [{ key: "items", frame: "FullHeart/Item/full-heart.png" }], showOnStart: true });
    anims.create({ key: "full-heart-idle", frames: [{ key: "items", frame: "FullHeart/Idle/full-heart.png" }], showOnStart: true });

    anims.create({ key: "small-heart-item", frames: [{ key: "items", frame: "SmallHeart/Item/small-heart.png" }], showOnStart: true });
    anims.create({ key: "small-heart-idle", frames: [{ key: "items", frame: "SmallHeart/Idle/heart.png" }], showOnStart: true });

    //magic
    anims.create({ key: "magic-jar-item", frames: [{ key: "items", frame: "MagicJar/Item/magic-jar.png" }], showOnStart: true });
    anims.create({ key: "magic-jar-idle", frames: [{ key: "items", frame: "MagicJar/Idle/magic-jar.png" }], showOnStart: true });

    anims.create({ key: "magic-bottle-item", frames: [{ key: "items", frame: "MagicBottle/Item/magic-bottle.png" }], showOnStart: true });
    anims.create({ key: "magic-bottle-idle", frames: [{ key: "items", frame: "MagicBottle/Idle/magic-bottle.png" }], showOnStart: true });

    //keys
    anims.create({ key: "small-key-item", frames: [{ key: "items", frame: "SmallKey/Item/key.png" }], showOnStart: true });
    anims.create({ key: "small-key-idle", frames: [{ key: "items", frame: "SmallKey/Idle/key.png" }], showOnStart: true });
}

export {
    createItemAnims
} 