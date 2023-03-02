
chrome.runtime.onStartup.addListener(function () {

    console.log("hello")
})

const loginTabId = Math.random()

// chrome.webRequest.onBeforeRequest.addListener((op) => {

//     op.requestBody.
// }, {
//     urls: [`${process.env.BACKEND_HOSTNAME}/*`]
// },
//     ["Authorization", 'Token ' + await getAuthToken()]
// )


// chrome.webRequest.onBeforeSendHeaders.addListener(async (a) => {
//     const tokenValue = await chrome.cookies.get({
//         name: "unboxr_auth",
//         url: process.env.COOKIE_URL
//     });

//     console.log(tokenValue, "token value")

//     a.requestHeaders["Authorization"] = 'Token ' + tokenValue
// }, {
//     urls: [`${process.env.BACKEND_HOSTNAME}/*`]
// });


chrome.runtime.onMessage.addListener(async ({ type, name }, { tab }) => {
    if (type == "login") {
        var a = chrome.windows.create(
            {
                type: "popup",
                url: process.env.LOGIN_POPUP_URL,
                height: 500,
                width: 400,
            }
        ).then(async a => {
            const tokenValue = await chrome.cookies.get({
                name: "unboxr_auth",
                url: process.env.COOKIE_URL
            })


            await chrome.storage.sync.set({ "unboxr_auth": tokenValue.value })

            chrome.windows.onRemoved.addListener(async (windowId) => {
                if (windowId == a.id) {
                    const tokenValue = await chrome.cookies.get({
                        name: "unboxr_auth",
                        url: process.env.COOKIE_URL
                    });

                    if (tokenValue) {
                        const message: OnLoginMessageToExtension = {
                            type: "login",
                            status: "successful"
                        };
                        chrome.tabs.sendMessage(tab.id, message);
                    } else {
                        const message: OnLoginMessageToExtension = {
                            type: "login",
                            status: "unsuccessful",
                            reason: "Token missing."
                        };
                        chrome.tabs.sendMessage(tab.id, message);
                    }
                }
            }, {
                windowTypes: ["popup"]
            })
        })

    }
    else if (type == "get_auth_cookie") {
        const tokenValue = await chrome.cookies.get({
            name: "unboxr_auth",
            url: process.env.COOKIE_URL
        });

        chrome.tabs.sendMessage(tab.id, { type: "get_auth_cookie", token: tokenValue });
    }
    else {
        console.log("Unrecognized")
    }
});


// chrome.runtime.onMessage.addListener(
//     function (request, sender) {
//         const tabId = sender.tab.id;

//         if (request.action == "login") {

//         } else {
//             console.log("Unrecognized")
//         }
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting === "hello")
//             sendResponse({ farewell: "goodbye" });

//         (async () => {
//             const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
//             const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
//             // do something with response here, not outside the function
//             console.log(response);
//         })();
//     }
// );
