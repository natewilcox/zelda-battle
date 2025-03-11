/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import { listen } from "@colyseus/tools";
export { BattleRoyaleRoom } from "./rooms/BattleRoyaleRoom"

// Import Colyseus config
import app from "./app.config";

// Create and listen on 2567 (or PORT environment variable.)
if(process.env.LOCAL_DEV) {
    console.log('running local embedded server');
    listen(app);
}