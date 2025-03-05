import { Schema, type } from "@colyseus/schema";
import { LandType } from "@natewilcox/zelda-battle-shared";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { Direction, GameTextures, LinkColor, LinkState } from "@natewilcox/zelda-battle-shared";


/**
 * State object for player on server.
 */
export class PlayerState extends Schema implements IPlayerState {

  @type('string')
  handle: string;

  @type('string')
  uid: string;

  @type('string')
  clientId: string;

  @type('number')
  id: number;

  @type('number')
  linkColor: LinkColor;

  @type('number')
  health: number;

  @type('number')
  maxHealth: number;

  @type('number')
  magic: number;

  @type('number')
  maxMagic: number;

  @type('number')
  rupees: number;

  @type('number')
  maxRupees: number;

  @type('number')
  bombs: number;

  @type('number')
  maxBombs: number;

  @type('number')
  arrows: number;

  @type('number')
  maxArrows: number;

  @type('number')
  keys: number;

  @type('number')
  maxKeys: number;

  @type('boolean')
  wearingCape: boolean;

  @type('boolean')
  hasMagicShield: boolean;

  @type('boolean')
  hasControl: boolean;

  @type('boolean')
  visible: boolean;

  @type('boolean')
  visibleLocal: boolean;
  
  @type('boolean')
  hasOra: boolean;

  @type('boolean')
  hasShadow: boolean;

  @type('boolean')
  isHiding: boolean;

  @type('number')
  curLandType: LandType;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('number')
  dir: Direction;

  @type('number')
  state: LinkState;

  @type('number')
  speed: number;

  @type('number')
  alpha: number;

  @type('number')
  teleport_x?: number;

  @type('number')
  teleport_y?: number;

  @type('number')
  weaponSlot1?: GameTextures;

  @type('number')
  weaponSlot2?: GameTextures;
  
  bag: GameTextures[] = [];

  //game stats
  placement: number = 0;
  eliminations: number = 0;
  damageGiven: number = 0;
  damageTaken: number = 0;
  magicUsed: number = 0;
  dataSynced: boolean = false;
  
  resetAudit: boolean = true;
  greviances: number = 0;

  /**
   * Creates an instance of a player state.
   * 
   * @param clientId 
   * @param id 
   * @param linkColor 
   * @param health 
   * @param maxHealth 
   * @param magic 
   * @param maxMagic 
   * @param rupees 
   * @param maxRupees 
   * @param bombs 
   * @param maxBombs 
   * @param arrows 
   * @param maxArrows 
   * @param x 
   * @param y 
   * @param speed 
   */
  constructor(handle: string, uid: string, clientId: string, id: number, linkColor: LinkColor, health: number, maxHealth: number, magic: number, maxMagic: number, rupees: number, maxRupees: number, 
      bombs: number, maxBombs: number, arrows: number, maxArrows: number, x: number, y: number, speed: number) {

    super();
    
    this.handle = handle;

    if(this.handle == null) this.handle = "default";

    this.uid = uid;
    this.clientId = clientId;
    this.id = id;
    this.linkColor = linkColor;
    this.health = health;
    this.maxHealth = maxHealth;
    this.magic = magic;
    this.maxMagic = maxMagic;
    this.rupees = rupees;
    this.maxRupees = maxRupees;
    this.bombs = bombs;
    this.maxBombs = maxBombs;
    this.arrows = arrows;
    this.maxArrows = maxArrows;
    this.keys = 0;
    this.maxKeys = 9;
    this.wearingCape = false;
    this.hasMagicShield = false;
    this.hasControl = true;
    this.visible = true;
    this.visibleLocal = true;
    this.hasOra = false;
    this.hasShadow = true;
    this.isHiding = false;
    this.curLandType = LandType.Grass;
    this.x = x;
    this.y = y;
    this.dir = Direction.South;
    this.state = LinkState.Standing;
    this.speed = speed;
    this.alpha = 1;
  }
}