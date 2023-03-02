
interface OnLoginMessageToExtension {
    type: "login",
    status: "successful" | "unsuccessful",
    reason?: string
}