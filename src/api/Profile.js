import { apiFetch } from "./ApiClient";

export const create = async (context, profile) => {
    const [response, data, error] = await apiFetch(context, "/profile", "POST", profile);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const check_password = async (context, profileId, password) => {
    const [response, data, error] = await apiFetch(context, "/profile/" + profileId + "/check_password", "POST", { password: password });
    if(!error && response.status == 200) {
        return true;
    }
    return false;
};

export const get = async (context) => {
    const [response, data, error] = await apiFetch(context, "/profile");
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const update = async (context, profile) => {
    const [response, data, error] = await apiFetch(context, "/profile/" + profile.id, "PUT", profile);
    if(!error && response.status == 200) {
        return data;
    }
    return null;
};

export const destroy = async (context, profileId) => {
    const [response, data, error] = await apiFetch(context, "/profile/" + profileId, "DELETE");
    if(!error && response.status == 200) {
        return true;
    }
    return false;
};