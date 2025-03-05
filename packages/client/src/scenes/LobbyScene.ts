import Phaser from 'phaser'
import { closeForm, getModeThumbnail, openForm } from '../utils/Utils';
import { ILobbySceneConfig } from './Config';


/**
 * Scene to open lobby
 */
export default class LobbyScene extends Phaser.Scene {

    private selectedGameModeId = -1;
    private lobbyForm;

    /**
     * Constructs scene object
     */
	constructor() {
        super('lobby');
    }


    async preload() {
        this.load.html('lobbyform', 'html/lobbyform.html');
    }


    async create(config: ILobbySceneConfig) {

        const background = this.add.image(200, 150, 'loading-background');
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;
        background.setTint(0x444444)

        this.lobbyForm = this.add.dom(200, 150).createFromCache('lobbyform');
        this.lobbyForm.setPerspective(100);

        this.lobbyForm.addListener('click');
        this.lobbyForm.on('click', (event) => {
            if (event.target.className === 'menuItem') this.changeMenu(event.target.id);

            //events to complete scene
            if (event.target.id === 'playBtn') this.startGame(config);
            if (event.target.id === 'signOutBtn') this.signOut(config);
            if (event.target.id === 'updateHandleBtn') this.changeHandle();
        });

        openForm(this, this.lobbyForm, async () => {
            //this.lobbyForm.getChildByID('handle').value = this.firebase.getUser()?.displayName;

            //set topten
            const topTen = await this.firebase.getTopTen(false);
            this.updateRankingsTab(topTen);

            const details = await this.firebase.getUserDetails(false);
            this.updatePlayTab(details);
            this.updateAccountTab(details);
        });

        //default to play
        this.changeMenu('play');
    }

    private resetSelections = () => {

        const playBtn = this.lobbyForm.getChildByID('playBtn') as HTMLButtonElement;
        playBtn.disabled = true;

        const table = this.lobbyForm.getChildByID('gameTable') as HTMLTableElement;
        for(let r=0;r<table.rows.length;r++) {
            for(let c=0;c<table.rows[r].cells.length;c++) {
                table.rows[r].cells[c].className = 'modeOption';
            }
        }
    }

    private changeHandle = async () => {
        
        const handleField = this.lobbyForm.getChildByID('handle');
        const handleBtn = this.lobbyForm.getChildByID('updateHandleBtn');
        const responseMsg = this.lobbyForm.getChildByID('handleMsg');

        if(handleField && handleBtn && responseMsg) {
            
            const newHandle = handleField.value;
            handleBtn.disabled = true;

            try {
                await this.firebase.updateUser(newHandle);

                responseMsg.innerHTML = "Successful";
                responseMsg.style.color = 'green';
            }
            catch(e) {
                this.lobbyForm.getChildByID('handleMsg').innerHTML = "Failed to update handle";
                responseMsg.style.color = 'red';
            }
            
            handleBtn.disabled = false;
        }
    }

    private startGame = (config: ILobbySceneConfig) => { 
      
        closeForm(this, this.lobbyForm, () => {
            config.onPlay(this.selectedGameModeId);
        });
    };
    
    private signOut = (config: ILobbySceneConfig) => { 

        closeForm(this, this.lobbyForm, () => {
            this.firebase.signOut();
            config.onSignOutStart();

            this.time.delayedCall(1000, () => config.onSignOut());
        });
    };

    private changeMenu = (menu) => {

        this.resetLobby();

        const menuItem = this.lobbyForm.getChildByID(menu);
        menuItem.className = 'menuItem active';

        const panel = this.lobbyForm.getChildByID(`${menu}Menu`);
        panel.style.display = '';
    }

    private resetLobby = () => {
        this.lobbyForm.getChildByID(`playMenu`).style.display = 'none';
        this.lobbyForm.getChildByID(`rankingsMenu`).style.display = 'none';
        this.lobbyForm.getChildByID(`lockerMenu`).style.display = 'none';
        this.lobbyForm.getChildByID(`settingsMenu`).style.display = 'none';
        this.lobbyForm.getChildByID(`accountMenu`).style.display = 'none';

        this.lobbyForm.getChildByID(`play`).className = 'menuItem';
        this.lobbyForm.getChildByID(`rankings`).className = 'menuItem';
        this.lobbyForm.getChildByID(`locker`).className = 'menuItem';
        this.lobbyForm.getChildByID(`settings`).className = 'menuItem';
        this.lobbyForm.getChildByID(`account`).className = 'menuItem';
    }

    private updatePlayTab = (details) => {

        //set player info
        this.lobbyForm.getChildByID('lvl').innerHTML = details ? details.level : 0;
        this.lobbyForm.getChildByID('xp').innerHTML = details ? details.xp.toLocaleString("en-US") : 0;
        this.lobbyForm.getChildByID('matches').innerHTML = details ? details.matches.toLocaleString("en-US") : 0;

        //set game modes to choose from
        const gameIds = details ? details.games : [];
        const table = this.lobbyForm.getChildByID('gameTable') as HTMLTableElement;
        
        if(gameIds.length == 0) {
            const row = table.insertRow();
            const item = row.insertCell();
            item.classList.add('msg');
            item.innerHTML = "<p>You are not permitted to join any matches</p>"
        }

        for(let i=0;i<gameIds.length;i++) {
            
            //add new row every 4 items
            const row = (i % 4 == 0) ? table.insertRow() as HTMLTableRowElement : table.rows[Math.floor(i/4)];
            const item = row.insertCell();
            const thumbnail = getModeThumbnail(gameIds[i]);

            item.classList.add('modeOption');
            item.innerHTML = `<img src="${thumbnail}" />`;
            item.id = gameIds[i];

            item.onclick = (e) => {

                this.resetSelections();

                const img = e.target as HTMLImageElement;
                img.parentElement?.classList.add('selected');

                this.selectedGameModeId = +img.parentElement!.id;

                const playBtn = this.lobbyForm.getChildByID('playBtn') as HTMLButtonElement;
                playBtn.disabled = false;
            }
        }

        this.resetSelections();
    };

    private updateRankingsTab = (players) => {

        const rankings = this.lobbyForm.getChildByID(`leaderBoard`) as HTMLDivElement;
        let html = '';
        let rank = 1;

        players.forEach(player => {

            html += ` <p class="row"><span class="player">${rank++}. ${player.name}</span><span class="score">${player.xp.toLocaleString("en-US")}</span></p>`
        });

        rankings.innerHTML = html;
    };

    private updateAccountTab = (details) => {
        this.lobbyForm.getChildByID('handle').value = details ? details.name : this.firebase.getUser()?.displayName;
    }
}
