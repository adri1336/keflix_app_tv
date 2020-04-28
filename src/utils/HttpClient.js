//Vars
const SERVER_API_IP = "http://192.168.1.41:3000";

//Code
export const _fetch = async (path, method = "GET", token = null, body = null) => {
    try {
        const response = await fetch(SERVER_API_IP + "/api" + path, {
            method: method,
            headers: {
                Accept: "application/json",
                "Authorization": token ? "Bearer " + token : null,
                "Content-Type": "application/json"
            },
            body: body ? JSON.stringify(body) : null
        });

        let data = null;
        try {
            data = await response.json();
        }
        finally {
            return [response, data, null];
        }
    }
    catch(error) {
        return [null, null, error];
    }
};

export const apiFetch = async (context, path, method = "GET", body = null) => {
    try {
        let { accessToken, refreshToken } = context.state;
        if(!accessToken || !refreshToken) {
            throw "no tokens provided";
        }

        let [response, data, error] = await _fetch(path, method, accessToken, body);
        if(!error && response.status == 403) {
            //request new token
            let [response, data, error] = await _fetch("/auth/token", "POST", null, { refresh_token: refreshToken });
            if(!error && response.status == 200) {
                //nuevos tokens
                accessToken = data.token;
                refreshToken = data.refresh_token;
                context.funcs.setNewTokens(accessToken, refreshToken);
                return await _fetch(path, method, accessToken, body);
            }
            else {
                context.funcs.logout();
                return [response, data, error];
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