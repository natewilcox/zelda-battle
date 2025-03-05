
enum Color {
    Green,
    Blue,
    Red
}

type ColorMap = {
    from_r: number,
    from_g: number,
    from_b: number,
    from_a: number,
    to_r: number,
    to_g: number,
    to_b: number,
    to_a: number,
}


/**
 * Creates atlas for each palette of link.
 * 
 * @param scene 
 */
export const createLinkAtlases = (scene: Phaser.Scene) => {

    createLinkAtlas('greenlink', scene, 'link-green-palette', 'link-green-palette');
    createLinkAtlas('bluelink', scene, 'link-green-palette', 'link-blue-palette');
    createLinkAtlas('redlink', scene, 'link-green-palette', 'link-red-palette');
}


/**
 * Creates an atlas for link based on color and target and source textures.
 * 
 * @param key 
 * @param scene 
 * @param originalPalette 
 * @param newPalette 
 * @returns 
 */
const createLinkAtlas = (key: string, scene: Phaser.Scene, originalPalette: string, newPalette: string) => {

    //create a colormap of the old and new palettes
    const colorMapping = createColorMapping(scene, originalPalette, newPalette);

    //get reference to image containing link sprites
    const linkSheet = scene.textures.get('link-sheet').getSourceImage() as HTMLImageElement;

    //create temp canvas to swap colors on
    const tempCanvas = scene.textures.createCanvas('temp', linkSheet.width, linkSheet.height);
    const canvas = tempCanvas!.getSourceImage() as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    //confirm we have a context before continuing
    if(!context) return;

    // Copy the sheet.
    context.drawImage(linkSheet, 0, 0);

    const imageData = context.getImageData(0, 0, linkSheet.width, linkSheet.height);
    const pixelArray = imageData.data;

    //iterate over pixles in set of 4 (rbga)
    for(let i=0;i<pixelArray.length/4;i++) {
        processPixel(pixelArray, i, colorMapping);
    }

    //push the modified pixels back to context and get reference to image
    context.putImageData(imageData, 0, 0);
    const paletteSwappedImage = tempCanvas!.getSourceImage() as HTMLImageElement;

    //create the atlas and clear the temp canvas
    scene.textures.addAtlas(key, paletteSwappedImage, scene.cache.json.get('link-json'));
    scene.textures.get('temp').destroy();

    //create animations for palette
    createLinkAnimations(key, scene.anims);
};


/**
 * Creates an array of maps from source color to target color
 * 
 * @param scene 
 * @param originalPalette 
 * @param newPalette 
 * @returns 
 */
const createColorMapping = (scene: Phaser.Scene, originalPalette: string, newPalette: string) => {

    //create a colormap of the old and new palettes
    const colorMapping: ColorMap[] = []
    const paletteWidth = scene.textures.get(originalPalette).getSourceImage().width;
    const paletteHeight = scene.textures.get(originalPalette).getSourceImage().height;

    //scan source palette and add mapping for coorsponding target palettes
    for(let y=0;y<paletteHeight;y++) {
        for(let x=0;x<paletteWidth;x++) {

            const originalPixel = scene.textures.getPixel(x, y, originalPalette);
            const newPixel = scene.textures.getPixel(x, y, newPalette);

            if(!originalPixel || !newPixel) continue;

            //check if mapping already exists
            if(colorMapping.find(
                m => m.from_a == originalPixel.alpha && 
                m.from_b == originalPixel.blue && 
                m.from_g == originalPixel.green &&
                m.from_r == originalPixel.red
            )) continue;

            colorMapping.push({
                from_r: originalPixel.red,
                from_g: originalPixel.green,
                from_b: originalPixel.blue,
                from_a: originalPixel.alpha,
                to_r: newPixel.red,
                to_g: newPixel.green,
                to_b: newPixel.blue,
                to_a: newPixel.alpha
            });
        }
    }

    return colorMapping;
};


/**
 * Converts rgba from source to target values.
 * 
 * @param pixels 
 * @param i 
 * @param colorMapping 
 * @returns 
 */
const processPixel = (pixels, i: number, colorMapping: ColorMap[]) => {

    let index = 4 * i;

    var r = pixels[index];
    var g = pixels[index+1];
    var b = pixels[index+2];
    var a = pixels[index+3];

    const mapping = colorMapping.find(m => 
        //m.from_a == a && 
        m.from_b == b && 
        m.from_g == g &&
        m.from_r == r
    );

    if(!mapping) return;

    pixels[index] = mapping.to_r;
    pixels[index+1] = mapping.to_g;
    pixels[index+2] = mapping.to_b;
    pixels[index+3] = mapping.to_a;
}


/**
 * Creates animations provided link key..
 * 
 * @param keyName 
 * @param anims 
 */
const createLinkAnimations = (keyName: string, anims: Phaser.Animations.AnimationManager) => {

    anims.create({
        key: `${keyName}-fly-east`, 
        frames: [{ key: keyName, frame: 'link_fly_left/link_1.png' }]
    });

    anims.create({
        key: `${keyName}-fly-west`, 
        frames: [{ key: keyName, frame: 'link_fly_right/link_1.png' }]
    });

    anims.create({ key: `${keyName}-stand-south`, frames: [{ key: keyName, frame: 'link_stand_down/link_1.png' }], repeat: -1 });
    anims.create({ key: `${keyName}-stand-north`, frames: [{ key: keyName, frame: 'link_stand_up/link_1.png' }], repeat: -1 });
    anims.create({ key: `${keyName}-stand-west`, frames: [{ key: keyName, frame: 'link_stand_left/link_1.png' }], repeat: -1 });
    anims.create({ key: `${keyName}-stand-east`, frames: [{ key: keyName, frame: 'link_stand_right/link_1.png' }], repeat: -1 });

    anims.create({
        key: `${keyName}-run-south`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 9, prefix: 'link_walk_down/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-run-north`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 9, prefix: 'link_walk_up/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-run-west`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 8, prefix: 'link_walk_left/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-run-east`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 8, prefix: 'link_walk_right/link_', suffix: '.png'}),
        frameRate: 25,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-walk-south`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 6, prefix: 'link_slowwalk_down/link_', suffix: '.png'}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-walk-north`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 6, prefix: 'link_slowwalk_up/link_', suffix: '.png'}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-walk-west`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 4, prefix: 'link_slowwalk_left/link_', suffix: '.png'}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: `${keyName}-walk-east`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 4, prefix: 'link_slowwalk_right/link_', suffix: '.png'}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({key: `${keyName}-sword-south`, frames: anims.generateFrameNames(keyName, {start: 1, end: 6, prefix: 'swing_down/link_', suffix: '.png'}), frameRate: 25 });
    anims.create({key: `${keyName}-sword-north`, frames: anims.generateFrameNames(keyName, {start: 1, end: 5, prefix: 'swing_up/link_', suffix: '.png'}), frameRate: 25 });
    anims.create({key: `${keyName}-sword-west`,frames: anims.generateFrameNames(keyName, {start: 1, end: 6, prefix: 'swing_left/link_', suffix: '.png'}), frameRate: 25 });
    anims.create({key: `${keyName}-sword-east`, frames: anims.generateFrameNames(keyName, {start: 1, end: 6, prefix: 'swing_right/link_', suffix: '.png'}), frameRate: 25 });

    anims.create({key: `${keyName}-staff-south`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_staff_down/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-staff-north`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_staff_up/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-staff-west`,frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_staff_left/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-staff-east`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_staff_right/link-', suffix: '.png'}), frameRate: 10 });

    anims.create({key: `${keyName}-hammer-south`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'hammer_down/link-', suffix: '.png'}), frameRate: 15 });
    anims.create({key: `${keyName}-hammer-north`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'hammer_up/link-', suffix: '.png'}), frameRate: 15 });
    anims.create({key: `${keyName}-hammer-west`,frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'hammer_left/link-', suffix: '.png'}), frameRate: 15 });
    anims.create({key: `${keyName}-hammer-east`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'hammer_right/link-', suffix: '.png'}), frameRate: 15 });

    anims.create({key: `${keyName}-bow-south`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_bow_down/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-bow-north`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_bow_up/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-bow-west`,frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_bow_left/link-', suffix: '.png'}), frameRate: 10 });
    anims.create({key: `${keyName}-bow-east`, frames: anims.generateFrameNames(keyName, {start: 1, end: 3, prefix: 'link_bow_right/link-', suffix: '.png'}), frameRate: 10 });

    anims.create({
        key: `${keyName}-spin`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 4, prefix: 'spin/link_', suffix: '.png'}),
        frameRate: 15,
        repeat: 2
    });

    anims.create({
        key: `${keyName}-die`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 2, prefix: 'die/link_', suffix: '.png'}),
        frameRate: 15
    });

    anims.create({
        key: `${keyName}-shock`, 
        frames: anims.generateFrameNames(keyName, {start: 1, end: 2, prefix: 'shock/link_', suffix: '.png'}),
        frameRate: 15,
        repeat: -1,
    });

    anims.create({
        key: `${keyName}-collect`, 
        frames: [{ key: keyName, frame: 'collect/link_1.png' }]
    });

    anims.create({
        key: `${keyName}-sleeping`, 
        frames: [{ key: keyName, frame: 'sleeping/link-1.png' }]
    });

    anims.create({
        key: `${keyName}-awake`, 
        frames: [{ key: keyName, frame: 'awake/link-1.png' }]
    });
}