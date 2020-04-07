//Code
export async function get(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return [response, data, null];
    }
    catch (error) {
        return [null, null, error];
    }
}