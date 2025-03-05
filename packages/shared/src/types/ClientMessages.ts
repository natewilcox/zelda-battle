/**
 * Enum for all actions the client can send to server.
 */
export enum ClientMessages {

    PlayerStateUpdated,
    AddSprite,
    ItemCollected,
    ItemStored,
    ChestOpened,
    OpenDynamicChest,
    HitTarget,
    BreakTile,
    ShootArrow,
    BulletCollision,
    PlaceBomb,
    DetonateBomb,
    UseCape,
    PING,
    PlaceBlock,
    ShootLightening,
    CreateShield,
    ShootFireball,
    ShootIceblast,
    ShootLightBall,
    Talk,
    SwitchWeaponFromBag,
    UseGreenPotion,
    UseRedPotion,
    UseBluePotion,
    Disconnect,
    OpenLockedDoor,
    SwordAttack
}