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


//Code
export async function get(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return [response, data, null];
    }
    catch(error) {
        return [null, null, error];
    }
}

export async function post(url, bodyData) {
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });
        let data = await response.json();
        return [response, data, null];
    }
    catch(error) {
        return [null, null, error];
    }
}

export async function http_delete(url, bodyData = null) {
    try {
        let response = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });
        let data = await response.json();
        return [response, data, null];
    }
    catch(error) {
        return [null, null, error];
    }
}

export async function put(url, bodyData) {
    try {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });
        let data = await response.json();
        return [response, data, null];
    }
    catch(error) {
        return [null, null, error];
    }
}