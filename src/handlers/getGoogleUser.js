import * as jose from 'jose'
import { parseCookie } from '../utils.js'
import { getUserDetails, addGoogleUser } from '../database.js'

export const getGoogleUser = async (store) => {

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
    // Get user details from DB. Else ad to db
    // ------------------------------------------
    store.user.email = payload.email

    let user = await getUserDetails(store)
    console.log(`getUserDetails:`, JSON.stringify(user))
    console.log()
    if (user.length != 0) {
        console.log(`user exists`, JSON.stringify(user))
        // Add user details from db to store
        store.user.slug         = user[0].slug
        store.user.name         = user[0].name
        store.user.thumb        = user[0].thumb
        store.user.honorific    = user[0].honorific
        store.user.flair        = user[0].flair
        store.user.role         = user[0].role
        store.user.level        = user[0].level

    } else {
        console.log(`user doesn't exist`)
        // create new user with default values
        store.user.slug         = crypto.randomUUID()
        store.user.name         = "Nony Mouse"
        store.user.thumb        = "something"
        store.user.honorific    = "none"
        store.user.flair        = "none"
        store.user.role         = "user"
        store.user.level        = "wood"
        store.user.google_id    = payload.email

        let res = await addGoogleUser(store)
        console.log(`Added New Google User: ${res}`)

        store.page.fre = true
    }

    console.log(`store.user\n`, JSON.stringify(store.user))
}