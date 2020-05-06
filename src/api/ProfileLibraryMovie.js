import { apiFetch } from "./ApiClient";

export const upsert = async (context, body) => {
    const [response, data, error] = await apiFetch(context, "/profile_library_movie", "POST", body);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const defaultObject = (context, libraryMovieId) => {
    const profileId = context.state.profile.id;
    return {
        completed: false,
        current_time: 0,
        fav: false,
        profileId: profileId,
        libraryMovieId: libraryMovieId
    };
}