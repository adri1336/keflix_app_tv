import { _fetch } from "cuervo/src/utils/HttpClient";
import { apiFetch } from "./ApiClient";

export const getPassToken = async (accessToken) => {
    const [response, data, error] = await _fetch("/account", "GET", accessToken);
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