import {jwtVerify, createRemoteJWKSet} from 'jose'
// import { nanoid } from 'nanoid'
import { checkIfUserBlocked } from '../database'


// TODO - handle all errors in the UI. This is a post req.
export const signinGoogleUser = async (ctx) => {

    let formData = await ctx.req.raw.formData()

    let CSRFTokenInCookie = ctx.req.cookies.g_csrf_token
    let CSRFTokenInPost = formData.get('g_csrf_token')
    let IDToken = formData.get('credential')

    // // ------------------------------------------
    // // Verify CSRF
    // // ------------------------------------------
    if (!CSRFTokenInCookie) {
        throw new Error("503", { cause: "No CSRF token present in the google cookie" })
    }
    if (!CSRFTokenInPost) {
        throw new Error("503", { cause: "No CSRF token present in the post body" })
    }

    if (CSRFTokenInCookie != CSRFTokenInPost) {
        throw new Error("503", { cause: "CSRF token mismatch" })
    } 

    console.log(`CSRF OK as "${ctx.req.cookies.g_csrf_token}" == "${formData.get('g_csrf_token')}"`)

    // // ------------------------------------------
    // // Verify the ID Token
    // // ------------------------------------------
    const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

    const { payload, protectedHeader } = await jwtVerify(IDToken, JWKS, {
        issuer: 'https://accounts.google.com',
        audience: ctx.env.GOOGLE_KEY_FULL
    })

    // ------------------------------------------
    // Check if user is blocked
    // ------------------------------------------
    let resUserBlocked = await checkIfUserBlocked(ctx, payload.email)
    console.log(`User Blocked: ${resUserBlocked}`)
    if (resUserBlocked.length != 0) {
        throw new Error("503", { cause: `This user id is blocked. 
        You can no longer create an accont on Digglu` })
    }

    console.log(`User has been verified as "${payload.email}"`)

    // // ------------------------------------------
    // // Get user details from DB. Else add to db
    // // ------------------------------------------
    // let user: User = {} as User
    // let isNewUser = false
    // let resUserExists =  getGoogleUserFromDB(ctx, payload.email as string)

    // if (resUserExists.size != 0) {
    //     // console.log(`user exists`, JSON.stringify(user))
    //     user = resUserExists.rows[0] as User
    //     console.log(`user exists`, JSON.stringify(user))
    // } else {
    //     // console.log(`user doesn't exist`)
    //     isNewUser = true

    //     // create new user with default values
    //     user.id             = nanoid(16)
    //     user.slug           = nanoid()
    //     user.name           = payload.name as string
    //     user.thumb          = `https://robohash.org/${user.slug}?set=set3`
    //     user.honorific      = "Mx"
    //     user.flair          = "Nony is not a Mouse"
    //     user.role           = "user"
    //     user.level          = "wood"
    //     user.stars          = 0
    //     user.creds          = 0
    //     user.gil            = 0
    //     user.google_id      = payload.email as string
        
    //     let resAddUser =  addGoogleUserToDB(ctx, user)
    //     if (resAddUser.rowsAffected != 1) {
    //         throw new Error("503", { cause: "Unable to add user to DB" })
    //     }
    //     // Trigger FRE for user
    //     ctx.res.headers.append('Set-Cookie', `D_FRE=true; path=/; SameSite=Strict;`)

    // }

    // // Remove id and google_id from the user object
    // user.id = ""
    // user.google_id = ""

    // // uri encode the url parts of the User object
    // user.thumb         = encodeURIComponent(user.thumb)

    // // ------------------------------------------
    // // TODO - Tell the user about the punishment status, if any
    // // ------------------------------------------
    // // if (user.warned_till && user.warned_till > new Date().toISOString()) {
    // //     ctx.res.headers.append('Set-Cookie', `D_TOAST_WARNING={for:${user.warned_for}, till:${user.warned_till}; path=/; SameSite=Strict;`)
    // // }
    // // if (user.exiled_till && user.exiled_till > new Date().toISOString()) {
    // //     ctx.res.headers.append('Set-Cookie', `D_TOAST_EXILE=You are exiled till ${user.exiled_till}; path=/; SameSite=Strict;`)
    // // }
    // // if (user.banned_till && user.banned_till > new Date().toISOString()) {
    // //     ctx.res.headers.append('Set-Cookie', `D_TOAST_BAN=You are banned till ${user.banned_till}; path=/; SameSite=Strict;`)
    // // }

    // // ------------------------------------------
    // // create session id. set session in db. set session cookie
    // // ------------------------------------------
    // let sessionId = nanoid(36)
    // let _ =  addNewSession(ctx, sessionId, user.id, ctx.req.raw.headers.get('User-Agent') || "")

    // console.log("New User Session :", user)

    // ctx.res.headers.append('Set-Cookie', `D_UID=${sessionId}; path=/; HttpOnly; Secure; SameSite=Strict;`)

    // // send the user object in the cookie
    // ctx.res.headers.append('Set-Cookie', `D_NEW_SESSION=${JSON.stringify(user)}; path=/; SameSite=Strict;`)

    // // ------------------------------------------
    // // Redirect to the original page
    // // ------------------------------------------
    // // get the query param for redirectTo
    // let redirectTo = ctx.req.url.origin + ctx.req.url.searchParams.get('redirectTo') || ctx.req.url.origin + '/'
    // console.log(`redirectTo: ${redirectTo}`)

    // // set window location
    // ctx.res.status = 302
    // ctx.res.headers.append('Location', redirectTo)
}