import { apiFetch } from "./ApiClient";

export const upsert = async (context, body) => {
    const [response, data, error] = await apiFetch(context, "/profile_tv", "POST", body);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const favs = async (context, profileId) => {
    const [response, data, error] = await apiFetch(context, "/profile_tv/" + profileId + "/favs", "GET");
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const defaultObject = (context, tvId, season, episode) => {
    const profileId = context.state.profile.id;
    if(season === undefined) season = -1;
    if(episode === undefined) episode = -1;
    return {
        season: season,
        episode: episode,
        current_time: 0,
        fav: false,
        profileId: profileId,
        tvId: tvId
    };
}