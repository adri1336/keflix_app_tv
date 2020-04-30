//Vars
export const REQUEST_TIMEOUT_ERROR_CODE = 504;
const SERVER_API_IP = "http://192.168.1.41:3000";
const FETCH_TIMEOUT = 5000;

//Code
const timeout = (time, promise) => {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            let error = new Error("Request timed out.");
            error.code = REQUEST_TIMEOUT_ERROR_CODE;
            reject(error);
        }, time);
        promise.then(resolve, reject);
    });
}

export const _fetch = async (path, method = "GET", token = null, body = null) => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
        const response = await timeout(FETCH_TIMEOUT, fetch(SERVER_API_IP + "/api" + path, {
            method: method,
            signal: signal,
            headers: {
                Accept: "application/json",
                "Authorization": token ? "Bearer " + token : null,
                "Content-Type": "application/json"
            },
            body: body ? JSON.stringify(body) : null
        }));

        let data = null;
        try {
            data = await response.json();
        }
        finally {
            return [response, data, null];
        }
    }
    catch(error) {
        controller.abort();
        return [null, null, error];
    }
};

