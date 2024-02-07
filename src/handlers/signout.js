export const signout = async (ctx) => {

    // remove cookies
    ctx.res.headers.append('Set-Cookie', `D_SID=""; HttpOnly; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    ctx.res.headers.append('Set-Cookie', `D_FRE=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    ctx.res.headers.append('Set-Cookie', `D_NEW_SESSION=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)

    // redirect to homepage
    ctx.res.status = 302
    ctx.res.headers.append('Location', `${ctx.env.HOST}`)
}