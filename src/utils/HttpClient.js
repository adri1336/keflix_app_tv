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