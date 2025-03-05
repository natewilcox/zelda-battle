import _ from 'lodash';
import { Schema, type } from "@colyseus/schema";
import { IPlayerState } from "@natewilcox/zelda-battle-shared";
import { GameTextures } from "@natewilcox/zelda-battle-shared";
import { INPCState } from "@natewilcox/zelda-battle-shared";
import { TalkCommand } from "../../commands/TalkCommand";
import { Dispatcher } from "@colyseus/command";
import { BattleRoyaleRoom } from '../BattleRoyaleRoom';

class Chat {

  prevChat?: Chat;
  nextChat?: Chat;
  msg: string;

  constructor(msg: string, prevChat?: Chat, nextChat?: Chat) {
    this.msg = msg;
    this.prevChat = prevChat;
    this.nextChat = nextChat;
  }
}

const timmyDialog = {

  friendly1: {
    msg: "Hi there, {name}",
  },

  friendly2: {
    msg: "Hi {name}",
  },

  unfriendly1: {
    msg: "I can't talk to you",
  }
}

export class NPCState extends Schema implements INPCState {

  @type('number')
  id: number;

  @type('number')
  x: number;

  @type('number')
  y: number;

  @type('string')
  anim: string;

  @type('number')
  texture: GameTextures;

  playersNearMe: IPlayerState[] = [];
  
  processEvent?: () => void;

  constructor(id: number, x: number, y: number, anim: string, texture: GameTextures) {
    super();
    
    this.id = id;
    this.x = x;
    this.y = y;
    this.anim = anim;
    this.texture = texture;
  }

  processNearPlayers(players: IPlayerState[], dispatcher: Dispatcher<BattleRoyaleRoom>) {

    const oldPlayers = _.intersection(players, this.playersNearMe);
    const newPlayers = _.difference(players, this.playersNearMe);


    //talk to new players
    newPlayers.forEach(p => {

      if(this.processEvent) {
        this.processEvent();
      }

      // dispatcher.dispatch(new TalkCommand().setPayload({
      //   id: this.id,
      //   msg: `It's dangerous to go alone. Take this!`
      // }));
    });

    //store the current list of players seen by the npc
    this.playersNearMe = players;
  }

  onProcess = (cb: () => void) => {
    this.processEvent = cb;
  }
}