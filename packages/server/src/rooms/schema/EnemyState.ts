import _, { drop } from 'lodash';
import { Schema, type } from "@colyseus/schema";
import { Direction, GameTextures } from "@natewilcox/zelda-battle-shared";
import { IEnemyState } from '@natewilcox/zelda-battle-shared';

export class EnemyState extends Schema implements IEnemyState {

  @type('number')
  id: number;

  @type('number')
  health: number;
  
  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('number')
  dir?: Direction;

  @type('number')
  speed: number;

  @type('number')
  state: number;

  @type('number')
  texture: GameTextures;

  @type('number')
  alpha: number;

  drops?: GameTextures;

  constructor(id: number, health: number, x: number, y: number, speed: number, state: number, texture: GameTextures, alpha: number, drops?: GameTextures) {
    super();
    
    this.id = id;
    this.health = health;
    this.x = x;
    this.y = y;
    this.dir = Direction.South;
    this.speed = speed;
    this.state = state;
    this.texture = texture;
    this.alpha = alpha;
    this.drops = drops;
  }
}