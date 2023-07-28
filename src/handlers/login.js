export const login = async (store) => {
    //  Scenarios
    // Anonymous user - no session id. or email in store.user
    // new user - no session id. check if user exists for given email. Or create new user.
    // existing user - has valid & active session id
    // existing user - has vaid session id but it's expired
    // existing user - has session id but it's invalid

    // If session cookie exists
    //     Check if session is present in session store. 
    //          If not, logout user
    //          If yes, redirect to the page with session id in query param
    // If session cookie doesn't exist
    //     Check if user exists for given email.
    //          If yes, add user to session store and redirect to the page with session id in query param
    //          If no, create new user, add user to session store and redirect to the page with session id in query param
    if (store.user.slug) {

        // // Add to session store. TODO - add expiration time
        const sessionID = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/gi, '').substring(0, Math.random() * (63 - 57) + 57)
        await store.env.SESSIONS.put(sessionID, store.user.slug);

        store.resp.headers.append('Set-Cookie', `D_SID=${sessionID}; HttpOnly; path=/; Secure; SameSite=Strict;`)
        store.resp.headers.append('Set-Cookie', `D_UNAME=${store.user.name}; path=/; Secure; SameSite=Strict;`)
        store.resp.headers.append('Set-Cookie', `D_UTHUMB=${store.user.thumb}; path=/; Secure; SameSite=Strict;`)
        store.resp.headers.append('Set-Cookie', `D_UHNRIFIC=${store.user.honorific}; path=/; Secure; SameSite=Strict;`)
        store.resp.headers.append('Set-Cookie', `D_UFLAIR=${store.user.flair}; path=/; Secure; SameSite=Strict;`)
        store.resp.headers.append('Set-Cookie', `D_UROLE=${store.user.role}; path=/; Secure; SameSite=Strict;`)

        store.resp.status = 302
        const redirectTo = new URL(store.request.url).searchParams.get('redirectTo') || "/"
        const dest = `${store.env.HOST}${redirectTo}?trigger=${store.page.fre ? "fre" : "session"}`

        console.log("in Login page", dest)
        // store.resp.headers.append('Location', `${store.env.HOST}/authenticate?redirectTo=${redirectTo}`)
        store.resp.headers.append('Location', dest)


    } else {
        throw new Error(503, { cause: "Login: User slug is not available" })
    }

}