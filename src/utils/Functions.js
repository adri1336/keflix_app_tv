import i18n from "i18n-js";
import * as Tv from "app/src/api/Tv";

//Code
export function isValidEmail(email) {
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

export function capitalizeFirstLetter(text) {
    return (text[0].toUpperCase() + text.slice(1));
}

export function timeConvert(sec) {
    return {
        hours: Math.floor(sec / 3600),
        minutes: Math.floor(sec % 3600 / 60),
        seconds: Math.floor(sec % 3600 % 60)
    };
}

export function timeConvertFormatted(sec) {
    const { hours, minutes, seconds } = timeConvert(sec);
    return (hours ? (hours + ":") : "") + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

export function setStateIfMounted(context, state, callback = null) {
    if(context._isMounted) {
        context.setState(state, callback);
    }
}

export function forceUpdateIfMounted(context) {
    if(context._isMounted) {
        context.forceUpdate();
    }
}

export function hoursMinutesFormat(sec) {
    const { hours, minutes } = timeConvert(sec);
    
    if(hours > 1 && minutes > 1) return i18n.t("functions.hour_minutes_format.hours_minutes", { hours: hours, minutes: minutes });
    else if(hours > 1 && minutes == 1) return i18n.t("functions.hour_minutes_format.hours_minute", { hours: hours, minutes: minutes });
    else if(hours == 1 && minutes > 1) return i18n.t("functions.hour_minutes_format.hour_minutes", { hours: hours, minutes: minutes });
    else if(hours == 1 && minutes == 1) return i18n.t("functions.hour_minutes_format.hour_minute", { hours: hours, minutes: minutes });
    else if(hours == 0 && minutes > 1) return i18n.t("functions.hour_minutes_format.minutes", { minutes: minutes });
    else if(hours == 0 && minutes == 1) return i18n.t("functions.hour_minutes_format.minute", { minutes: minutes });
    else if(hours > 1 && minutes == 0) return i18n.t("functions.hour_minutes_format.hours", { hours: hours });
    else if(hours == 1 && minutes == 0) return i18n.t("functions.hour_minutes_format.hour", { hours: hours });
    return i18n.t("functions.hour_minutes_format.nothing");
}

export function getEpisodeIndexFromInfo(tv, season, episodeNumer) {
    const episodes = tv.episode_tvs;
    for (let index = 0; index < episodes.length; index++) {
        const episode = episodes[index];
        if(episode.season === season && episode.episode === episodeNumer) {
            return index;
        }
    };
    return -1;
}

export function getMediaUris(context, tv) {
    let season = tv.firstSeason,
        episode = tv.firstEpisode;

    if(tv.profileInfo && tv.profileInfo.season !== -1 && tv.profileInfo.episode !== -1) {
        season = tv.profileInfo.season;
        episode = tv.profileInfo.episode;
    }

    const episodeIndex = getEpisodeIndexFromInfo(tv, season, episode);
    let backdrop = tv.mediaInfo.backdrop ? Tv.getBackdrop(context, tv.id) : null;
    if(episodeIndex !== -1 && tv.profileInfo && tv.profileInfo.season !== -1 && tv.profileInfo.episode !== -1 && tv.episode_tvs[episodeIndex].mediaInfo.backdrop) {
        backdrop = Tv.getEpisodeBackdrop(context, tv.id, season, episode);
    }
    
    return {
        video: Tv.getEpisodeVideo(context, tv.id, season, episode),
        trailer: Tv.getTrailer(context, tv.id),
        logo: Tv.getLogo(context, tv.id),
        backdrop: backdrop,
        episodeIndex: episodeIndex,
        season: season,
        episode: episode
    };
}