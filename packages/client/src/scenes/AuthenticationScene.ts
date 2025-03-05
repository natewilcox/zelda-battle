import Phaser from 'phaser'
import { SceneEvents } from '../events/SceneEvents';
import { closeForm, openForm } from '../utils/Utils';
import { IAuthenticationSceneConfig } from './Config';
//import { LoadingState } from './LoadingScene';


/**
 * Scene to authenticate the user
 */
export default class AuthenticationScene extends Phaser.Scene {


    private loginForm;

    /**
     * Constructs scene object
     */
	constructor() {
        super('auth');
    }


    preload() {
        this.load.html('loginform', 'html/loginform.html');
    }


    async create(config: IAuthenticationSceneConfig) {

        const background = this.add.image(200, 150, 'loading-background');
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;
        background.setTint(0x444444)

        if(this.firebase.getUser()) {

            config.onAuthStart();

            //get player data and top ten and continue when done.
            await Promise.all([this.firebase.getUserDetails(true), this.firebase.getTopTen(true)]);
            
            this.time.delayedCall(1000, () => config.onSuccess());
        }
        else {
            this.showLoginForm(async () => {

                config.onAuthStart();
                
                //get player data and top ten and continue when done.
                await Promise.all([this.firebase.getUserDetails(true), this.firebase.getTopTen(true)]);

                this.time.delayedCall(1000, () => config.onSuccess());
            });
        }
    }

    private showLoginForm = (cb: (user) => void) => {

        const fb = this.firebase;

        this.loginForm = this.add.dom(200, 150).createFromCache('loginform') as Phaser.GameObjects.DOMElement;
        this.loginForm.setPerspective(100);
        this.loginForm.addListener('click');
        this.loginForm.addListener('keypress');

        const tryGoogleLogin = async () => {

            try {
                fb.signInUserWithGoogle(async (user) => {
                    closeForm(this, this.loginForm, () => cb(user));
                });
            }
            catch(e) {
                console.error("Error with authentication");
            }
        };

        const tryFacebookLogin = async () => {

            try {
                fb.signInUserWithFacebook(async (user) => {
                    closeForm(this, this.loginForm, () => cb(user));
                });
            }
            catch(e) {
                console.error("Error with authentication");
            }
        };

        const tryFacebookTwitter = async () => {

            try {
                fb.signInUserWithTwitter(async (user) => {
                    closeForm(this, this.loginForm, () => cb(user));
                });
            }
            catch(e) {
                console.error("Error with authentication");
            }
        };



        this.loginForm.on('click', async (event) => {
        
            if (event.target.id === 'loginWithGoogle' || event.target.parentNode.id == 'loginWithGoogle') {
                await tryGoogleLogin();
            }

            if (event.target.id === 'loginWithFacebook' || event.target.parentNode.id == 'loginWithFacebook') {
                await tryFacebookLogin();
            }

            if (event.target.id === 'loginWithTwitter' || event.target.parentNode.id == 'loginWithTwitter') {
                await tryFacebookTwitter();
            }
        });

        openForm(this, this.loginForm, () => {});
    };
}
