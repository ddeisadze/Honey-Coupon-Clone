
export const getAuthToken = async () => {
    const token_obj = await chrome.storage.sync.get("unboxr_auth");

    return token_obj["unboxr_auth"];
}

export const isUserLoggedIn = async () => {
    const authToken: object = await getAuthToken()
    return authToken != null && Object.keys(authToken).length !== 0;
}

export const clearAuthToken = async () => {
    await chrome.storage.sync.clear();
    return await chrome.storage.sync.remove("unboxr_auth");
}