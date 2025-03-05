import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { IEnemyState } from "@natewilcox/zelda-battle-shared";
import { StateMachine } from "@natewilcox/zelda-battle-shared";
import { ServerSimulationScene } from "./ServerSimulationScenes";
import { GameTextures, LinkState, Direction } from "@natewilcox/zelda-battle-shared";
import { BatState, EnemyType, RatState, SkeletonState, SnakeState } from "@natewilcox/zelda-battle-shared";
import _ from "lodash";
import '@geckos.io/phaser-on-nodejs'
// import Phaser from 'phaser';

export const enemyFactory = (texture: GameTextures, scene, x, y) => {

  switch(texture) {

    case GameTextures.Bat: return new Bat(scene, x, y);
    case GameTextures.Rat: return new Rat(scene, x, y);
    case GameTextures.Snake: return new Snake(scene, x, y);
    case GameTextures.Skeleton: return new Skeleton(scene, x, y);
  }

  return new Rat(scene, x, y);
}

export interface IEnemy {

  id;
  enemyState;
  detectionZone;

  idle: () => void;
  approached: (from: Phaser.Math.Vector2) => void;
  hurt: (from: Phaser.Math.Vector2) => void;
}

export class Player extends Phaser.Physics.Arcade.Sprite {

  id!: number;
  playerState!: IPlayerState;
  stateMachine: StateMachine = new StateMachine(this, 'player_fsm');
  scene: ServerSimulationScene;

  constructor(scene, x, y) {
    // pass empty string for the texture
    super(scene, x, y, '')

    this.scene = scene;
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    // set the width and height of the sprite as the body size
    this.body.setSize(16, 16);

    this.stateMachine
      .addState("remote", {
          onEnter: this.onRemoteEnter
      })
      .addState("hurt", {
        onEnter: this.onHurtEnter,
        onExit: this.onHurtExit
      });
  }

  hurt(fromPoint: Phaser.Math.Vector2) {

    if(!this.stateMachine.isCurrentState('hurt')) {
    
      this.stateMachine.setState('hurt', {
        from: fromPoint
      });
    }
  }

  private onRemoteEnter = (config) => {
    this.playerState.state = LinkState.Standing;
  }

  private onHurtEnter = (config) => {
    
    this.playerState.state = LinkState.Hurt;
    const impact = config.from as Phaser.Math.Vector2;

    this.playerState.speed = 200;
    const dx = this.x - impact.x;
    const dy = this.y - impact.y;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(dx, dy).normalize().scale(this.playerState.speed);
    this.setVelocity(dir.x, dir.y);

    
    this.scene.time.delayedCall(200, () => {

      if(this.playerState.health > 0) {
        this.stateMachine.setState('remote');
      }
      else {
        this.playerState.state = LinkState.Dead;
        this.scene.emit('onplayerdied', this.playerState);
      }
    });
  };

  private onHurtExit = () => {
    
    this.setVelocity(0, 0);
    this.playerState.speed = 100;
  }

  update(dt: number, t: number) {
    this.stateMachine.update(dt);
  }
}

export class Enemy extends Phaser.Physics.Arcade.Sprite implements IEnemy {

  id!: number;
  speed!: number;
  enemyState!: IEnemyState;
  detectionZone!: Phaser.GameObjects.Arc;
  stateMachine: StateMachine = new StateMachine(this, 'enemy_fsm');
  enemyType!: EnemyType;
  scene!: ServerSimulationScene;

  idle = () => {};
  approached = (from: Phaser.Math.Vector2) => {};
  hurt = (from: Phaser.Math.Vector2) => {};

  constructor(scene, x, y) {
    super(scene, x, y, '');

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);
  }
}

export class Rat extends Enemy {
 
  constructor(scene, x, y) {
    super(scene, x, y);

    this.enemyType = EnemyType.Rat;
    this.state = RatState.Standing;

    this.setSize(10, 10);

    this.stateMachine
      .addState("idle", {
          onEnter: this.onIdleEnter
      })
      .addState("standing", {
        onEnter: this.onStandingEnter,
      })
      .addState("walking", {
        onEnter: this.onWalkingEnter,
      })
      .addState("hurt", {
        onEnter: this.onHurtEnter
      });
  }

  idle = () => {
    
    if(!this.stateMachine.isCurrentState('idle') && !this.stateMachine.isCurrentState('hurt')) {
      this.stateMachine.setState('idle');
    }
  }

  approached = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('walking') && !this.stateMachine.isCurrentState('hurt')) {
      
      this.stateMachine.setState('walking', {
        from: fromPoint
      });
    }
  }

  hurt = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('hurt')) {
    
      this.stateMachine.setState('hurt', {
        from: fromPoint
      });
    }
  }

  private onIdleEnter = () => {

    this.enemyState.state = RatState.Idle;
    this.setVelocity(0, 0);
  }

  private onStandingEnter = () => {

    this.enemyState.state = RatState.Standing;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;
    this.enemyState.dir = this.body.velocity.x > 0 ? Direction.East : Direction.West;

    this.setVelocity(0, 0);
  }

  private onWalkingEnter = () => {

    //get random direction
    const dir = _.random(0, 3) as Direction;

    this.enemyState.dir = dir;
    this.enemyState.state = RatState.Walking;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    if(dir == Direction.East) this.setVelocity(this.enemyState.speed, 0);
    if(dir == Direction.West) this.setVelocity(-this.enemyState.speed, 0);
    if(dir == Direction.North) this.setVelocity(0, -this.enemyState.speed);
    if(dir == Direction.South) this.setVelocity(0, this.enemyState.speed);

    this.scene.time.delayedCall(1000, () => {

      if(this.enemyState.state == RatState.Walking) {
        this.stateMachine.setState('standing');
      }
    })
  }

  private onHurtEnter = (config) => {
    
    this.enemyState.state = RatState.Hurt;
    const impact = config.from as Phaser.Math.Vector2;

    this.enemyState.speed = 300;
    this.enemyState.alpha = 0.5;

    const dx = this.x - impact.x;
    const dy = this.y - impact.y;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(dx, dy).normalize().scale(this.enemyState.speed);
    this.setVelocity(dir.x, dir.y);

    this.scene.time.delayedCall(200, () => {

      if(this.enemyState.health > 0) {
        this.stateMachine.setState('standing');
      }
      else {
        this.enemyState.state = RatState.Dead;
        this.scene.emit('onemenydied', this.enemyState);
      }
    });
  };
}

export class Bat extends Enemy {

  constructor(scene, x, y) {
    super(scene, x, y);

    this.enemyType = EnemyType.Bat;
    this.setSize(10, 10);

    this.stateMachine
      .addState("idle", {
          onEnter: this.onIdleEnter
      })
      .addState("flee", {
        onEnter: this.onApproachedEnter,
      })
      .addState("hurt", {
        onEnter: this.onHurtEnter
      });
  }

  idle = () => {
    
    if(!this.stateMachine.isCurrentState('idle') && !this.stateMachine.isCurrentState('hurt')) {
      this.stateMachine.setState('idle');
    }
  }

  approached = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('flee') && !this.stateMachine.isCurrentState('hurt')) {
      
      this.stateMachine.setState('flee', {
        from: fromPoint
      });
    }
  }

  hurt = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('hurt')) {
    
      this.stateMachine.setState('hurt', {
        from: fromPoint
      });
    }
  }

  private onIdleEnter = (config) => {
    this.enemyState.state = BatState.Idle;
    this.setVelocity(0, 0);
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;
  }

  private onApproachedEnter = (config) => {

    this.enemyState.state = BatState.Flying;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(1, 0).normalize().scale(this.enemyState.speed);
    dir.rotate(Phaser.Math.Angle.Random());

    this.setVelocity(dir.x, dir.y);

    this.scene.time.delayedCall(2000, () => {

      if(this.enemyState.state == BatState.Flying) {
        this.stateMachine.setState('idle');
      }
    });
  }

  private onHurtEnter = (config) => {
    
    this.enemyState.state = BatState.Hurt;
    const impact = config.from as Phaser.Math.Vector2;

    this.enemyState.speed = 300;
    this.enemyState.alpha = 0.5;

    const dx = this.x - impact.x;
    const dy = this.y - impact.y;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(dx, dy).normalize().scale(this.enemyState.speed);
    this.setVelocity(dir.x, dir.y);

    this.scene.time.delayedCall(200, () => {

      if(this.enemyState.health > 0) {
        this.stateMachine.setState('flee');
      }
      else {
        this.enemyState.state = BatState.Dead;
        this.scene.emit('onemenydied', this.enemyState);
      }
    });
  };

  update(dt: number, t: number) {

    if(this.enemyState.state != BatState.Dead) {
      this.stateMachine.update(dt);
    }
  }
}

export class Snake extends Enemy {
 
  constructor(scene, x, y) {
    super(scene, x, y);

    this.enemyType = EnemyType.Snake;
    this.state = SnakeState.Standing;

    this.setSize(10, 10);

    this.stateMachine
      .addState("idle", {
          onEnter: this.onIdleEnter
      })
      .addState("standing", {
        onEnter: this.onStandingEnter,
      })
      .addState("walking", {
        onEnter: this.onWalkingEnter,
      })
      .addState("hurt", {
        onEnter: this.onHurtEnter
      });
  }

  idle = () => {
    
    if(!this.stateMachine.isCurrentState('idle') && !this.stateMachine.isCurrentState('hurt')) {
      this.stateMachine.setState('idle');
    }
  }

  approached = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('walking') && !this.stateMachine.isCurrentState('hurt')) {
      
      this.stateMachine.setState('walking', {
        from: fromPoint
      });
    }
  }

  hurt = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('hurt')) {
    
      this.stateMachine.setState('hurt', {
        from: fromPoint
      });
    }
  }

  private onIdleEnter = () => {

    this.enemyState.state = SnakeState.Idle;
    this.setVelocity(0, 0);
  }

  private onStandingEnter = () => {

    this.enemyState.state = SnakeState.Standing;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    this.setVelocity(0, 0);
  }

  private onWalkingEnter = () => {

    //get random direction
    const dir = _.random(0, 3) as Direction;

    this.enemyState.dir = dir;
    this.enemyState.state = SnakeState.Walking;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    if(dir == Direction.East) this.setVelocity(this.enemyState.speed, 0);
    if(dir == Direction.West) this.setVelocity(-this.enemyState.speed, 0);
    if(dir == Direction.North) this.setVelocity(0, -this.enemyState.speed);
    if(dir == Direction.South) this.setVelocity(0, this.enemyState.speed);

    this.scene.time.delayedCall(1000, () => {

      if(this.enemyState.state == SnakeState.Walking) {
        this.stateMachine.setState('standing');
      }
    })
  }

  private onHurtEnter = (config) => {
    
    this.enemyState.state = SnakeState.Hurt;
    const impact = config.from as Phaser.Math.Vector2;

    this.enemyState.speed = 300;
    this.enemyState.alpha = 0.5;

    const dx = this.x - impact.x;
    const dy = this.y - impact.y;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(dx, dy).normalize().scale(this.enemyState.speed);
    this.setVelocity(dir.x, dir.y);

    this.scene.time.delayedCall(200, () => {

      if(this.enemyState.health > 0) {
        this.stateMachine.setState('standing');
      }
      else {
        this.enemyState.state = SnakeState.Dead;
        this.scene.emit('onemenydied', this.enemyState);
      }
    });
  };
}

export class Skeleton extends Enemy {
 
  constructor(scene, x, y) {
    super(scene, x, y);

    this.enemyType = EnemyType.Skeleton;
    this.state = SkeletonState.Standing;

    this.setSize(10, 10);

    this.stateMachine
      .addState("idle", {
          onEnter: this.onIdleEnter
      })
      .addState("standing", {
        onEnter: this.onStandingEnter,
      })
      .addState("walking", {
        onEnter: this.onWalkingEnter,
      })
      .addState("hurt", {
        onEnter: this.onHurtEnter
      });
  }

  idle = () => {
    
    if(!this.stateMachine.isCurrentState('idle') && !this.stateMachine.isCurrentState('hurt')) {
      this.stateMachine.setState('idle');
    }
  }

  approached = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('walking') && !this.stateMachine.isCurrentState('hurt')) {
      
      this.stateMachine.setState('walking', {
        from: fromPoint
      });
    }
  }

  hurt = (fromPoint: Phaser.Math.Vector2) => {

    if(!this.stateMachine.isCurrentState('hurt')) {
    
      this.stateMachine.setState('hurt', {
        from: fromPoint
      });
    }
  }

  private onIdleEnter = () => {

    this.enemyState.state = SkeletonState.Idle;
    this.setVelocity(0, 0);
  }

  private onStandingEnter = () => {

    this.enemyState.state = SkeletonState.Standing;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    this.setVelocity(0, 0);
  }

  private onWalkingEnter = () => {

    //get random direction
    const dir = _.random(0, 3) as Direction;

    this.enemyState.dir = dir;
    this.enemyState.state = SkeletonState.Walking;
    this.enemyState.speed = this.speed;
    this.enemyState.alpha = 1;

    if(dir == Direction.East) this.setVelocity(this.enemyState.speed, 0);
    if(dir == Direction.West) this.setVelocity(-this.enemyState.speed, 0);
    if(dir == Direction.North) this.setVelocity(0, -this.enemyState.speed);
    if(dir == Direction.South) this.setVelocity(0, this.enemyState.speed);

    this.scene.time.delayedCall(1000, () => {

      if(this.enemyState.state == SkeletonState.Walking) {
        this.stateMachine.setState('standing');
      }
    })
  }

  private onHurtEnter = (config) => {
    
    this.enemyState.state = SkeletonState.Hurt;
    const impact = config.from as Phaser.Math.Vector2;

    this.enemyState.speed = 300;
    this.enemyState.alpha = 0.5;

    const dx = this.x - impact.x;
    const dy = this.y - impact.y;

    const dir = new Phaser.Math.Vector2();
    dir.setTo(dx, dy).normalize().scale(this.enemyState.speed);
    this.setVelocity(dir.x, dir.y);

    this.scene.time.delayedCall(200, () => {

      if(this.enemyState.health > 0) {
        this.stateMachine.setState('standing');
      }
      else {
        this.enemyState.state = SkeletonState.Dead;
        this.scene.emit('onemenydied', this.enemyState);
      }
    });
  };
}

export class CircleZone extends Phaser.GameObjects.Arc {
  enemy!: Enemy;
}

export class Room {
  
  x: number;
  y: number;
  width: number;
  height: number;
  enemies: Enemy[] = [];
  
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isInRoom = (obj: Phaser.GameObjects.GameObject) => {

    if(this.overlapRect({
      x1: this.x, 
      x2: this.x + this.width, 
      y1: this.y, 
      y2: this.y + this.height
    }, {
      x1: obj.body.position.x, 
      x2: obj.body.position.x + obj.body.gameObject?.width, 
      y1: obj.body.position.y, 
      y2: obj.body.position.y + obj.body.gameObject?.height
    })) {
      return true;
    }

    return false;
  }

  private overlapRect = (a: {x1, x2, y1, y2}, b: {x1, x2, y1, y2}) => {

    // no horizontal overlap
    if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;
  
    // no vertical overlap
    if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;
  
    return true;
  }
}