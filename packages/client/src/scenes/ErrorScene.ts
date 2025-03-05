import Phaser from 'phaser'
import { openForm } from '../utils/Utils';
import { IErrorSceneConfig } from './Config';


/**
 * Scene to display error
 */
export default class ErrorScene extends Phaser.Scene {


    private errorForm;

    /**
     * Constructs scene object
     */
	constructor() {
        super('error');
    }


    preload() {
        this.load.html('errorform', 'html/errorform.html');
    }


    create(config: IErrorSceneConfig) {

        const background = this.add.image(200, 150, 'loading-background');
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;
        background.setTint(0x444444)

        this.errorForm = this.add.dom(200, 150).createFromCache('errorform');
        this.errorForm.setPerspective(100);
        this.errorForm.getChildByID('errorMsg').innerHTML = config.message;

        openForm(this, this.errorForm, () => {
        });
    }
}
