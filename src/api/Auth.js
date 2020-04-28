import { _fetch } from "cuervo/src/utils/HttpClient";

export const connection = async () => { //retorna 1 si hay éxito, 0 en caso contrario
    const [response, data, error] = await _fetch("/auth/connection");
    if(!error && response.status == 200) {
        return true;
    }
    return false;
};

export const login = async (account) => { //retorna objecto: { account, access_token, refresh_token }
    const [response, data, error] = await _fetch("/auth/login", "POST", null, account);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const register = async (account) => {
    const [response, data, error] = await _fetch("/auth/register", "POST", null, account);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const token = async (refreshToken) => {
    const [response, data, error] = await _fetch("/auth/token", "POST", null, { refresh_token: refreshToken });
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};