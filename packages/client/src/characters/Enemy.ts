/**
 * Enemy Class
 */
 export default class Enemy extends Phaser.Physics.Arcade.Sprite {

   
    id!: number;
    
    /**
     * Creats a new enemy
     * 
     * @param scene 
     * @param x 
     * @param y 
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}