import { apiFetch } from "./ApiClient";

export const discover = async (context, search = null, sort_by = null) => {
    const [response, data, error] = await apiFetch(context, "/tv/discover", "POST", {
        profile_id: context.state.profile.id,
        include_adult: context.state.profile.adult_content,
        search: search,
        sort_by: sort_by
    });
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const getTrailer = (context, id_tv) => {
    return context.state.server + "/api/tv/" + id_tv + "/trailer.mp4?token=" + context.state.accessToken;
};

export const getEpisodeVideo = (context, id_tv, season, episode) => {
    return context.state.server + "/api/tv/" + id_tv + "/" + season + "/" + episode + "/video.mp4?token=" + context.state.accessToken;
};

export const getEpisodeBackdrop = (context, id_tv, season, episode) => {
    return context.state.server + "/api/tv/" + id_tv + "/" + season + "/" + episode + "/backdrop.png?token=" + context.state.accessToken;
};

export const getPoster = (context, id_tv) => {
    return context.state.server + "/api/tv/" + id_tv + "/poster.png?token=" + context.state.accessToken;
};

export const getBackdrop = (context, id_tv) => {
    return context.state.server + "/api/tv/" + id_tv + "/backdrop.png?token=" + context.state.accessToken;
};

export const getLogo = (context, id_tv) => {
    return context.state.server + "/api/tv/" + id_tv + "/logo.png?token=" + context.state.accessToken;
};