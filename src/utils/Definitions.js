//Vars
export default {
    PRIMARY_COLOR: 0x000000FF, //0x141414FF,
    SECONDARY_COLOR: 0xB8822FFF,
    TEXT_COLOR: 0xFFFFFFFF,
    DEFAULT_MARGIN: 8,
    PASSWORD_MIN_LENGTH: 3,
    PIN_PASSWORD_LENGTH: 4,
    APPLICATION_WEBPAGE: "https://github.com/adri1samp/",
    APPLICATION_NAME: "Keflix"
};

export const DEFAULT_SIZES = {
    BIG_TITLE_SIZE: 5.0,
    TITLE_SIZE: 3.5,
    BIG_SIZE: 1.6,
    BIG_SUBTITLE_SIZE: 1.5,
    NORMAL_SIZE: 1.3,
    MEDIUM_SIZE: 1.1,
    SMALL_SIZE: 0.9
};

export const NAVIGATORS = {
	CONNECT: 0,
    AUTH: 1,
    PROFILE: 2,
    MAIN: 3
};

export const STORAGE_KEYS = {
    EMAIL: "email",
    PASSWORD: "password",

    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token"
}

export const MEDIA_DEFAULT = {
    MIN_MILLIS: 60000, //se considera que ha empezado a ver la película cuando lleva más de 1 min
    REMAINING_MILLIS: 600000, //cuando queden 10 minutos para que acabe la película se considerada terminada
    PLAYBACK_UPDATE_PROFILE_INFO_INTERVAL: 10000 //actualizar por donde va cada 10s
};

export const CONFIG = {
    MAX_BACKGROUND_TIME: 300000 //si la app esta más de 5 minutos en segundo plano, al abrirla se cerrara el perfil
};