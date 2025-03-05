/**
 * Create animations for different weapons
 * 
 * @param anims 
 */
const createWeaponAnims = (anims: Phaser.Animations.AnimationManager) => {

    //Bow animations
    anims.create({ key: "bow-attack-north", frames: [{ key: "weapons", frame: "Bow/Up/bow-1.png" }, { key: "weapons", frame: "Bow/Up/bow-2.png" }, { key: "weapons", frame: "Bow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow-attack-south", frames: [{ key: "weapons", frame: "Bow/Down/bow-1.png" }, { key: "weapons", frame: "Bow/Down/bow-2.png" }, { key: "weapons", frame: "Bow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "bow-attack-east", frames: [{ key: "weapons", frame: "Bow/Right/bow-1.png" }, { key: "weapons", frame: "Bow/Right/bow-2.png" }, { key: "weapons", frame: "Bow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow-attack-west", frames: [{ key: "weapons", frame: "Bow/Left/bow-1.png" }, { key: "weapons", frame: "Bow/Left/bow-2.png" }, { key: "weapons", frame: "Bow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow-item", frames: [{ key: "weapons", frame: "Bow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow-slot", frames: [{ key: "weapons", frame: "Bow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow-idle", frames: [{ key: "weapons", frame: "Bow/Idle/bow-1.png" }], showOnStart: true });

    //Bow3Arrow animations
    anims.create({ key: "bow3arrow-attack-north", frames: [{ key: "weapons", frame: "Bow3Arrow/Up/bow-1.png" }, { key: "weapons", frame: "Bow3Arrow/Up/bow-2.png" }, { key: "weapons", frame: "Bow3Arrow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow3arrow-attack-south", frames: [{ key: "weapons", frame: "Bow3Arrow/Down/bow-1.png" }, { key: "weapons", frame: "Bow3Arrow/Down/bow-2.png" }, { key: "weapons", frame: "Bow3Arrow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "bow3arrow-attack-east", frames: [{ key: "weapons", frame: "Bow3Arrow/Right/bow-1.png" }, { key: "weapons", frame: "Bow3Arrow/Right/bow-2.png" }, { key: "weapons", frame: "Bow3Arrow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow3arrow-attack-west", frames: [{ key: "weapons", frame: "Bow3Arrow/Left/bow-1.png" }, { key: "weapons", frame: "Bow3Arrow/Left/bow-2.png" }, { key: "weapons", frame: "Bow3Arrow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow3arrow-item", frames: [{ key: "weapons", frame: "Bow3Arrow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow3arrow-slot", frames: [{ key: "weapons", frame: "Bow3Arrow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow3arrow-idle", frames: [{ key: "weapons", frame: "Bow3Arrow/Idle/bow-1.png" }], showOnStart: true });

    //Bow5Arrow animations
    anims.create({ key: "bow5arrow-attack-north", frames: [{ key: "weapons", frame: "Bow5Arrow/Up/bow-1.png" }, { key: "weapons", frame: "Bow5Arrow/Up/bow-2.png" }, { key: "weapons", frame: "Bow5Arrow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow5arrow-attack-south", frames: [{ key: "weapons", frame: "Bow5Arrow/Down/bow-1.png" }, { key: "weapons", frame: "Bow5Arrow/Down/bow-2.png" }, { key: "weapons", frame: "Bow5Arrow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "bow5arrow-attack-east", frames: [{ key: "weapons", frame: "Bow5Arrow/Right/bow-1.png" }, { key: "weapons", frame: "Bow5Arrow/Right/bow-2.png" }, { key: "weapons", frame: "Bow5Arrow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow5arrow-attack-west", frames: [{ key: "weapons", frame: "Bow5Arrow/Left/bow-1.png" }, { key: "weapons", frame: "Bow5Arrow/Left/bow-2.png" }, { key: "weapons", frame: "Bow5Arrow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "bow5arrow-item", frames: [{ key: "weapons", frame: "Bow5Arrow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow5arrow-slot", frames: [{ key: "weapons", frame: "Bow5Arrow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "bow5arrow-idle", frames: [{ key: "weapons", frame: "Bow5Arrow/Idle/bow-1.png" }], showOnStart: true });

    //Bow animations
    anims.create({ key: "magicbow-attack-north", frames: [{ key: "weapons", frame: "MagicBow/Up/bow-1.png" }, { key: "weapons", frame: "MagicBow/Up/bow-2.png" }, { key: "weapons", frame: "MagicBow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow-attack-south", frames: [{ key: "weapons", frame: "MagicBow/Down/bow-1.png" }, { key: "weapons", frame: "MagicBow/Down/bow-2.png" }, { key: "weapons", frame: "MagicBow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "magicbow-attack-east", frames: [{ key: "weapons", frame: "MagicBow/Right/bow-1.png" }, { key: "weapons", frame: "MagicBow/Right/bow-2.png" }, { key: "weapons", frame: "MagicBow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow-attack-west", frames: [{ key: "weapons", frame: "MagicBow/Left/bow-1.png" }, { key: "weapons", frame: "MagicBow/Left/bow-2.png" }, { key: "weapons", frame: "MagicBow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow-item", frames: [{ key: "weapons", frame: "MagicBow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow-slot", frames: [{ key: "weapons", frame: "MagicBow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow-idle", frames: [{ key: "weapons", frame: "MagicBow/Idle/bow-1.png" }], showOnStart: true });

    //Bow3Arrow animations
    anims.create({ key: "magicbow3arrow-attack-north", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Up/bow-1.png" }, { key: "weapons", frame: "MagicBow3Arrow/Up/bow-2.png" }, { key: "weapons", frame: "MagicBow3Arrow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow3arrow-attack-south", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Down/bow-1.png" }, { key: "weapons", frame: "MagicBow3Arrow/Down/bow-2.png" }, { key: "weapons", frame: "MagicBow3Arrow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "magicbow3arrow-attack-east", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Right/bow-1.png" }, { key: "weapons", frame: "MagicBow3Arrow/Right/bow-2.png" }, { key: "weapons", frame: "MagicBow3Arrow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow3arrow-attack-west", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Left/bow-1.png" }, { key: "weapons", frame: "MagicBow3Arrow/Left/bow-2.png" }, { key: "weapons", frame: "MagicBow3Arrow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow3arrow-item", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow3arrow-slot", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow3arrow-idle", frames: [{ key: "weapons", frame: "MagicBow3Arrow/Idle/bow-1.png" }], showOnStart: true });

    //Bow5Arrow animations
    anims.create({ key: "magicbow5arrow-attack-north", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Up/bow-1.png" }, { key: "weapons", frame: "MagicBow5Arrow/Up/bow-2.png" }, { key: "weapons", frame: "MagicBow5Arrow/Up/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow5arrow-attack-south", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Down/bow-1.png" }, { key: "weapons", frame: "MagicBow5Arrow/Down/bow-2.png" }, { key: "weapons", frame: "MagicBow5Arrow/Down/bow-2.png" }], frameRate: 10, showOnStart: true,  hideOnComplete: true });
    anims.create({ key: "magicbow5arrow-attack-east", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Right/bow-1.png" }, { key: "weapons", frame: "MagicBow5Arrow/Right/bow-2.png" }, { key: "weapons", frame: "MagicBow5Arrow/Right/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow5arrow-attack-west", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Left/bow-1.png" }, { key: "weapons", frame: "MagicBow5Arrow/Left/bow-2.png" }, { key: "weapons", frame: "MagicBow5Arrow/Left/bow-2.png" }], frameRate: 10, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "magicbow5arrow-item", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Item/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow5arrow-slot", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Slot/bow-1.png" }], showOnStart: true });
    anims.create({ key: "magicbow5arrow-idle", frames: [{ key: "weapons", frame: "MagicBow5Arrow/Idle/bow-1.png" }], showOnStart: true });

    //Hammer animations
    anims.create({ key: "hammer-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Hammer/Down/hammer-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "hammer-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Hammer/Up/hammer-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "hammer-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Hammer/Right/hammer-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "hammer-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Hammer/Left/hammer-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "hammer-item", frames: [{ key: "weapons", frame: "Hammer/Item/hammer-1.png" }], showOnStart: true });
    anims.create({ key: "hammer-slot", frames: [{ key: "weapons", frame: "Hammer/Slot/hammer-1.png" }], showOnStart: true });
    anims.create({ key: "hammer-idle", frames: [{ key: "weapons", frame: "Hammer/Idle/hammer-1.png" }], showOnStart: true });

    //Sword1 animation
    anims.create({ key: "sword1-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword1/down/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword1-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword1/right/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword1-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword1/left/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword1-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 5, prefix: "Sword1/up/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "sword1-item", frames: [{ key: "weapons", frame: "Sword1/item/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword1-slot", frames: [{ key: "weapons", frame: "Sword1/slot/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword1-idle", frames: [{ key: "weapons", frame: "Sword1/idle/sword_1.png" }], showOnStart: true });

    //Sword2 animation
    anims.create({ key: "sword2-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword2/down/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword2-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword2/right/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword2-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword2/left/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword2-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 5, prefix: "Sword2/up/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "sword2-item", frames: [{ key: "weapons", frame: "Sword2/item/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword2-slot", frames: [{ key: "weapons", frame: "Sword2/slot/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword2-idle", frames: [{ key: "weapons", frame: "Sword2/idle/sword_1.png" }], showOnStart: true });

    //Sword3 animation
    anims.create({ key: "sword3-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword3/down/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword3-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword3/right/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword3-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword3/left/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword3-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 5, prefix: "Sword3/up/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "sword3-item", frames: [{ key: "weapons", frame: "Sword3/item/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword3-slot", frames: [{ key: "weapons", frame: "Sword3/slot/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword3-idle", frames: [{ key: "weapons", frame: "Sword3/Idle/sword_1.png" }], showOnStart: true });

    //Sword4 animation
    anims.create({ key: "sword4-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword4/down/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword4-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword4/right/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword4-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "Sword4/left/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "sword4-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 5, prefix: "Sword4/up/sword_", suffix: ".png"}), frameRate: 25, showOnStart: true, hideOnComplete: true });
    anims.create({ key: "sword4-item", frames: [{ key: "weapons", frame: "Sword4/item/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword4-slot", frames: [{ key: "weapons", frame: "Sword4/slot/sword_1.png" }], showOnStart: true });
    anims.create({ key: "sword4-idle", frames: [{ key: "weapons", frame: "Sword4/Idle/sword_1.png" }], showOnStart: true });

    //staff animation
    anims.create({ key: "staff-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Staff/down/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "staff-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Staff/up/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "staff-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Staff/right/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "staff-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Staff/left/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "staff-item", frames: [{ key: "weapons", frame: "Staff/item/staff-1.png" }], showOnStart: true });
    anims.create({ key: "staff-slot", frames: [{ key: "weapons", frame: "Staff/slot/staff-1.png" }], showOnStart: true });
    anims.create({ key: "staff-idle", frames: [{ key: "weapons", frame: "Staff/Idle/staff-1.png" }], showOnStart: true });

    anims.create({ key: "bluestaff-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Blue Staff/down/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "bluestaff-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Blue Staff/up/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "bluestaff-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Blue Staff/right/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "bluestaff-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Blue Staff/left/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "bluestaff-item", frames: [{ key: "weapons", frame: "Blue Staff/item/staff-1.png" }], showOnStart: true });
    anims.create({ key: "bluestaff-slot", frames: [{ key: "weapons", frame: "Blue Staff/slot/staff-1.png" }], showOnStart: true });
    anims.create({ key: "bluestaff-idle", frames: [{ key: "weapons", frame: "Blue Staff/Idle/staff-1.png" }], showOnStart: true });

    anims.create({ key: "yellowstaff-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Yellow Staff/down/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "yellowstaff-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Yellow Staff/up/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "yellowstaff-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Yellow Staff/right/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "yellowstaff-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Yellow Staff/left/staff-", suffix: ".png"}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "yellowstaff-item", frames: [{ key: "weapons", frame: "Yellow Staff/item/staff-1.png" }], showOnStart: true });
    anims.create({ key: "yellowstaff-slot", frames: [{ key: "weapons", frame: "Yellow Staff/slot/staff-1.png" }], showOnStart: true });
    anims.create({ key: "yellowstaff-idle", frames: [{ key: "weapons", frame: "Yellow Staff/Idle/staff-1.png" }], showOnStart: true });
    
    //rod anims
    anims.create({ key: "firerod-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Fire Rod/Down/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "firerod-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Fire Rod/Up/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "firerod-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Fire Rod/Right/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "firerod-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Fire Rod/Left/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "firerod-item", frames: [{ key: "weapons", frame: "Fire Rod/Item/rod-1.png" }], showOnStart: true });
    anims.create({ key: "firerod-slot", frames: [{ key: "weapons", frame: "Fire Rod/Slot/rod-1.png" }], showOnStart: true });
    anims.create({ key: "firerod-idle", frames: [{ key: "weapons", frame: "Fire Rod/Idle/rod-1.png" }], showOnStart: true });

    anims.create({ key: "icerod-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Ice Rod/Down/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "icerod-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Ice Rod/Up/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "icerod-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Ice Rod/Right/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "icerod-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Ice Rod/Left/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "icerod-item", frames: [{ key: "weapons", frame: "Ice Rod/Item/rod-1.png" }], showOnStart: true });
    anims.create({ key: "icerod-slot", frames: [{ key: "weapons", frame: "Ice Rod/Slot/rod-1.png" }], showOnStart: true });
    anims.create({ key: "icerod-idle", frames: [{ key: "weapons", frame: "Ice Rod/Idle/rod-1.png" }], showOnStart: true });

    anims.create({ key: "lightrod-attack-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Light Rod/Down/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "lightrod-attack-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Light Rod/Up/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "lightrod-attack-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Light Rod/Right/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "lightrod-attack-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "Light Rod/Left/rod-", suffix: ".png"}), frameRate: 15, showOnStart: true, hideOnComplete: true});
    anims.create({ key: "lightrod-item", frames: [{ key: "weapons", frame: "Light Rod/Item/rod-1.png" }], showOnStart: true });
    anims.create({ key: "lightrod-slot", frames: [{ key: "weapons", frame: "Light Rod/Slot/rod-1.png" }], showOnStart: true });
    anims.create({ key: "lightrod-idle", frames: [{ key: "weapons", frame: "Light Rod/Idle/rod-1.png" }], showOnStart: true });

    //cape anims
    anims.create({
        key: "cape-item", 
        frames: [{ key: "weapons", frame: "Cape/Item/cape-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "cape-slot", 
        frames: [{ key: "weapons", frame: "Cape/Slot/cape-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "cape-idle", 
        frames: [{ key: "weapons", frame: "Cape/Idle/cape-1.png" }],
        showOnStart: true
    });

    //potion anims
    anims.create({ key: "green-potion-item", frames: [{ key: "weapons", frame: "GreenPotion/Item/potion-1.png" }], showOnStart: true });
    anims.create({ key: "green-potion-idle", frames: [{ key: "weapons", frame: "GreenPotion/Idle/potion-1.png" }], showOnStart: true });
    anims.create({ key: "green-potion-slot", frames: [{ key: "weapons", frame: "GreenPotion/Slot/potion-1.png" }], showOnStart: true });

    anims.create({ key: "blue-potion-item", frames: [{ key: "weapons", frame: "BluePotion/Item/potion-1.png" }], showOnStart: true });
    anims.create({ key: "blue-potion-idle", frames: [{ key: "weapons", frame: "BluePotion/Idle/potion-1.png" }], showOnStart: true });
    anims.create({ key: "blue-potion-slot", frames: [{ key: "weapons", frame: "BluePotion/Slot/potion-1.png" }], showOnStart: true });

    anims.create({ key: "red-potion-item", frames: [{ key: "weapons", frame: "RedPotion/Item/potion-1.png" }], showOnStart: true });
    anims.create({ key: "red-potion-idle", frames: [{ key: "weapons", frame: "RedPotion/Idle/potion-1.png" }], showOnStart: true });
    anims.create({ key: "red-potion-slot", frames: [{ key: "weapons", frame: "RedPotion/Slot/potion-1.png" }], showOnStart: true });

    //shields
    anims.create({ key: "blue-shield-stand-south", frames: [{ key: "weapons", frame: "BlueShield/Stand-Down/shield-1.png" }], showOnStart: true });
    anims.create({ key: "blue-shield-stand-north", frames: [{ key: "weapons", frame: "BlueShield/Stand-Up/shield-1.png" }], showOnStart: true });
    anims.create({ key: "blue-shield-stand-east", frames: [{ key: "weapons", frame: "BlueShield/Stand-Right/shield-1.png" }], showOnStart: true });
    anims.create({ key: "blue-shield-stand-west", frames: [{ key: "weapons", frame: "BlueShield/Stand-Left/shield-1.png" }], showOnStart: true });

    anims.create({ key: "blue-shield-run-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 9, prefix: "BlueShield/Run-Down/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });
    anims.create({ key: "blue-shield-run-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 9, prefix: "BlueShield/Run-Up/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });
    anims.create({ key: "blue-shield-run-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 8, prefix: "BlueShield/Run-Left/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });
    anims.create({ key: "blue-shield-run-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 8, prefix: "BlueShield/Run-Right/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });

    anims.create({ key: "blue-shield-walk-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "BlueShield/Walk-Down/shield-", suffix: ".png"}), frameRate: 10, repeat: -1 });
    anims.create({ key: "blue-shield-walk-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "BlueShield/Walk-Up/shield-", suffix: ".png"}), frameRate: 10, repeat: -1 });
    anims.create({ key: "blue-shield-walk-west", frames: anims.generateFrameNames('weapons', {start: 1, end: 4, prefix: "BlueShield/Walk-Left/shield-", suffix: ".png"}), frameRate: 10, repeat: -1 });
    anims.create({ key: "blue-shield-walk-east", frames: anims.generateFrameNames('weapons', {start: 1, end: 4, prefix: "BlueShield/Walk-Right/shield-", suffix: ".png"}), frameRate: 10, repeat: -1 });

    anims.create({ key: "blue-shield-sword-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 6, prefix: "BlueShield/Sword-Down/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });
    anims.create({ key: "blue-shield-sword-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 5, prefix: "BlueShield/Sword-Up/shield-", suffix: ".png"}), frameRate: 25, repeat: -1 });
    anims.create({ key: "blue-shield-hammer-south", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "BlueShield/Hammer-Down/shield-", suffix: ".png"}), frameRate: 15, repeat: -1 });
    anims.create({ key: "blue-shield-hammer-north", frames: anims.generateFrameNames('weapons', {start: 1, end: 3, prefix: "BlueShield/Hammer-Up/shield-", suffix: ".png"}), frameRate: 15, repeat: -1 });

    anims.create({ key: "blue-shield-item", frames: [{ key: "weapons", frame: "BlueShield/Item/shield-1.png" }], showOnStart: true });
    anims.create({ key: "blue-shield-slot", frames: [{ key: "weapons", frame: "BlueShield/Slot/shield-1.png" }], showOnStart: true });
    anims.create({ key: "blue-shield-idle", frames: [{ key: "weapons", frame: "BlueShield/Idle/shield-1.png" }], showOnStart: true });
}

export {
    createWeaponAnims
}