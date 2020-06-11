import { _fetch } from "app/src/utils/HttpClient";
import { apiFetch } from "./ApiClient";

export const getPassToken = async (server, accessToken) => {
    const [response, data, error] = await _fetch(server, "/account", "GET", accessToken);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const check_password = async (context, password) => {
    const [response, data, error] = await apiFetch(context, "/account/check_password", "POST", { password: password });
    if(!error && response.status == 200) {
        return true;
    }
    return false;
};