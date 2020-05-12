import { apiFetch } from "./ApiClient";

export const discover = async (context, search = null, sort_by = null) => {
    const [response, data, error] = await apiFetch(context, "/movie/discover", "POST", {
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

export const getTrailer = (context, id_movie) => {
    return context.state.server + "/api/movie/" + id_movie + "/trailer.mp4?token=" + context.state.accessToken;
};

export const getVideo = (context, id_movie) => {
    return context.state.server + "/api/movie/" + id_movie + "/video.mp4?token=" + context.state.accessToken;
};

export const getPoster = (context, id_movie) => {
    return context.state.server + "/api/movie/" + id_movie + "/poster.png?token=" + context.state.accessToken;
};

export const getBackdrop = (context, id_movie) => {
    return context.state.server + "/api/movie/" + id_movie + "/backdrop.png?token=" + context.state.accessToken;
};

export const getLogo = (context, id_movie) => {
    return context.state.server + "/api/movie/" + id_movie + "/logo.png?token=" + context.state.accessToken;
};