enum LinkState {
    Standing,
    Walking,
    Running,
    Attack1,
    Attack2,
    Attack1Alt,
    Attack2Alt,
    Collecting,
    Hurt,
    Dead,
    Shocked,
    Frozen,
    Burned,
    Sleeping,
    Awake
}

enum LinkColor {
    Green,
    Blue,
    Red
}

enum GameTextures {
    GreenLink,
    BlueLink,
    RedLink,
    Sword1,
    Sword2,
    Sword3,
    Sword4,
    Agahnim,
    Staff,
    BlueStaff,
    YellowStaff,
    FireRod,
    IceRod,
    LightRod,
    Hammer,
    Bow,
    Bow3Arrow,
    Bow5Arrow,
    MagicBow,
    MagicBow3Arrow,
    MagicBow5Arrow,
    Arrow,
    MagicArrow,
    Bomb,
    Cape,
    GreenRupee,
    BlueRupee,
    RedRupee,
    FiftyRupees,
    SmallHeart,
    FullHeart,
    OneBomb,
    FiveBombs,
    EightBombs,
    TenBombs,
    OneArrow,
    TenArrows,
    MagicBottle,
    MagicJar,
    Storm,
    Lightening,
    Fireball,
    IceBlast,
    LargeLightBall,
    MediumLightBall,
    SmallLightBall,
    Timmy,
    Sammy,
    Mary,
    Sally,
    Bobby,
    Balu,
    Jane,
    Kenzie,
    Earl,
    Becky,
    Nothing,
    GreenPotion,
    BluePotion,
    RedPotion,
    RedSwitch,
    BlueSwitch,
    BlueShield,
    OldMan,
    SmallKey,
    Bat,
    Rat,
    Snake,
    Skeleton
}

enum MapTextures {
    Bush,
    Grass,
    Rock,
    ClosedChest,
    OpenedChest,
    BrownBush,
    Stake
}

enum WeaponType {
    Sword,
    Staff,
    Hammer,
    Bow,
    Arrow,
    Item,
    None,
    Shield
}

enum Direction {
    North,
    South,
    East,
    West
}

const directionIndex = ['north', 'south', 'east', 'west'];
const directionLookupMap = new Map<string, number>();
directionLookupMap.set('north', Direction.North);
directionLookupMap.set('south', Direction.South);
directionLookupMap.set('east', Direction.East);
directionLookupMap.set('west', Direction.West);

const weaponTypeIndex = ['sword', 'staff', 'hammer', 'bow', 'item', 'none'];
const weaponTypeLookupMap = new Map<string, number>();
weaponTypeLookupMap.set('sword', WeaponType.Sword);
weaponTypeLookupMap.set('staff', WeaponType.Staff);
weaponTypeLookupMap.set('hammer', WeaponType.Hammer);
weaponTypeLookupMap.set('bow', WeaponType.Bow);
weaponTypeLookupMap.set('item', WeaponType.Item);
weaponTypeLookupMap.set('none', WeaponType.None);

const texturesIndex = ['greenlink', 'bluelink', 'redlink', 'sword1', 'sword2', 'sword3', 'sword4', 'agahnim', 'staff', 'bluestaff', 'yellowstaff', 'firerod', 'icerod', 'lightrod', 'hammer', 'bow', 
    'bow3arrow', 'bow5arrow', 'magicbow', 'magicbow3arrow', 'magicbow5arrow', 'arrow', 'magicarrow', 'bomb', 'cape', 'green-rupee', 'blue-rupee', 
    'red-rupee', 'fifty-rupees', 'small-heart', 'full-heart', 'one-bomb', 'five-bombs', 'eight-bombs', 'ten-bombs', 'one-arrow', 'ten-arrows', 'magic-bottle', 
    'magic-jar', 'storm', 'lightening', 'fireball', 'iceblast', 'large-lightball', 'medium-lightball', 'small-lightball', 'timmy', 'sammy', 'mary', 'sally', 'bobby',
    'balu', 'jane', 'kenzie', 'earl', 'becky', 'nothing', 'green-potion', 'blue-potion', 'red-potion', 'red-switch', 'blue-switch', 'blue-shield', 'oldman', 'small-key',
    'bat', 'rat', 'snake', 'skeleton'];

const textureLookupMap = new Map<string, number>();
textureLookupMap.set('greenlink', GameTextures.GreenLink);
textureLookupMap.set('bluelink', GameTextures.BlueLink);
textureLookupMap.set('redlink', GameTextures.RedLink);
textureLookupMap.set('sword1', GameTextures.Sword1);
textureLookupMap.set('sword2', GameTextures.Sword2);
textureLookupMap.set('sword3', GameTextures.Sword3);
textureLookupMap.set('sword4', GameTextures.Sword4);
textureLookupMap.set('agahnim', GameTextures.Agahnim);
textureLookupMap.set('staff', GameTextures.Staff);
textureLookupMap.set('bluestaff', GameTextures.BlueStaff);
textureLookupMap.set('yellowstaff', GameTextures.YellowStaff);
textureLookupMap.set('firerod', GameTextures.FireRod);
textureLookupMap.set('icerod', GameTextures.IceRod);
textureLookupMap.set('lightrod', GameTextures.LightRod);
textureLookupMap.set('hammer', GameTextures.Hammer);
textureLookupMap.set('bow', GameTextures.Bow);
textureLookupMap.set('bow3arrow', GameTextures.Bow3Arrow);
textureLookupMap.set('bow5arrow', GameTextures.Bow5Arrow);
textureLookupMap.set('magicbow', GameTextures.MagicBow);
textureLookupMap.set('magicbow3arrow', GameTextures.MagicBow3Arrow);
textureLookupMap.set('magicbow5arrow', GameTextures.MagicBow5Arrow);
textureLookupMap.set('arrow', GameTextures.Arrow);
textureLookupMap.set('magicarrow', GameTextures.MagicArrow);
textureLookupMap.set('bomb', GameTextures.Bomb);
textureLookupMap.set('cape', GameTextures.Cape);
textureLookupMap.set('green-rupee', GameTextures.GreenRupee);
textureLookupMap.set('blue-rupee', GameTextures.BlueRupee);
textureLookupMap.set('red-rupee', GameTextures.RedRupee);
textureLookupMap.set('fifty-rupees', GameTextures.FiftyRupees);
textureLookupMap.set('small-heart', GameTextures.SmallHeart);
textureLookupMap.set('full-heart', GameTextures.FullHeart);
textureLookupMap.set('one-bomb', GameTextures.OneBomb);
textureLookupMap.set('five-bombs', GameTextures.FiveBombs);
textureLookupMap.set('eight-bombs', GameTextures.EightBombs);
textureLookupMap.set('ten-bombs', GameTextures.TenBombs);
textureLookupMap.set('one-arrow', GameTextures.OneArrow);
textureLookupMap.set('ten-arrows', GameTextures.TenArrows);
textureLookupMap.set('magic-bottle', GameTextures.MagicBottle);
textureLookupMap.set('magic-jar', GameTextures.MagicJar);
textureLookupMap.set('storm', GameTextures.Storm);
textureLookupMap.set('lightening', GameTextures.Lightening);
textureLookupMap.set('fireball', GameTextures.Fireball);
textureLookupMap.set('iceblast', GameTextures.IceBlast);
textureLookupMap.set('large-lightball', GameTextures.LargeLightBall);
textureLookupMap.set('medium-lightball', GameTextures.MediumLightBall);
textureLookupMap.set('small-lightball', GameTextures.SmallHeart);
textureLookupMap.set('timmy', GameTextures.Timmy);
textureLookupMap.set('sammy', GameTextures.Sammy);
textureLookupMap.set('mary', GameTextures.Mary);
textureLookupMap.set('sally', GameTextures.Sally);
textureLookupMap.set('bobby', GameTextures.Bobby);
textureLookupMap.set('balu', GameTextures.Balu);
textureLookupMap.set('jane', GameTextures.Jane);
textureLookupMap.set('kenzie', GameTextures.Kenzie);
textureLookupMap.set('earl', GameTextures.Earl);
textureLookupMap.set('becky', GameTextures.Becky);
textureLookupMap.set('nothing', GameTextures.Nothing);
textureLookupMap.set('green-potion', GameTextures.GreenPotion);
textureLookupMap.set('blue-potion', GameTextures.BluePotion);
textureLookupMap.set('red-potion', GameTextures.RedPotion);
textureLookupMap.set('red-switch', GameTextures.RedSwitch);
textureLookupMap.set('blue-switch', GameTextures.BlueSwitch);
textureLookupMap.set('blue-shield', GameTextures.BlueShield);
textureLookupMap.set('oldman', GameTextures.OldMan);
textureLookupMap.set('small-key', GameTextures.SmallKey);
textureLookupMap.set('bat', GameTextures.Bat);
textureLookupMap.set('rat', GameTextures.Rat);
textureLookupMap.set('snake', GameTextures.Snake);
textureLookupMap.set('skeleton', GameTextures.Skeleton);

const linkColorIndex = ['greenlink', 'bluelink', 'redlink'];
const linkColorLookupMap = new Map<string, number>();
linkColorLookupMap.set('greenlink', LinkColor.Green);
linkColorLookupMap.set('bluelink', LinkColor.Blue);
linkColorLookupMap.set('redlink', LinkColor.Red);

const addMappingEntry = (index: number, name: string, indexMap: Map<number, string>, reverseMap: Map<string, number>) => {
    
    indexMap.set(index, name);
    reverseMap.set(name, index);
}


export {
    GameTextures,
    MapTextures,
    texturesIndex,
    textureLookupMap,
    WeaponType,
    weaponTypeIndex,
    weaponTypeLookupMap,
    Direction,
    directionIndex,
    directionLookupMap,
    LinkState,
    LinkColor,
    linkColorIndex,
    linkColorLookupMap
}