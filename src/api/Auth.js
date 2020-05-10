import { _fetch } from "cuervo/src/utils/HttpClient";

export const connection = async (server) => { //retorna 1 si hay éxito, 0 en caso contrario
    const [response, data, error] = await _fetch(server, "/auth/connection");
    if(!error && response.status == 200) {
        return true;
    }
    return false;
};

export const login = async (server, account) => { //retorna objecto: { account, access_token, refresh_token }
    const [response, data, error] = await _fetch(server, "/auth/login", "POST", null, account);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const register = async (server, account) => {
    const [response, data, error] = await _fetch(server, "/auth/register", "POST", null, account);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const token = async (server, refreshToken) => {
    const [response, data, error] = await _fetch(server, "/auth/token", "POST", null, { refresh_token: refreshToken });
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};