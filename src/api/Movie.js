import { apiFetch } from "./ApiClient";

export const discover = async (context) => {
    const [response, data, error] = await apiFetch(context, "/movie/discover", "POST", { include_no_published: true });
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};