export const createSession = (ctx) => {
    // if db has user details, add to ctx
    // else return ctx without user info

    console.log("Creating new session...")

    ctx.res.status = 200
    ctx.res.content = JSON.stringify({ message: "Hello from the API" })

}