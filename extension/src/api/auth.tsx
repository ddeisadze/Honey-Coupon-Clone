export const googleLogin = async (accesstoken) => {

    const url = "http://localhost:8000/rest-auth/google/";
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            access_token: accesstoken
        }),
    };

    return fetch(url, options)
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

    const url = "http://localhost:8000/rest-auth/register/";
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            email: email,
            username: email,
            password1: password,
            password2: password

        }),
    };

    return fetch(url, options)
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

    const url = "http://localhost:8000/rest-auth/login/";
    const options = {
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
    };

    return fetch(url, options)
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