import { apiFetch } from "./ApiClient";
import { SERVER_API_IP } from "cuervo/src/utils/HttpClient";

export const discover = async (context) => {
    const [response, data, error] = await apiFetch(context, "/movie/discover", "POST", { include_no_published: true });
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const getTrailer = (context, id_movie) => {
    return SERVER_API_IP + "/api/movie/" + id_movie + "/trailer.mp4?token=" + context.state.accessToken;
};

export const getVideo = (context, id_movie) => {
    return SERVER_API_IP + "/api/movie/" + id_movie + "/video.mp4?token=" + context.state.accessToken;
};

export const getPoster = (context, id_movie) => {
    return SERVER_API_IP + "/api/movie/" + id_movie + "/poster.png?token=" + context.state.accessToken;
};

export const getBackdrop = (context, id_movie) => {
    return SERVER_API_IP + "/api/movie/" + id_movie + "/backdrop.png?token=" + context.state.accessToken;
};

export const getLogo = (context, id_movie) => {
    return SERVER_API_IP + "/api/movie/" + id_movie + "/logo.png?token=" + context.state.accessToken;
};