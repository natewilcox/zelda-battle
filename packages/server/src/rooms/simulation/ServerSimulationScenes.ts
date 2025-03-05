import { IEnemyState } from "@natewilcox/zelda-battle-shared";
//import { Bat, CircleZone, Enemy, enemyFactory, Player, Room } from "./Sprites";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { IBattleRoyaleRoomState } from "@natewilcox/zelda-battle-shared";
import { EnemyState } from "../schema/EnemyState";
import { GameTextures, LinkState, textureLookupMap } from "@natewilcox/zelda-battle-shared";
import generateUniqueId  from 'generate-unique-id';
import { NPCState } from "../schema/NPCState";
import { gameInputCache } from "../BattleRoyaleRoom";
import { Player } from "./Sprites";

//import { Player } from "./Sprites";

export const SimulationEvents = new Phaser.Events.EventEmitter();

export class ServerSimulationScene extends Phaser.Scene {

  private map!: Phaser.Tilemaps.Tilemap;
  private ground!: Phaser.Tilemaps.TilemapLayer;

  private players!: Phaser.Physics.Arcade.Group;
  // private enemies!: Phaser.Physics.Arcade.Group;
  // private detectionZones!: Phaser.Physics.Arcade.Group;
  //private rooms: Room[] = [];

  constructor() {
      super('SimulationScene')
  }
  
  // private playerCollidesWithEnemy = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {

  //   // const player = obj1 as Player;
  //   // const enemy = obj2 as Enemy;

  //   // SimulationEvents.emit('onenemycollision', {
  //   //   playerState: player.playerState,
  //   //   enemyState: enemy.enemyState
  //   // });
  // }

  // private enemyCollidesWithWall = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {


  // }

  // private playerApproachesEnemy = (obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) => {

  //   const enemy = (obj2 as CircleZone).enemy as Enemy;
  //   enemy.approached(obj1.body.position as Phaser.Math.Vector2);
  // }

  // emit(eventName: string, args: any) {
  //   SimulationEvents.emit(eventName, args);
  // }

  preload() {

    //create map based on json data
    const mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled('simulationMap', gameInputCache.get('mapJson'), true);
    this.map = new Phaser.Tilemaps.Tilemap(this, mapData);
    this.ground = new Phaser.Tilemaps.TilemapLayer(this, this.map, this.map.getLayerIndex('Ground Layer'), 'dungeon');
    this.ground.setCollisionByProperty({
      collides: true
    });

    // this.detectionZones = this.physics.add.group({
    //   classType: CircleZone
    // });

    // this.players = this.physics.add.group({
    //   classType: Player
    // });

    // this.enemies = this.physics.add.group({
    //   classType: Enemy
    // });

    // this.physics.add.collider(this.enemies, this.ground, this.enemyCollidesWithWall);
    this.physics.add.collider(this.players, this.ground);
    // this.physics.add.overlap(this.players, this.enemies, this.playerCollidesWithEnemy);
    // this.physics.add.overlap(this.players, this.detectionZones, this.playerApproachesEnemy);
  }

  create() {

    //create bats
    SimulationEvents.on('onstatecreated', (state: IBattleRoyaleRoomState) => {
      
      const objects = this.map.getObjectLayer("Item Layer").objects;
      const spawnArea = objects.find(o => o.name == "Spawn Area");
     
      // objects.filter(o => o.type == "Enemy").forEach(enemy => {

      //   const texture = enemy.properties.find(prop => prop.name == 'texture');
      //   const health = enemy.properties.find(prop => prop.name == 'health')?.value;
      //   const speed = enemy.properties.find(prop => prop.name == 'speed')?.value;
      //   const drops = enemy.properties.find(prop => prop.name == 'drops')?.value; 
      //   const itemLoot = drops ? textureLookupMap.get(drops) as GameTextures : undefined;

      //   //console.log(state.enemies)
      //   state.enemies.push(new EnemyState(+generateUniqueId({length: 5,useLetters: false}), health, enemy.x! + (enemy.width!/2), enemy.y!, speed, 1, textureLookupMap.get(texture.value) as GameTextures, 1, itemLoot));
      // });

      // objects.filter(o => o.type == "NPC").forEach(npc => {

      //   const texture = npc.properties.find(prop => prop.name == 'texture');
      //   state.npcs.push(new NPCState(+generateUniqueId({length: 5,useLetters: false}), npc.x! + (npc.width!/2), npc.y!, 'standing', textureLookupMap.get(texture.value) as GameTextures));
      // });

      // objects.filter(o => o.type == "cameraBounds").forEach(cb => {
      //   this.rooms.push(new Room(cb.x, cb.y, cb.width, cb.height));
      // });

      SimulationEvents.emit('onsimulationready', {
        spawnArea: {
          x: spawnArea?.x,
          y: spawnArea?.y,
          w: spawnArea?.width,
          h: spawnArea?.height
        }
      });
    });

    // SimulationEvents.on('onememyadded', (enemyState: IEnemyState) => {
      
    //   //add bat to simluation
    //   const enemy = enemyFactory(enemyState.texture, this, enemyState.x, enemyState.y);
    //   enemy.id = enemyState.id;
    //   enemy.speed = enemyState.speed;
    //   enemy.enemyState = enemyState;

    //   this.enemies.add(enemy);          
    //   enemy.idle();

    //   //create a detection zone to sinse when players are near
    //   const detectionZone = this.add.circle(enemy.x, enemy.y, 50) as CircleZone;
    //   detectionZone.enemy = enemy;
    //   this.detectionZones.add(detectionZone);
    //   enemy.detectionZone = detectionZone;

    //   //add the enemy to the room they are contained in
    //   this.rooms.forEach(room => {

    //     const r = room as Room;

    //     if(r.isInRoom(enemy)) {
    //       r.enemies.push(enemy);
    //     }
    //   });
    // });

    // SimulationEvents.on('onemenydied', (enemyState: IEnemyState) => {
      
    //   //remove bat from simulation
    //   const enemy = this.enemies.getChildren().find(b => (b as Bat).id == enemyState.id) as Enemy;

    //   //destroy objects
    //   enemy.detectionZone.destroy();
    //   enemy.destroy();

    //   //return resources to groups
    //   this.enemies.killAndHide(enemy);
    //   this.detectionZones.killAndHide(enemy.detectionZone);
    //   SimulationEvents.emit('onemenyremoved', { enemyState });
    // });

    SimulationEvents.on('onplayerdied', (playerState: IPlayerState) => {
      
      //remove bat from simulation
      const player = this.players.getChildren().find(p => (p as Player).id == playerState.id) as Player;

      //destroy objects
      player.destroy();
      this.players.killAndHide(player);
      SimulationEvents.emit('onplayerremoved', { playerState });
    });

    SimulationEvents.on('onplayeradded', (playerState: IPlayerState) => {

      const player = this.players.get(playerState.x, playerState.y);
      player.id = playerState.id;
      player.playerState = playerState;
    });

    // SimulationEvents.on('onenemyhurt', (event) => {

    //   const enemy = this.enemies.getChildren().find(e => (e as Enemy).id == event.id) as Enemy;

    //   if(enemy) {
        
    //     const fromPoint = new Phaser.Math.Vector2(event.x, event.y);
    //     enemy.hurt(fromPoint);
    //   }
    // });

    SimulationEvents.on('onplayerhurt', (event: any) => {
      const player = this.players.getChildren().find(p => (p as Player).id == event.id) as Player;

      if(player) {

        const fromPoint = new Phaser.Math.Vector2(event.x, event.y);
        player.hurt(fromPoint);
      }
    });

    this.events.on(Phaser.Scenes.Events.PRE_UPDATE, () => {

      //update where players who are in control of their state
      // this.players.getChildren().forEach(p => {

      //   const player = p as Player;

      //   if(player.playerState.state != LinkState.Hurt) {
      //     player.x = player.playerState.x;
      //     player.y = player.playerState.y;
      //   }
      // });
    });
    
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, () => {
        
      //update players that are controlled by simluation
      // this.players.getChildren().forEach(p => {

      //   const player = p as Player;

      //   if(player.playerState.state == LinkState.Hurt) {
      //     player.playerState.x = player.x;
      //     player.playerState.y = player.y;
      //   }
      // });

      //update state after simulation
      // this.enemies.getChildren().forEach(e => {

      //   const enemy = e as Enemy;

      //   enemy.enemyState.x = enemy.x;
      //   enemy.enemyState.y = enemy.y;
        
      //   //mvoe their detection grid
      //   enemy.detectionZone.setPosition(enemy.x, enemy.y);
      // });
    });
  }

  update(dt: number, t: number) {
    //this.enemies.getChildren().forEach(enemy => enemy.update(dt, t));
  }
}