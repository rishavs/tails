import * as jose from 'jose'
import { parseCookie } from '../utils.js'
import { addGoogleUser } from '../database.js'

export const signinGoogleUser = async (store) => {

    let data = await store.request.formData()

    let CSRFTokenInCookie = parseCookie(store.request.headers.get('cookie')).g_csrf_token
    let CSRFTokenInPost = data.get('g_csrf_token')
    let IDToken = data.get('credential')

    // data.forEach((value, key) => {
    //     console.log(`${key} ==> ${value}`);
    // })

    // console.log(`CSRFTokenInCookie: ${CSRFTokenInCookie}`)
    // console.log(`CSRFTokenInPost: ${CSRFTokenInPost}`)
    // console.log(`IDToken: ${IDToken}`)

    // // Display the key/value pairs
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
        audience: "326093643211-dh58srqtltvqfakqta4us0il2vgnkenr.apps.googleusercontent.com"
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
    // console.log(`addGoogleUser: ${res[0]}`)

    // ------------------------------------------
    // Set the user in the store
    // ------------------------------------------
    store.user.googleID     = newUser.googleID
    store.user.name         = newUser.name
    store.user.thumb        = newUser.picture
    store.user.slug         = newUser.slug
    store.user.honorific    = newUser.honorific
    store.user.flair        = newUser.flair
    store.user.role         = newUser.role
    store.user.level        = newUser.level


    store.resp.status = 200
    store.resp.content = JSON.stringify(payload)
}