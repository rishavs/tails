import * as jose from 'jose'
import { parseCookie } from '../utils.js'
import { addGoogleUser } from '../database.js'

export const signinGoogleUser = async (store) => {

    let data = await store.request.formData()

    let CSRFTokenInCookie = parseCookie(store.request.headers.get('cookie')).g_csrf_token
    let CSRFTokenInPost = data.get('g_csrf_token')
    let IDToken = data.get('credential')

    data.forEach((value, key) => {
        console.log(`${key} ==> ${value}`);
    })

    // console.log(`CSRFTokenInCookie: ${CSRFTokenInCookie}`)
    // console.log(`CSRFTokenInPost: ${CSRFTokenInPost}`)
    // console.log(`IDToken: ${IDToken}`)

    // Display the key/value pairs
    // store.request.headers.forEach((value, key) => {
    //     console.log(`${key} ==> ${value}`);
    // });

    let cookies = parseCookie(store.request.headers.get('cookie'))


    // ------------------------------------------
    // Verify CSRF
    // ------------------------------------------
    if (!CSRFTokenInCookie) {
        throw new Error(503, { cause: "No CSRF token present in the google cookie" })
    }
    if (!CSRFTokenInPost) {
        throw new Error(503, { cause: "No CSRF token present in the post body" })
    }

    if (CSRFTokenInCookie != CSRFTokenInPost) {
        throw new Error(503, { cause: "CSRF token mismatch" })
    } 

    console.log(`CSRF OK as "${cookies.g_csrf_token}" == "${data.get('g_csrf_token')}"`)

    // ------------------------------------------
    // Verify the ID Token
    // ------------------------------------------
    const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

    const { payload, protectedHeader } = await jose.jwtVerify(IDToken, JWKS, {
        issuer: 'https://accounts.google.com',
        audience: store.env.GOOGLE_KEY
    })

    // ------------------------------------------
    // Verify the nonce
    // ------------------------------------------

    if (!payload.nonce) {
        throw new Error(503, { cause: "No nonce present in the ID token" })
    }
    // if (payload.nonce != store.page.nonce) {
    //     throw new Error(503, { cause: "Nonce mismatch" })
    // }

    // console.log(`nonce check. Is "${payload.nonce}" == "${store.page.nonce}"`)
    // TODO - how to pass nonce between the routes? the server is stateless!
    // Use KV for nonce? rgerenrate every hour?

    // Add nonce table in KV with datetime. if less than 1 hr old, check if nonce given for this userid is correct. if not, reject. 
    // if yes, delete nonce from table and continue. if more than 1 hr old, delete nonce from table and reject.
    
    // ------------------------------------------
    // Insert user in db. 
    // ------------------------------------------
    let newUser = {
        slug        : crypto.randomUUID(),
        name        : "Nony Mouse",
        thumb       : "something", 
        honorific   : "none", 
        flair       : "none",
        role        : "user",
        level       : "wood",
        googleID   : payload.email
    }

    let res = await addGoogleUser(store, newUser);
    console.log(`addGoogleUser: ${res[0]}`)

    // ------------------------------------------
    // Put the SID & User details in the BAG
    // ------------------------------------------

    // Add to session store. TODO - add expiration time
    const sessionID = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/gi, '').substring(0, Math.random() * (63 - 57) + 57)
    await store.env.SESSIONS.put(sessionID, newUser.slug);

    // Add to sessionid to the bag. TODO - add expiration time
    const bagID = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/gi, '').substring(0, Math.random() * (63 - 57) + 57)
    await store.env.BAG.put(bagID, sessionID);

    // console.log(`Session ID: ${sessionID}`)
    // console.log(`Bag ID: ${bagID}`)
    // console.log(`User Slug: ${newUser.slug}`)


    // read the value of the redirectTo query param
    const redirectTo = new URL(store.request.url).searchParams.get('redirectTo')
    // return Response.redirect(`${store.env.HOST}${redirectTo}?setSession=${sessionID}`, 302,  { headers: { 'Set-Cookie': cookie } })
    
    store.resp.status = 302
    store.resp.headers.append('Set-Cookie', `DIGGLUSID=${sessionID}; path=/; HttpOnly; Secure; SameSite=Strict;`)
    store.resp.headers.append('Location', `${store.env.HOST}${redirectTo}?triggerFragment=userDetailsModal&referEMail=${newUser.googleID}&setUserName=${newUser.name}&setUserThumb=${newUser.thumb}&setUserHonorific=${newUser.honorific}&setUserFlair=${newUser.flair}&setUserRole=${newUser.role}&setUserLevel=${newUser.level}`)

    // On each page, we can check if sessionid exists or not and then fetch the user details from this table.
}