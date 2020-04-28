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

