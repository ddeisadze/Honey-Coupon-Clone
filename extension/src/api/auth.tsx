export const googleLogin = async (accesstoken) => {

    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const base = new URL("/", process.env.BACKEND_HOSTNAME)
    const route = new URL(`rest-auth/google/`, base);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        signal: controller.signal,
        body: JSON.stringify({
            access_token: accesstoken
        }),
    };

    return fetch(route.href, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json().catch(err => {
                    console.error(`'${err}' happened, but no big deal!`);
                    return {};
                })
            }

            console.log("error", response)
            return response.json().then(err => Promise.reject(err));
        })
        .then((data) => {
            return data;
        })
};

export const emailRegistration = async ({ email, password }) => {

    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const base = new URL("/", process.env.BACKEND_HOSTNAME)
    const route = new URL(`rest-auth/register/`, base);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        signal: controller.signal,
        body: JSON.stringify({
            email: email,
            username: email,
            password1: password,
            password2: password
        }),
    };

    return fetch(route.href, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json().catch(err => {
                    console.error(`'${err}' happened, but no big deal!`);
                    return {};
                })
            }

            console.log("error", response)
            return response.json().then(err => Promise.reject(err));
        })
        .then((data) => {
            return data;
        })
};

export const emailLogin = async ({ email, password }) => {

    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const base = new URL("/", process.env.BACKEND_HOSTNAME)
    const route = new URL(`rest-auth/login/`, base);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            email: email,
            username: email,
            password: password
        }),
        signal: controller.signal,
    };

    return fetch(route.href, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json().catch(err => {
                    console.error(`'${err}' happened, but no big deal!`);
                    return {};
                })
            }

            return response.json().then(err => Promise.reject(err));
        })
        .then((data) => {
            return data;
        })
};