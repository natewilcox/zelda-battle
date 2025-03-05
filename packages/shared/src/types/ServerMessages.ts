/**
 * enum for messages sent from server to client
 */
export enum ServerMessages {

    ChestOpened,
    Hit,
    Message,
    Placement,
    BushChopped,
    Attack,
    ArrowShot,
    FireballShot,
    LightBallShot,
    IceblastShot,
    BulletCollision,
    DynamicChestOpened,
    BombPlaced,
    BombDetonated,
    PONG,
    SetCameraBounds,
    FadeOut,
    FadeIn,
    BlockPlaced,
    LighteningShot,
    ResetPlayer,
    ShockPlayer,
    FreezePlayer,
    BurnPlayer,
    WakePlayerUp,
    Talk,
    BagContentsChanged,
    MovePlayer,
    Disconnected,
    LockedDoorOpened
}