import Bootstrap from './scenes/Bootstrap'
import GameScene from './scenes/GameScene'
import HUD from './scenes/HUD'
import LoadingScene from './scenes/LoadingScene'
import Preloader from './scenes/Preloader'
import ErrorScene from './scenes/ErrorScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	banner: false,
	width: 400,
	height: 300,
	dom: {
        createContainer: true
    },
	physics: {
		default: 'arcade',
		arcade: {
			tileBias: 8,
			gravity: { x: 0, y: 0 },
			debug: false,
			fixedStep: false
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
        parent: 'gameDiv',
        autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 2
	},
	scene: [Preloader, Bootstrap, LoadingScene, GameScene, HUD, ErrorScene]
}

export default new Phaser.Game(config)