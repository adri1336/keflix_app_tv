//Imports
import { _fetch } from "cuervo/src/utils/HttpClient";
import * as Auth from "./Auth";

export const apiFetch = async (context, path, method = "GET", body = null) => {
    try {
        let { accessToken, refreshToken } = context.state;
        if(!accessToken || !refreshToken) {
            throw "no tokens provided";
        }

        let [response, data, error] = await _fetch(path, method, accessToken, body);
        if(!error && response.status == 403) {
            //request new token
            const data = await Auth.token(refreshToken);
            if(data) {
                const { access_token, refresh_token } = data;
                context.funcs.setNewTokens(access_token, refresh_token);
                return await _fetch(path, method, access_token, body);
            }
            else {
                context.funcs.logout();
                return [null, null, null];
            }
        }
        else {
            return [response, data, error];
        }
    }
    catch(error) {
        return [null, null, error];
    }
};