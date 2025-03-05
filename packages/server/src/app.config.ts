import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { BattleRoyaleRoom } from "./rooms/BattleRoyaleRoom";
import { OnJoinCommand } from "./commands/OnJoinCommand";
// import { StartGameCommand } from "./commands/StartGameCommand";
//import { simulationConfig } from "./rooms/simulation/ServerSimulationScenes";

export const mapFiles = new Map([
    ['overworld1', '../../maps/overworld1.json'],
    ['overworld2', '../../maps/overworld2.json'],
    ['testing', '../../maps/testing.json'],
    ['dungeon1', '../../maps/dungeon1.json']
]);

/**
 * Import your Room files
 */

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('room_1', BattleRoyaleRoom, { 
            mapName: 'overworld1', 
            minClients: 2,
            maxClients: 10,
            joinCommand: OnJoinCommand,
            //startCommand: StartGameCommand,
            //simulationConfig: simulationConfig,
        });

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
