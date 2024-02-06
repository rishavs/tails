export const signout = async (store) => {
    store.resp.content = "Logging Out..." // TODO - replace with a spinner

    // // destroy session
    // if (store.page.cookies.D_SID) {
    //     console.log(`Deleting session ${store.page.cookies.D_SID}`)
    //     await store.env.SESSIONS.delete(store.page.cookies.D_SID)
    // }
    
    // // remove cookies
    // store.resp.headers.append('Set-Cookie', `D_SID=""; HttpOnly; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    // store.resp.headers.append('Set-Cookie', `D_UNAME=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    // store.resp.headers.append('Set-Cookie', `D_UTHUMB=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    // store.resp.headers.append('Set-Cookie', `D_UHNRIFIC=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    // store.resp.headers.append('Set-Cookie', `D_UFLAIR=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)
    // store.resp.headers.append('Set-Cookie', `D_UROLE=""; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT;`)

    // redirect to homepage
    store.resp.status = 302
    store.resp.headers.append('Location', `${store.env.HOST}`)
}