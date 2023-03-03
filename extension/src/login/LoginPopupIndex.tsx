
import { ChakraProvider, createStandaloneToast, Toast } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { createRoot } from "react-dom/client";
import { AuthPopup, loginReturnType, registrationReturnType } from "./AuthenticationView";
import { googleLogin } from "../api/auth";
import Cookies from 'universal-cookie';

const container = document.createElement("div");
const root = createRoot(container);
container.setAttribute("id", "popup-container");

document.body.appendChild(container);

console.log(process.env.GOOGLE_CLIENT_ID)

// chrome.runtime.onMessage.addListener(({ type, name }) => {
//     if (type === "loginSuccessful") {
//         console.log("yay")
//     }

//     window.close();
// });
// const response = await chrome.runtime.sendMessage


const { ToastContainer, toast } = createStandaloneToast()

const onLoginSuccess = async (e: loginReturnType) => {
    const cookies = new Cookies();

    let api_key = null;

    if (e.source == "google") {
        await googleLogin(e.google_creds.credential).then(token => {
            api_key = token.key
        })
    }
    else if (e.source == "email") {
        api_key = e.emailCredentials.key;
    } else {
        console.log("Unable to detect auth source.")
    }

    if (api_key) {
        let d = new Date();
        d.setTime(d.getTime() + (5 * 60 * 1000));

        cookies.set("unboxr_auth", api_key, { expires: d });
    } else {
        return toast({
            title: 'There was an error logging you in.',
            description: "Please try again. Feel free to contact us if there any other issue!",
            status: "error",
            duration: 2000,
            isClosable: true,
        })
    }

    window.close();
}

const onRegistrationSuccess = (e: registrationReturnType) => {
    onLoginSuccess(e);
}

root.render(
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <ChakraProvider>
            <AuthPopup onLoginSuccess={onLoginSuccess} onRegistrationSuccess={onRegistrationSuccess} />
            <ToastContainer />
        </ChakraProvider>
    </GoogleOAuthProvider>

);