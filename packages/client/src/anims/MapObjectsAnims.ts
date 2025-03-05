/**
 * Create animations for map objects
 * 
 * @param anims 
 */
const createMapObjectsAnims = (anims: Phaser.Animations.AnimationManager) => {

    anims.create({
        key: "red-switch", 
        frames: [{ key: "mapObjects", frame: "RedSwitch/switch-1.png" }],
        showOnStart: true
    });

    anims.create({
        key: "blue-switch", 
        frames: [{ key: "mapObjects", frame: "BlueSwitch/switch-1.png" }],
        showOnStart: true
    });
}

export {
    createMapObjectsAnims
} 