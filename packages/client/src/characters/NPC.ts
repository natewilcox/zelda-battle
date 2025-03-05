/**
 * NPC Class
 */
export default class NPCharacter extends Phaser.GameObjects.Sprite {

   
    id!: number;
    
    /**
     * Creats a new npc
     * 
     * @param scene 
     * @param x 
     * @param y 
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}