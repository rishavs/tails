import * as jose from 'jose'
import { parseCookie } from '../utils.js'

export const signinGoogleUser = async (store) => {

    let data = await store.request.formData()

    let CSRFTokenInCookie = parseCookie(store.request.headers.get('cookie')).g_csrf_token
    let CSRFTokenInPost = data.get('g_csrf_token')
    let IDToken = data.get('credential')

    // data.forEach((value, key) => {
    //     console.log(`${key} ==> ${value}`);
    // })

    console.log(`CSRFTokenInCookie: ${CSRFTokenInCookie}`)
    console.log(`CSRFTokenInPost: ${CSRFTokenInPost}`)
    console.log(`IDToken: ${IDToken}`)

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

    const nonce = payload.nonce
    const email = payload.email
    const email_verified = payload.email_verified
    const name = payload.name
    const picture = payload.picture

    console.log(`nonce: ${nonce}`)
    console.log(`email: ${email}`)
    console.log(`email_verified: ${email_verified}`)
    console.log(`name: ${name}`)
    console.log(`picture: ${picture}`)

    // ------------------------------------------
    // Verify the nonce
    // ------------------------------------------

    if (!payload.nonce) {
        throw new Error(503, { cause: "No nonce present in the ID token" })
    }
    // if (payload.nonce != store.page.nonce) {
    //     throw new Error(503, { cause: "Nonce mismatch" })
    // }

    console.log(`nonce check. Is "${payload.nonce}" == "${store.page.nonce}"`)
    // TODO - how to pass nonce between the routes? the server is stateless!
    // Use KV for nonce? rgerenrate every hour?
    
    // ------------------------------------------
    // Check if user exists in db. add id to store, if it does. create user if not.
    // ------------------------------------------
    store.user.googleID = payload.email

    


    // ------------------------------------------
    // Create a session
    // ------------------------------------------


    
    store.resp.status = 200
    store.resp.content = JSON.stringify(payload)
}