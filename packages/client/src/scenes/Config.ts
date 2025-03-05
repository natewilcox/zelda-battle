import ComponentService from "../services/ComponentService";
import ServerService from "../services/ServerService";

export interface IGameSceneConfig {
    gameMode: number;
    componentService: ComponentService;
    serverService: ServerService;
    onPlayAgain: (gameMode: number) => void,
    onReturnToLobby: () => void,
    onGameError: () => void,
}

export interface IAuthenticationSceneConfig {
    onAuthStart: () => void;
    onSuccess: () => void;
}

export interface ILobbySceneConfig {
    onPlay: (gameMode: number) => void; 
    onSignOutStart: () => void;
    onSignOut: () => void;
}

export interface IErrorSceneConfig {
    message: string
}

export interface ILoadingSceneConfig {
    defaultState: string,
    hint: string,
    map: string
}