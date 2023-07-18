export const raiseError = async () => {
    throw new Error(418, { cause: "This is TEAPOT!" })
}